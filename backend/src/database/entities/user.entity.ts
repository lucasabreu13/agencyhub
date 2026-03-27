import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity } from './base.entity';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  SUPER_ADMIN   = 'super_admin',
  AGENCY_OWNER  = 'agency_owner',
  AGENCY_MEMBER = 'agency_member',
  AGENCY_CLIENT = 'agency_client',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.AGENCY_OWNER })
  role: UserRole;

  @Column({ name: 'agency_id', nullable: true })
  agencyId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date;

  // Campos para reset de senha
  @Column({ name: 'reset_password_token', length: 100, nullable: true })
  resetPasswordToken: string;

  @Column({ name: 'reset_password_expiry', type: 'timestamp', nullable: true })
  resetPasswordExpiry: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.passwordHash && !this.passwordHash.startsWith('$2b$')) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
