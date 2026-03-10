import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientDashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { TenantGuard } from '../../../auth/guards/tenant.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { TenantId, CurrentUser } from '../../../auth/decorators/user.decorator';
import { User } from '../../../database/entities/user.entity';
import { UserRole } from '../../../common/enums';

@ApiTags('client')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.AGENCY_CLIENT)
@Controller('client/dashboard')
export class ClientDashboardController {
  constructor(private readonly dashboardService: ClientDashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Dashboard do cliente — resumo de campanhas, relatórios e faturas' })
  getDashboard(@TenantId() agencyId: string, @CurrentUser() user: User) {
    // O clientId é resolvido pelo userId associado ao client
    return this.dashboardService.getDashboard(agencyId, user.id);
  }
}
