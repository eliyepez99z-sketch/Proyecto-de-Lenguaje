import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Matches, Max, Min } from 'class-validator';

export const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateHorarioDto {
  @ApiProperty({ example: 1 })
  @IsInt() @Min(1)
  seccionId: number;

  @ApiProperty({ example: 1 })
  @IsInt() @Min(1)
  aulaId: number;

  @ApiProperty({ example: 1, description: '1 = lunes ... 7 = domingo' })
  @IsInt() @Min(1) @Max(7)
  diaSemana: number;

  @ApiProperty({ example: '07:00', description: 'Formato HH:mm' })
  @Matches(HORA, { message: 'horaInicio debe tener formato HH:mm' })
  horaInicio: string;

  @ApiProperty({ example: '09:00', description: 'Formato HH:mm' })
  @Matches(HORA, { message: 'horaFin debe tener formato HH:mm' })
  horaFin: string;
}
