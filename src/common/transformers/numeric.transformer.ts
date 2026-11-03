import { ValueTransformer } from 'typeorm';

// PostgreSQL devuelve NUMERIC como string; lo convertimos a number
export const numericTransformer: ValueTransformer = {
  to: (v?: number | null) => v,
  from: (v?: string | null) =>
    v === null || v === undefined ? v : parseFloat(v),
};
