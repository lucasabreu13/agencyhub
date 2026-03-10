import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum EventType {
  MEETING = 'meeting',
  DELIVERY = 'delivery',
  REPORT = 'report',
  RENEWAL = 'renewal',
  OTHER = 'other',
}

export enum EventStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('events')
export class Event extends BaseEntity {
  @Column({ name: 'agency_id' })
  agencyId: string;

  @Column({ name: 'client_id', nullable: true })
  clientId: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: EventType, default: EventType.OTHER })
  type: EventType;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.PENDING })
  status: EventStatus;

  @Column({ name: 'meeting_link', nullable: true })
  meetingLink: string;

  // Participantes como JSONB para simplicidade
  @Column({ type: 'jsonb', nullable: true })
  participants: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    confirmationStatus: 'pending' | 'confirmed' | 'declined';
  }>;
}
