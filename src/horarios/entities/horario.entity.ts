import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Aula } from '../../aulas/entities/aula.entity';
import { Seccion } from '../../secciones/entities/seccion.entity';
import { timeTransformer } from '../../common/transformers/time.transformer';

@Entity('horario')
export class Horario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'seccion_id' })
  seccionId: number;

  @ManyToOne(() => Seccion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seccion_id' })
  seccion: Seccion;

  @Column({ name: 'aula_id' })
  aulaId: number;

  @ManyToOne(() => Aula)
  @JoinColumn({ name: 'aula_id' })
  aula: Aula;

  // Lo escribe el trigger trg_horario_set_profesor desde la sección
  @Column({
    name: 'profesor_externo_id',
    type: 'varchar',
    length: 64,
    nullable: true,
    insert: false,
    update: false,
  })
  profesorExternoId: string | null;

  @Column({ name: 'dia_semana', type: 'smallint' })
  diaSemana: number;

  @Column({ name: 'hora_inicio', type: 'time', transformer: timeTransformer })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time', transformer: timeTransformer })
  horaFin: string;
}
