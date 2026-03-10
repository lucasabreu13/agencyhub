import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum ReportType {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export enum ReportStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  NEEDS_ADJUSTMENT = 'needsAdjustment',
}

@Entity('reports')
export class Report extends BaseEntity {
  @Column({ name: 'agency_id' })
  agencyId: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100, nullable: true })
  period: string;

  @Column({ type: 'enum', enum: ReportType, default: ReportType.MONTHLY })
  type: ReportType;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ name: 'pdf_url', nullable: true })
  pdfUrl: string;

  // Análise qualitativa da agência
  @Column({
    name: 'agency_summary',
    type: 'jsonb',
    nullable: true,
    default: { whatWorked: '', whatDidntWork: '', nextSteps: '' },
  })
  agencySummary: {
    whatWorked: string;
    whatDidntWork: string;
    nextSteps: string;
  };

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;
}
