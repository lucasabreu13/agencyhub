import { UserRole } from '../../database/entities/user.entity';

export interface JwtPayload {
  sub: string;       // user id
  email: string;
  role: UserRole;
  agencyId: string | null;
  iat?: number;
  exp?: number;
}
