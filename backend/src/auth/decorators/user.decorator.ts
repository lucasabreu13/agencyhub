import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';

// Injeta o usuário autenticado no parâmetro do controller
// Uso: @CurrentUser() user: User
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    return data ? user?.[data] : user;
  },
);

// Injeta o agencyId do tenant atual no parâmetro do controller
// Uso: @TenantId() agencyId: string
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.agencyId || request.user?.agencyId;
  },
);
