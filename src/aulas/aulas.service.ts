import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleDbError } from '../common/utils/db-errors';
import { Aula } from './entities/aula.entity';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Injectable()
export class AulasService {
  constructor(@InjectRepository(Aula) private readonly repo: Repository<Aula>) {}

  async create(dto: CreateAulaDto) {
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
    if (!item) throw new NotFoundException(`Aula ${id} no encontrada`);
    return item;
  }

  async update(id: number, dto: UpdateAulaDto) {
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
