const aMinutos = (h: string) => {
  const [hh, mm] = h.split(':').map(Number);
  return hh * 60 + mm;
};

export interface Bloque {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

// Rangos semiabiertos [inicio, fin): 08-10 y 10-12 NO chocan
export function haySolape(a: Bloque, b: Bloque): boolean {
  return (
    a.diaSemana === b.diaSemana &&
    aMinutos(a.horaInicio) < aMinutos(b.horaFin) &&
    aMinutos(b.horaInicio) < aMinutos(a.horaFin)
  );
}
