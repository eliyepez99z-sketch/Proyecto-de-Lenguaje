import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min,
} from 'class-validator';

export class CreateAsignaturaDto {
  @ApiProperty({ example: 'MAT101' })
  @IsString() @IsNotEmpty() @MaxLength(20)
  codigo: string;

  @ApiProperty({ example: 'Cálculo I' })
  @IsString() @IsNotEmpty() @MaxLength(150)
  nombre: string;

  @ApiProperty({ example: 4 })
  @IsInt() @Min(1)
  creditos: number;

  @ApiPropertyOptional({ example: 25, description: '% máximo de inasistencia' })
  @IsOptional() @IsNumber() @Min(0) @Max(100)
  limiteInasistenciaPct?: number;

  @ApiPropertyOptional({ example: 3, description: '0 = la tardanza no penaliza' })
  @IsOptional() @IsInt() @Min(0)
  tardanzasPorAusencia?: number;
}
