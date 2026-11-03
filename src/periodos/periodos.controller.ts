import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import { PeriodosService } from './periodos.service';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';

@ApiTags('Periodos')
@ApiBearerAuth()
@Controller('periodos')
export class PeriodosController {
  constructor(private readonly service: PeriodosService) {}

  @Post() @Roles(Rol.ADMIN)
  create(@Body() dto: CreatePeriodoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Debe ir antes de ':id' para que "activo" no se interprete como id
  @Get('activo')
  findActivo() {
    return this.service.findActivo();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id') @Roles(Rol.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePeriodoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id') @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
