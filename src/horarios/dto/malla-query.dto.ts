import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class MallaQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Malla global del periodo' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  periodoId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Malla de una sección' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  seccionId?: number;

  @ApiPropertyOptional({ example: 'P-10', description: 'Malla de un profesor' })
  @IsOptional() @IsString() @MaxLength(64)
  profesor?: string;
}
