import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum CampaignStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  FINISHED = 'finished',
}

@Entity('campaigns')
export class Campaign extends BaseEntity {
  @Column({ name: 'agency_id' }) agencyId: string;
  @Column({ name: 'client_id' }) clientId: string;
  @Column({ length: 255 }) name: string;
  @Column({ length: 100, nullable: true }) platform: string;
  @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.ACTIVE }) status: CampaignStatus;
  @Column({ length: 255, nullable: true }) objective: string;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) budget: number;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) spent: number;
  @Column({ name: 'start_date', type: 'date', nullable: true }) startDate: Date;
  @Column({ name: 'end_date', type: 'date', nullable: true }) endDate: Date;
  @Column({ name: 'kpi', length: 100, nullable: true }) kpi: string;
  @Column({ name: 'kpi_value', type: 'decimal', precision: 12, scale: 2, nullable: true }) kpiValue: number;
  @Column({ type: 'jsonb', nullable: true, default: { impressions: 0, clicks: 0, ctr: 0, conversions: 0 } })
  metrics: { impressions: number; clicks: number; ctr: number; conversions: number; cpc?: number };
  @Column({ name: 'agency_notes', type: 'text', nullable: true }) agencyNotes: string;
  @Column({ name: 'external_id', length: 100, nullable: true }) externalId: string;
}
