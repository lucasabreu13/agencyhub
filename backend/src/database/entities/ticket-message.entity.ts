import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('ticket_messages')
export class TicketMessage extends BaseEntity {
  @Column({ name: 'ticket_id' })
  ticketId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_name', length: 255 })
  userName: string;

  @Column({ name: 'user_role', length: 50 })
  userRole: string;

  @Column({ type: 'text' })
  content: string;
}
