import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ name: 'agency_id' })
  agencyId: string;

  @Column({ name: 'client_id', nullable: true })
  clientId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Column({ type: 'enum', enum: ProjectPriority, default: ProjectPriority.MEDIUM })
  priority: ProjectPriority;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'assigned_to', length: 255, nullable: true })
  assignedTo: string;
}
