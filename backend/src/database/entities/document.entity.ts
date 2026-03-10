import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('documents')
export class Document extends BaseEntity {
  @Column({ name: 'agency_id' })
  agencyId: string;

  @Column({ name: 'client_id', nullable: true })
  clientId: string; // NULL = documento interno da agência

  @Column({ name: 'uploaded_by' })
  uploadedBy: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'file_url' })
  fileUrl: string;

  @Column({ name: 'file_type', length: 50, nullable: true })
  fileType: string; // 'pdf', 'docx', 'xlsx', etc.

  @Column({ name: 'file_size', nullable: true })
  fileSize: number; // bytes

  @Column({ length: 100, nullable: true })
  category: string; // 'contrato', 'proposta', 'relatório', etc.

  @Column({ type: 'text', nullable: true })
  description: string;
}
