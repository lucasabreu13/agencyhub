import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum KanbanColumn {
  BACKLOG = 'backlog',
  TODO = 'todo',
  DOING = 'doing',
  REVIEW = 'review',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('kanban_tasks')
export class KanbanTask extends BaseEntity {
  @Column({ name: 'agency_id' })
  agencyId: string;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @Column({ name: 'client_id', nullable: true })
  clientId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: KanbanColumn, default: KanbanColumn.BACKLOG })
  column: KanbanColumn;

  @Column({ default: 0 })
  position: number; // Ordem dentro da coluna

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];
}
