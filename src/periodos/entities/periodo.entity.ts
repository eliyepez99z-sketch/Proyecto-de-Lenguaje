import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('periodo')
export class Periodo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  nombre: string;

  // type 'date' llega como string YYYY-MM-DD (sin problemas de zona horaria)
  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: string;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: string;

  @Column({ default: false })
  activo: boolean;
}
