import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateSeccionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  asignaturaId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  periodoId: number;

  @ApiProperty({ example: '01' })
  @IsString() @IsNotEmpty() @MaxLength(20)
  codigo: string;

  @ApiProperty({ example: 30 })
  @IsInt() @Min(1)
  cupo: number;
}
