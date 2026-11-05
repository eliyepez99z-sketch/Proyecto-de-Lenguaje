import { describe, it, expect } from 'vitest';
import { haySolape } from './solape';

const b = (diaSemana: number, horaInicio: string, horaFin: string) => ({
  diaSemana,
  horaInicio,
  horaFin,
});

describe('haySolape', () => {
  it('detecta solape parcial', () =>
    expect(haySolape(b(1, '08:00', '10:00'), b(1, '09:00', '11:00'))).toBe(true));

  it('detecta bloque contenido', () =>
    expect(haySolape(b(1, '08:00', '12:00'), b(1, '09:00', '10:00'))).toBe(true));

  it('permite bloques contiguos', () =>
    expect(haySolape(b(1, '08:00', '10:00'), b(1, '10:00', '12:00'))).toBe(false));

  it('ignora días distintos', () =>
    expect(haySolape(b(1, '08:00', '10:00'), b(2, '08:00', '10:00'))).toBe(false));
});
