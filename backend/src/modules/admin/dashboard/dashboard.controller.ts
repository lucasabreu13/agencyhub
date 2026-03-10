import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminDashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../common/enums';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly service: AdminDashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Dashboard da plataforma — MRR, agências, tickets abertos' })
  getDashboard() {
    return this.service.getDashboard();
  }
}
