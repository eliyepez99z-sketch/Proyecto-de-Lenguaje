import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from '../aulas/entities/aula.entity';
import { Periodo } from '../periodos/entities/periodo.entity';
import { Seccion } from '../secciones/entities/seccion.entity';
import { Horario } from './entities/horario.entity';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Horario, Seccion, Aula, Periodo])],
  controllers: [HorariosController],
  providers: [HorariosService],
  exports: [TypeOrmModule, HorariosService],
})
export class HorariosModule {}
