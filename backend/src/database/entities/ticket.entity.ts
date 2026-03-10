import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum TicketType {
  CAMPAIGN = 'campaign',
  REPORT = 'report',
  FINANCIAL = 'financial',
  MEETING = 'meeting',
  OTHER = 'other',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('tickets')
export class Ticket extends BaseEntity {
  @Column({ name: 'agency_id', nullable: true })
  agencyId: string | null; // NULL = ticket da própria plataforma (admin)

  @Column({ name: 'client_id', nullable: true })
  clientId: string | null;

  @Column({ name: 'created_by' })
  createdBy: string; // user id

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string | null;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TicketType, default: TicketType.OTHER })
  type: TicketType;

  @Column({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIUM })
  priority: TicketPriority;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column({ name: 'sla_hours', default: 24 })
  slaHours: number;

  @Column({ name: 'linked_entity_type', nullable: true })
  linkedEntityType: string | null;

  @Column({ name: 'linked_entity_id', nullable: true })
  linkedEntityId: string | null;

  @Column({ name: 'resolved_at', nullable: true })
  resolvedAt: Date | null;
}
