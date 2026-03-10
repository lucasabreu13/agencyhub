import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum CrmStage {
  LEAD = 'lead',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
}

@Entity('crm_contacts')
export class CrmContact extends BaseEntity {
  @Column({ name: 'agency_id' })
  agencyId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  company: string;

  @Column({ length: 100, nullable: true })
  position: string;

  @Column({ type: 'enum', enum: CrmStage, default: CrmStage.LEAD })
  stage: CrmStage;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'deal_value' })
  dealValue: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'last_contact', type: 'date', nullable: true })
  lastContact: Date;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string;
}
