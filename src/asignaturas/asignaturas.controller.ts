import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import { AsignaturasService } from './asignaturas.service';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';

@ApiTags('Asignaturas')
@ApiBearerAuth()
@Controller('asignaturas')
export class AsignaturasController {
  constructor(private readonly service: AsignaturasService) {}

  @Post() @Roles(Rol.ADMIN)
  create(@Body() dto: CreateAsignaturaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id') @Roles(Rol.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAsignaturaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id') @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
