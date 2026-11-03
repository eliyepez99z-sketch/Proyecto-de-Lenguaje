import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleDbError } from '../common/utils/db-errors';
import { Periodo } from './entities/periodo.entity';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';

@Injectable()
export class PeriodosService {
  constructor(@InjectRepository(Periodo) private readonly repo: Repository<Periodo>) {}

  private validarFechas(inicio: string, fin: string) {
    if (fin <= inicio) {
      throw new BadRequestException('fechaFin debe ser posterior a fechaInicio');
    }
  }

  async create(dto: CreatePeriodoDto) {
    this.validarFechas(dto.fechaInicio, dto.fechaFin);
    try {
      return await this.repo.manager.transaction(async (m) => {
        if (dto.activo) await m.update(Periodo, { activo: true }, { activo: false });
        return m.save(m.create(Periodo, dto));
      });
    } catch (e) {
      handleDbError(e);
    }
  }

  findAll() {
    return this.repo.find({ order: { fechaInicio: 'DESC' } });
  }

  findActivo() {
    return this.repo.findOneBy({ activo: true });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Periodo ${id} no encontrado`);
    return item;
  }

  async update(id: number, dto: UpdatePeriodoDto) {
    const actual = await this.findOne(id);
    this.validarFechas(
      dto.fechaInicio ?? actual.fechaInicio,
      dto.fechaFin ?? actual.fechaFin,
    );
    try {
      await this.repo.manager.transaction(async (m) => {
        if (dto.activo) await m.update(Periodo, { activo: true }, { activo: false });
        if (Object.keys(dto).length) await m.update(Periodo, id, dto);
      });
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
