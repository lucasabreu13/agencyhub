import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionScope {
  PLATFORM = 'platform', // receita/despesa da própria plataforma (admin)
  AGENCY = 'agency',     // receita/despesa de uma agência
}

@Entity('financial_transactions')
export class FinancialTransaction extends BaseEntity {
  @Column({ name: 'agency_id', nullable: true })
  agencyId: string | null;

  @Column({ name: 'client_id', nullable: true })
  clientId: string | null;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ type: 'enum', enum: TransactionScope, default: TransactionScope.AGENCY })
  scope: TransactionScope;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 255 })
  description: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
