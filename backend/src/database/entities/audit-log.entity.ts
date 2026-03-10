import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

// Audit logs NUNCA têm soft delete — são imutáveis por design
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'agency_id', nullable: true })
  agencyId: string | null;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_name', length: 255 })
  userName: string;

  @Column({ name: 'user_role', length: 50 })
  userRole: string;

  @Column({ name: 'entity_type', length: 100 })
  entityType: string; // 'agency', 'user', 'campaign', etc.

  @Column({ name: 'entity_id', nullable: true })
  entityId: string | null;

  @Column({ length: 100 })
  action: string; // 'created', 'updated', 'deleted', 'login', etc.

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
