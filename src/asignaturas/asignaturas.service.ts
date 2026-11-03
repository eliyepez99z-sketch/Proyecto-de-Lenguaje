import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleDbError } from '../common/utils/db-errors';
import { Asignatura } from './entities/asignatura.entity';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';

@Injectable()
export class AsignaturasService {
  constructor(
    @InjectRepository(Asignatura) private readonly repo: Repository<Asignatura>,
  ) {}

  async create(dto: CreateAsignaturaDto) {
    try {
      return await this.repo.save(this.repo.create(dto));
    } catch (e) {
      handleDbError(e);
    }
  }

  findAll() {
    return this.repo.find({ order: { codigo: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Asignatura ${id} no encontrada`);
    return item;
  }

  async update(id: number, dto: UpdateAsignaturaDto) {
    await this.findOne(id);
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
}
