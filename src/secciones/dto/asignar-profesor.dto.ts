import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AsignarProfesorDto {
  @ApiProperty({ example: 'P-10', description: 'id del profesor en el Proyecto 3' })
  @IsString() @IsNotEmpty() @MaxLength(64)
  profesorExternoId: string;
}
