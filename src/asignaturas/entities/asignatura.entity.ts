import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { numericTransformer } from '../../common/transformers/numeric.transformer';

@Entity('asignatura')
export class Asignatura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'smallint' })
  creditos: number;

  @Column({
    name: 'limite_inasistencia_pct',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 25,
    transformer: numericTransformer,
  })
  limiteInasistenciaPct: number;

  @Column({ name: 'tardanzas_por_ausencia', type: 'smallint', default: 3 })
  tardanzasPorAusencia: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
