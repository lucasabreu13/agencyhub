import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum AgencyPlan {
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum AgencyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('agencies')
export class Agency extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: AgencyPlan,
    default: AgencyPlan.BASIC,
  })
  plan: AgencyPlan;

  @Column({
    type: 'enum',
    enum: AgencyStatus,
    default: AgencyStatus.ACTIVE,
  })
  status: AgencyStatus;

  @Column({ name: 'owner_id', nullable: true })
  ownerId: string;

  // Relacionamentos definidos nos outros arquivos para evitar circular deps
}
