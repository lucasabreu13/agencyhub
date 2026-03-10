import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto, ReportFilterDto } from './dto/report.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { TenantGuard } from '../../../auth/guards/tenant.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { TenantId, CurrentUser } from '../../../auth/decorators/user.decorator';
import { User } from '../../../database/entities/user.entity';
import { UserRole } from '../../../common/enums';

@ApiTags('agency')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.AGENCY_OWNER)
@Controller('agency/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll(@TenantId() agencyId: string, @Query() filters: ReportFilterDto) {
    return this.reportsService.findAll(agencyId, filters);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.reportsService.findOne(agencyId, id);
  }

  @Post()
  create(@TenantId() agencyId: string, @Body() dto: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(agencyId, dto, user.id);
  }

  @Patch(':id')
  update(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateReportDto) {
    return this.reportsService.update(agencyId, id, dto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Aprovar relatório' })
  approve(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.reportsService.approve(agencyId, id);
  }

  @Patch(':id/request-adjustment')
  @ApiOperation({ summary: 'Solicitar ajuste no relatório' })
  requestAdjustment(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.reportsService.requestAdjustment(agencyId, id);
  }

  @Delete(':id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.reportsService.remove(agencyId, id);
  }
}
