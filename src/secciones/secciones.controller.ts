import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import { SeccionesService } from './secciones.service';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
import { AsignarProfesorDto } from './dto/asignar-profesor.dto';

@ApiTags('Secciones')
@ApiBearerAuth()
@Controller('secciones')
export class SeccionesController {
  constructor(private readonly service: SeccionesService) {}

  @Post() @Roles(Rol.ADMIN)
  create(@Body() dto: CreateSeccionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'periodoId', required: false })
  @ApiQuery({ name: 'asignaturaId', required: false })
  @ApiQuery({ name: 'profesor', required: false })
  findAll(
    @Query('periodoId', new ParseIntPipe({ optional: true })) periodoId?: number,
    @Query('asignaturaId', new ParseIntPipe({ optional: true })) asignaturaId?: number,
    @Query('profesor') profesor?: string,
  ) {
    return this.service.findAll({ periodoId, asignaturaId, profesor });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id') @Roles(Rol.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSeccionDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/profesor') @Roles(Rol.ADMIN)
  asignarProfesor(@Param('id', ParseIntPipe) id: number, @Body() dto: AsignarProfesorDto) {
    return this.service.asignarProfesor(id, dto.profesorExternoId);
  }

  @Delete(':id') @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
