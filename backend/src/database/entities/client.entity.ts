import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
}

@Entity('clients')
export class Client extends BaseEntity {
  @Column({ name: 'agency_id' })
  agencyId: string; // Tenant key — obrigatório

  @Column({ name: 'user_id', nullable: true })
  userId: string | null; // Conta de acesso do cliente (pode não ter)

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255, nullable: true })
  company: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({
    name: 'monthly_budget',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  monthlyBudget: number;

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.ACTIVE,
  })
  status: ClientStatus;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
