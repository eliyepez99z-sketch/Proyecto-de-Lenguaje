import { ValueTransformer } from 'typeorm';

// PostgreSQL devuelve TIME como "HH:mm:ss"; la API expone "HH:mm"
export const timeTransformer: ValueTransformer = {
  to: (v?: string | null) => v,
  from: (v?: string | null) => (v === null || v === undefined ? v : v.slice(0, 5)),
};
