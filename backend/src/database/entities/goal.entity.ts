import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum GoalStatus {
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum GoalScope {
  PLATFORM = 'platform', // meta do admin
  AGENCY = 'agency',     // meta da agência
}

@Entity('goals')
export class Goal extends BaseEntity {
  @Column({ name: 'agency_id', nullable: true })
  agencyId: string | null; // NULL = meta da plataforma (admin)

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ type: 'enum', enum: GoalScope, default: GoalScope.AGENCY })
  scope: GoalScope;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'target_value', type: 'decimal', precision: 12, scale: 2 })
  targetValue: number;

  @Column({ name: 'current_value', type: 'decimal', precision: 12, scale: 2, default: 0 })
  currentValue: number;

  @Column({ length: 50, nullable: true })
  unit: string; // 'R$', '%', 'clientes', 'campanhas', etc.

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.ON_TRACK })
  status: GoalStatus;
}
