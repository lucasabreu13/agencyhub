import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @Column({ name: 'agency_id' })
  agencyId: string;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ name: 'receiver_id' })
  receiverId: string;

  @Column({ name: 'client_id', nullable: true })
  clientId: string; // Contexto do cliente nessa conversa

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'read_at', nullable: true })
  readAt: Date;

  @Column({ name: 'attachment_url', nullable: true })
  attachmentUrl: string;
}
