import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CreateEventDto, UpdateEventDto, CalendarFilterDto } from './dto/calendar.dto';
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
@Controller('agency/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @ApiOperation({ summary: 'Listar eventos do calendário (suporta filtro por período)' })
  findAll(@TenantId() agencyId: string, @Query() filters: CalendarFilterDto) {
    return this.calendarService.findAll(agencyId, filters);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.calendarService.findOne(agencyId, id);
  }

  @Post()
  create(@TenantId() agencyId: string, @Body() dto: CreateEventDto, @CurrentUser() user: User) {
    return this.calendarService.create(agencyId, dto, user.id);
  }

  @Patch(':id')
  update(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.calendarService.update(agencyId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.calendarService.remove(agencyId, id);
  }
}
