import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('reminders')
export class Reminder extends BaseEntity {
  @Column({ name: 'agency_id', nullable: true })
  agencyId: string | null; // NULL = lembrete do admin da plataforma

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column({ name: 'is_done', default: false })
  isDone: boolean;

  @Column({ name: 'done_at', nullable: true })
  doneAt: Date | null;
}
