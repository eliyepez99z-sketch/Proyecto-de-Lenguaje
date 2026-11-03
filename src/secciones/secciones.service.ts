import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { handleDbError } from '../common/utils/db-errors';
import { Seccion } from './entities/seccion.entity';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';

@Injectable()
export class SeccionesService {
  constructor(@InjectRepository(Seccion) private readonly repo: Repository<Seccion>) {}

  async create(dto: CreateSeccionDto) {
    try {
      const saved = await this.repo.save(this.repo.create(dto));
      return this.findOne(saved.id);
    } catch (e) {
      handleDbError(e);
    }
  }

  findAll(filtros: { periodoId?: number; asignaturaId?: number; profesor?: string }) {
    const where: FindOptionsWhere<Seccion> = {};
    if (filtros.periodoId) where.periodoId = filtros.periodoId;
    if (filtros.asignaturaId) where.asignaturaId = filtros.asignaturaId;
    if (filtros.profesor) where.profesorExternoId = filtros.profesor;
    return this.repo.find({
      where,
      relations: { asignatura: true, periodo: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: { asignatura: true, periodo: true },
    });
    if (!item) throw new NotFoundException(`Sección ${id} no encontrada`);
    return item;
  }

  async update(id: number, dto: UpdateSeccionDto) {
    await this.findOne(id);
    try {
      if (Object.keys(dto).length) await this.repo.update(id, dto);
    } catch (e) {
      handleDbError(e);
    }
    return this.findOne(id);
  }

  // TODO Fase 4: validar que el profesor exista y esté validado en el Proyecto 3
  async asignarProfesor(id: number, profesorExternoId: string) {
    await this.findOne(id);
    try {
      // Los triggers de BD sincronizan el profesor en los horarios; si genera
      // un cruce, la exclusion constraint lanza 23P01 -> 409
      await this.repo.update(id, { profesorExternoId });
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
}
