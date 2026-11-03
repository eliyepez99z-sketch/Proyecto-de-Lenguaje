import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from './entities/asignatura.entity';
import { AsignaturasService } from './asignaturas.service';
import { AsignaturasController } from './asignaturas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asignatura])],
  controllers: [AsignaturasController],
  providers: [AsignaturasService],
  exports: [TypeOrmModule, AsignaturasService],
})
export class AsignaturasModule {}
