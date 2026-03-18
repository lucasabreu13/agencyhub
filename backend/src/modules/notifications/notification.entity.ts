import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'agency_id', nullable: true })
  agencyId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'info' }) // info | success | warning | error
  type: string;

  @Column({ nullable: true })
  link: string; // URL para redirecionar ao clicar

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
