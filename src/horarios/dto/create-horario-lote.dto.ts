import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize, IsArray, IsInt, Matches, Max, Min, ValidateNested,
} from 'class-validator';
import { HORA } from './create-horario.dto';

export class CreateHorarioBloqueDto {
  @ApiProperty({ example: 1 })
  @IsInt() @Min(1)
  aulaId: number;

  @ApiProperty({ example: 1, description: '1 = lunes ... 7 = domingo' })
  @IsInt() @Min(1) @Max(7)
  diaSemana: number;

  @ApiProperty({ example: '07:00' })
  @Matches(HORA, { message: 'horaInicio debe tener formato HH:mm' })
  horaInicio: string;

  @ApiProperty({ example: '09:00' })
  @Matches(HORA, { message: 'horaFin debe tener formato HH:mm' })
  horaFin: string;
}

export class CreateHorarioLoteDto {
  @ApiProperty({ example: 1 })
  @IsInt() @Min(1)
  seccionId: number;

  @ApiProperty({ type: [CreateHorarioBloqueDto] })
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true })
  @Type(() => CreateHorarioBloqueDto)
  bloques: CreateHorarioBloqueDto[];
}
