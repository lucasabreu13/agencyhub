import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SubscriptionStatus } from '../../common/enums';

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

  @Column({
    name: 'subscription_status',
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.TRIAL,
  })
  subscriptionStatus: SubscriptionStatus;

  @Column({ name: 'trial_ends_at', type: 'timestamp', nullable: true })
  trialEndsAt: Date | null;

  @Column({ name: 'stripe_customer_id', length: 255, nullable: true })
  stripeCustomerId: string | null;

  @Column({ name: 'stripe_subscription_id', length: 255, nullable: true })
  stripeSubscriptionId: string | null;

  // Relacionamentos definidos nos outros arquivos para evitar circular deps
}
