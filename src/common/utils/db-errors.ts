import { BadRequestException, ConflictException } from '@nestjs/common';

// Traduce errores de PostgreSQL a respuestas HTTP consistentes
export function handleDbError(e: any): never {
  switch (e?.code) {
    case '23505':
      throw new ConflictException('Ya existe un registro con esos datos');
    case '23503':
      throw new ConflictException(
        'Referencia inexistente o el registro tiene datos relacionados',
      );
    case '23P01':
      throw new ConflictException('Cruce de horario detectado');
    case '23514':
      throw new BadRequestException('Un valor no cumple las restricciones');
  }
  throw e;
}
