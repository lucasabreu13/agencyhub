import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GoalsService } from '../../admin/goals/goals.service';
import { CreateGoalDto, UpdateGoalDto, UpdateProgressDto, GoalFilterDto } from '../../admin/goals/dto/goal.dto';
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
@Controller('agency/goals')
export class AgencyGoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findAll(@TenantId() agencyId: string, @Query() filters: GoalFilterDto) {
    return this.goalsService.findAll(filters, agencyId);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.goalsService.findOne(id, agencyId);
  }

  @Post()
  create(@TenantId() agencyId: string, @Body() dto: CreateGoalDto, @CurrentUser() user: User) {
    return this.goalsService.create(dto, user.id, agencyId);
  }

  @Patch(':id')
  update(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(id, dto, agencyId);
  }

  @Patch(':id/progress')
  updateProgress(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateProgressDto) {
    return this.goalsService.updateProgress(id, dto, agencyId);
  }

  @Delete(':id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.goalsService.remove(id, agencyId);
  }
}
