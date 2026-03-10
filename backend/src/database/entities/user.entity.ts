import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from './base.entity';

export enum UserRole {
  ADMIN = 'admin',
  AGENCY_OWNER = 'agency_owner',
  AGENCY_CLIENT = 'agency_client',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash' })
  @Exclude() // Nunca retorna o hash na resposta
  passwordHash: string;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.AGENCY_OWNER,
  })
  role: UserRole;

  @Column({ name: 'agency_id', nullable: true })
  agencyId: string | null; // NULL para admins da plataforma

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Hash automático antes de salvar
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.passwordHash && !this.passwordHash.startsWith('$2b$')) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
  }

  // Método para verificar senha
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
