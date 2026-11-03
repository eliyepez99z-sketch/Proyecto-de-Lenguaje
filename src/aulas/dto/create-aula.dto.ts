import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateAulaDto {
  @ApiProperty({ example: 'A-101' })
  @IsString() @IsNotEmpty() @MaxLength(20)
  codigo: string;

  @ApiProperty({ example: 'Aula 101' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 30 })
  @IsInt() @Min(1)
  capacidad: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional() @IsBoolean()
  activa?: boolean;
}
