import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

export class CreatePeriodoDto {
  @ApiProperty({ example: '2026-2' })
  @IsString() @IsNotEmpty() @MaxLength(50)
  nombre: string;

  @ApiProperty({ example: '2026-08-03' })
  @Matches(FECHA, { message: 'fechaInicio debe tener formato YYYY-MM-DD' })
  fechaInicio: string;

  @ApiProperty({ example: '2026-12-04' })
  @Matches(FECHA, { message: 'fechaFin debe tener formato YYYY-MM-DD' })
  fechaFin: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional() @IsBoolean()
  activo?: boolean;
}
