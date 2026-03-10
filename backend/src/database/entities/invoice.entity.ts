import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  PIX = 'pix',
  CARD = 'card',
  BOLETO = 'boleto',
}

@Entity('invoices')
export class Invoice extends BaseEntity {
  @Column({ name: 'agency_id' })
  agencyId: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ unique: true, length: 50 })
  number: string; // ex: "NF-2026-001"

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate: Date;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
  status: InvoiceStatus;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_proof', nullable: true })
  paymentProof: string; // URL do comprovante

  @Column({ type: 'jsonb', default: [] })
  items: Array<{ description: string; amount: number }>;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
