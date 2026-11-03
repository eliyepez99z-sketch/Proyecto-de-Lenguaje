import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import { AulasService } from './aulas.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@ApiTags('Aulas')
@ApiBearerAuth()
@Controller('aulas')
export class AulasController {
  constructor(private readonly service: AulasService) {}

  @Post() @Roles(Rol.ADMIN)
  create(@Body() dto: CreateAulaDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAulaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id') @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
