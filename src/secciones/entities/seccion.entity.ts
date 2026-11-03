import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Asignatura } from '../../asignaturas/entities/asignatura.entity';
import { Periodo } from '../../periodos/entities/periodo.entity';

@Entity('seccion')
export class Seccion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'asignatura_id' })
  asignaturaId: number;

  @ManyToOne(() => Asignatura)
  @JoinColumn({ name: 'asignatura_id' })
  asignatura: Asignatura;

  @Column({ name: 'periodo_id' })
  periodoId: number;

  @ManyToOne(() => Periodo)
  @JoinColumn({ name: 'periodo_id' })
  periodo: Periodo;

  @Column({ length: 20 })
  codigo: string;

  @Column({ name: 'profesor_externo_id', type: 'varchar', length: 64, nullable: true })
  profesorExternoId: string | null;

  @Column({ type: 'smallint' })
  cupo: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
