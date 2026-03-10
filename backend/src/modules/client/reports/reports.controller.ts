import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientReportsService } from './reports.service';
import { ClientReportFilterDto } from '../shared/client-filter.dto';
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
@Controller('client/reports')
export class ClientReportsController {
  constructor(private readonly service: ClientReportsService) {}

  @Get()
  findAll(@TenantId() agencyId: string, @CurrentUser() user: User, @Query() filters: ClientReportFilterDto) {
    return this.service.findAll(agencyId, user.id, filters);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne(agencyId, user.id, id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Cliente aprova o relatório' })
  approve(@TenantId() agencyId: string, @CurrentUser() user: User, @Param('id') id: string) {
    return this.service.approve(agencyId, user.id, id);
  }

  @Patch(':id/request-adjustment')
  @ApiOperation({ summary: 'Cliente solicita ajuste' })
  requestAdjustment(@TenantId() agencyId: string, @CurrentUser() user: User, @Param('id') id: string) {
    return this.service.requestAdjustment(agencyId, user.id, id);
  }
}
