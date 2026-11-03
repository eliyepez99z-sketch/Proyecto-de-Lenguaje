import {
  BadRequestException, ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { handleDbError } from '../common/utils/db-errors';
import { Aula } from '../aulas/entities/aula.entity';
import { Periodo } from '../periodos/entities/periodo.entity';
import { Seccion } from '../secciones/entities/seccion.entity';
import { Horario } from './entities/horario.entity';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { QueryHorarioDto } from './dto/query-horario.dto';
import { MallaQueryDto } from './dto/malla-query.dto';
import { CreateHorarioLoteDto } from './dto/create-horario-lote.dto';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

interface DatosBloque {
  seccionId: number;
  aulaId: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  profesorExternoId: string | null;
}

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario) private readonly repo: Repository<Horario>,
    @InjectRepository(Seccion) private readonly seccionRepo: Repository<Seccion>,
    @InjectRepository(Aula) private readonly aulaRepo: Repository<Aula>,
    @InjectRepository(Periodo) private readonly periodoRepo: Repository<Periodo>,
  ) {}

  private static aMinutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  private validarRango(inicio: string, fin: string) {
    if (HorariosService.aMinutos(fin) <= HorariosService.aMinutos(inicio)) {
      throw new BadRequestException('horaFin debe ser posterior a horaInicio');
    }
  }

  private async getSeccion(id: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Seccion) : this.seccionRepo;
    const seccion = await repo.findOneBy({ id });
    if (!seccion) throw new NotFoundException(`Sección ${id} no encontrada`);
    return seccion;
  }

  private validarProfesor(seccion: Seccion) {
    if (!seccion.profesorExternoId) {
      throw new BadRequestException(
        `La sección ${seccion.codigo} no tiene profesor asignado`,
      );
    }
  }

  private async validarAula(aulaId: number, cupo: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Aula) : this.aulaRepo;
    const aula = await repo.findOneBy({ id: aulaId });
    if (!aula) throw new NotFoundException(`Aula ${aulaId} no encontrada`);
    if (!aula.activa) {
      throw new BadRequestException(`El aula ${aula.codigo} está inactiva`);
    }
    if (aula.capacidad < cupo) {
      throw new BadRequestException(
        `El aula ${aula.codigo} tiene capacidad ${aula.capacidad} y la sección requiere ${cupo}`,
      );
    }
    return aula;
  }

  // Pre-validación amigable: dice exactamente qué recurso choca.
  // Las exclusion constraints de PostgreSQL siguen siendo la garantía atómica.
  private async detectarCruces(
    manager: EntityManager,
    datos: DatosBloque,
    excluirId?: number,
  ) {
    const prof = datos.profesorExternoId ?? '__sin_profesor__';

    const qb = manager
      .getRepository(Horario)
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.aula', 'aula')
      .leftJoinAndSelect('h.seccion', 'seccion')
      .where('h.dia_semana = :dia', { dia: datos.diaSemana })
      .andWhere('h.hora_inicio < :fin', { fin: datos.horaFin })
      .andWhere('h.hora_fin > :inicio', { inicio: datos.horaInicio })
      .andWhere(
        '(h.aula_id = :aulaId OR h.seccion_id = :seccionId OR h.profesor_externo_id = :prof)',
        { aulaId: datos.aulaId, seccionId: datos.seccionId, prof },
      );

    if (excluirId) qb.andWhere('h.id != :excluirId', { excluirId });

    const solapados = await qb.getMany();
    if (solapados.length === 0) return;

    const dia = DIAS[datos.diaSemana - 1];
    const conflictos: string[] = [];

    for (const h of solapados) {
      const franja = `${h.horaInicio}-${h.horaFin}`;
      if (h.aulaId === datos.aulaId) {
        conflictos.push(`Aula ${h.aula?.codigo ?? h.aulaId} ocupada el ${dia} ${franja}`);
      }
      if (h.seccionId === datos.seccionId) {
        conflictos.push(
          `La sección ${h.seccion?.codigo ?? h.seccionId} ya tiene clase el ${dia} ${franja}`,
        );
      }
      if (datos.profesorExternoId && h.profesorExternoId === datos.profesorExternoId) {
        conflictos.push(
          `El profesor ${datos.profesorExternoId} ya tiene clase el ${dia} ${franja}`,
        );
      }
    }

    throw new ConflictException({
      message: 'Cruce de horario detectado',
      conflictos: [...new Set(conflictos)],
    });
  }

  private baseQuery() {
    return this.repo
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.aula', 'aula')
      .leftJoinAndSelect('h.seccion', 'seccion')
      .leftJoinAndSelect('seccion.asignatura', 'asignatura')
      .leftJoinAndSelect('seccion.periodo', 'periodo')
      .orderBy('h.dia_semana', 'ASC')
      .addOrderBy('h.hora_inicio', 'ASC');
  }

  async create(dto: CreateHorarioDto) {
    const seccion = await this.getSeccion(dto.seccionId);
    this.validarProfesor(seccion);
    this.validarRango(dto.horaInicio, dto.horaFin);
    await this.validarAula(dto.aulaId, seccion.cupo);
    await this.detectarCruces(this.repo.manager, {
      ...dto,
      profesorExternoId: seccion.profesorExternoId,
    });

    try {
      const saved = await this.repo.save(this.repo.create(dto));
      return this.findOne(saved.id);
    } catch (e) {
      handleDbError(e);
    }
  }

  // Todo o nada: si un bloque choca, no se guarda ninguno.
  async createLote(dto: CreateHorarioLoteDto) {
    try {
      const ids = await this.repo.manager.transaction(async (m) => {
        const seccion = await this.getSeccion(dto.seccionId, m);
        this.validarProfesor(seccion);

        const creados: number[] = [];
        for (const bloque of dto.bloques) {
          this.validarRango(bloque.horaInicio, bloque.horaFin);
          await this.validarAula(bloque.aulaId, seccion.cupo, m);
          await this.detectarCruces(m, {
            ...bloque,
            seccionId: dto.seccionId,
            profesorExternoId: seccion.profesorExternoId,
          });

          const repo = m.getRepository(Horario);
          const saved = await repo.save(
            repo.create({ ...bloque, seccionId: dto.seccionId }),
          );
          creados.push(saved.id);
        }
        return creados;
      });

      return Promise.all(ids.map((id) => this.findOne(id)));
    } catch (e) {
      handleDbError(e);
    }
  }

  findAll(filtros: QueryHorarioDto) {
    const qb = this.baseQuery();
    if (filtros.periodoId) {
      qb.andWhere('seccion.periodo_id = :periodoId', { periodoId: filtros.periodoId });
    }
    if (filtros.seccionId) {
      qb.andWhere('h.seccion_id = :seccionId', { seccionId: filtros.seccionId });
    }
    if (filtros.aulaId) {
      qb.andWhere('h.aula_id = :aulaId', { aulaId: filtros.aulaId });
    }
    if (filtros.profesor) {
      qb.andWhere('h.profesor_externo_id = :profesor', { profesor: filtros.profesor });
    }
    if (filtros.diaSemana) {
      qb.andWhere('h.dia_semana = :diaSemana', { diaSemana: filtros.diaSemana });
    }
    return qb.getMany();
  }

  async findOne(id: number) {
    const item = await this.baseQuery().andWhere('h.id = :id', { id }).getOne();
    if (!item) throw new NotFoundException(`Horario ${id} no encontrado`);
    return item;
  }

  async update(id: number, dto: UpdateHorarioDto) {
    const actual = await this.findOne(id);

    const seccionId = dto.seccionId ?? actual.seccionId;
    const aulaId = dto.aulaId ?? actual.aulaId;
    const diaSemana = dto.diaSemana ?? actual.diaSemana;
    const horaInicio = dto.horaInicio ?? actual.horaInicio;
    const horaFin = dto.horaFin ?? actual.horaFin;

    const seccion = await this.getSeccion(seccionId);
    this.validarProfesor(seccion);
    this.validarRango(horaInicio, horaFin);
    await this.validarAula(aulaId, seccion.cupo);
    await this.detectarCruces(
      this.repo.manager,
      {
        seccionId,
        aulaId,
        diaSemana,
        horaInicio,
        horaFin,
        profesorExternoId: seccion.profesorExternoId,
      },
      id,
    );

    try {
      if (Object.keys(dto).length) await this.repo.update(id, dto);
    } catch (e) {
      handleDbError(e);
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      await this.repo.delete(id);
    } catch (e) {
      handleDbError(e);
    }
    return { deleted: true };
  }

  async malla(filtros: MallaQueryDto) {
    const alcance = filtros.seccionId
      ? 'seccion'
      : filtros.profesor
        ? 'profesor'
        : 'periodo';

    let periodo: Periodo | null = null;
    let seccion: Seccion | null = null;

    if (filtros.seccionId) {
      seccion = await this.seccionRepo.findOne({
        where: { id: filtros.seccionId },
        relations: { asignatura: true, periodo: true },
      });
      if (!seccion) throw new NotFoundException(`Sección ${filtros.seccionId} no encontrada`);
    }

    if (filtros.periodoId) {
      periodo = await this.periodoRepo.findOneBy({ id: filtros.periodoId });
      if (!periodo) throw new NotFoundException(`Periodo ${filtros.periodoId} no encontrado`);
    } else if (seccion) {
      periodo = seccion.periodo ?? null;
    } else if (alcance === 'periodo') {
      periodo = await this.periodoRepo.findOneBy({ activo: true });
      if (!periodo) {
        throw new BadRequestException(
          'No hay periodo activo; indica periodoId para ver la malla global',
        );
      }
    }

    const qb = this.baseQuery();
    if (filtros.seccionId) {
      qb.andWhere('h.seccion_id = :seccionId', { seccionId: filtros.seccionId });
    }
    if (filtros.profesor) {
      qb.andWhere('h.profesor_externo_id = :profesor', { profesor: filtros.profesor });
    }
    if (periodo) {
      qb.andWhere('seccion.periodo_id = :periodoId', { periodoId: periodo.id });
    }

    const filas = await qb.getMany();

    const franjas = [
      ...new Set(filas.map((h) => `${h.horaInicio}|${h.horaFin}`)),
    ]
      .map((f) => {
        const [horaInicio, horaFin] = f.split('|');
        return { horaInicio, horaFin };
      })
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    const dias = DIAS.map((nombre, i) => {
      const dia = i + 1;
      const bloques = new Map<string, any[]>();

      for (const h of filas.filter((f) => f.diaSemana === dia)) {
        const clave = `${h.horaInicio}|${h.horaFin}`;
        const clases = bloques.get(clave) ?? [];
        clases.push({
          horarioId: h.id,
          seccionId: h.seccionId,
          seccion: h.seccion?.codigo,
          asignatura: h.seccion?.asignatura?.codigo,
          asignaturaNombre: h.seccion?.asignatura?.nombre,
          aula: h.aula?.codigo,
          aulaNombre: h.aula?.nombre,
          profesor: h.profesorExternoId,
        });
        bloques.set(clave, clases);
      }

      return {
        dia,
        nombre,
        bloques: [...bloques.entries()]
          .map(([clave, clases]) => {
            const [horaInicio, horaFin] = clave.split('|');
            return { horaInicio, horaFin, clases };
          })
          .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
      };
    });

    return {
      alcance,
      periodo: periodo ? { id: periodo.id, nombre: periodo.nombre } : null,
      seccion: seccion
        ? {
            id: seccion.id,
            codigo: seccion.codigo,
            asignatura: seccion.asignatura?.codigo,
            profesor: seccion.profesorExternoId,
          }
        : null,
      profesor: filtros.profesor ?? null,
      franjas,
      dias,
    };
  }
}
