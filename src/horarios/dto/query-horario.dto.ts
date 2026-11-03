import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class QueryHorarioDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  periodoId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  seccionId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  aulaId?: number;

  @ApiPropertyOptional({ example: 'P-10' })
  @IsOptional() @IsString() @MaxLength(64)
  profesor?: string;

  @ApiPropertyOptional({ example: 1, description: '1 = lunes ... 7 = domingo' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(7)
  diaSemana?: number;
}
