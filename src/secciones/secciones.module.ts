import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seccion } from './entities/seccion.entity';
import { SeccionesService } from './secciones.service';
import { SeccionesController } from './secciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Seccion])],
  controllers: [SeccionesController],
  providers: [SeccionesService],
  exports: [TypeOrmModule, SeccionesService],
})
export class SeccionesModule {}
