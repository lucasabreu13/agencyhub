import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Admin da plataforma não precisa de agencyId
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Agency owner e client precisam ter agencyId
    if (!user.agencyId) {
      throw new ForbiddenException('Usuário não está associado a nenhuma agência');
    }

    // Injeta o agencyId no request para uso nos services
    request.agencyId = user.agencyId;

    return true;
  }
}
