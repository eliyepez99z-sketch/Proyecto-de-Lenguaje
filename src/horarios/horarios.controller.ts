import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { QueryHorarioDto } from './dto/query-horario.dto';
import { MallaQueryDto } from './dto/malla-query.dto';
import { CreateHorarioLoteDto } from './dto/create-horario-lote.dto';

@ApiTags('Horarios')
@ApiBearerAuth()
@Controller('horarios')
export class HorariosController {
  constructor(private readonly service: HorariosService) {}

  @Post() @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Crea un bloque horario (valida cruces)' })
  create(@Body() dto: CreateHorarioDto) {
    return this.service.create(dto);
  }

  @Post('lote') @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Crea varios bloques de una sección en una transacción' })
  createLote(@Body() dto: CreateHorarioLoteDto) {
    return this.service.createLote(dto);
  }

  @Get()
  findAll(@Query() filtros: QueryHorarioDto) {
    return this.service.findAll(filtros);
  }

  // Debe ir antes de ':id' para que "malla" no se interprete como id
  @Get('malla')
  @ApiOperation({ summary: 'Malla semanal por sección, profesor o periodo' })
  malla(@Query() filtros: MallaQueryDto) {
    return this.service.malla(filtros);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id') @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Mueve/edita un bloque (revalida cruces)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHorarioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id') @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
