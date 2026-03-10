import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from '../../admin/tickets/tickets.service';
import { CreateTicketDto, AddTicketMessageDto, TicketFilterDto } from '../../admin/tickets/dto/ticket.dto';
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
@Controller('client/support')
export class ClientSupportController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Tickets de suporte do cliente' })
  findAll(@TenantId() agencyId: string, @Query() filters: TicketFilterDto) {
    return this.ticketsService.findAll(filters, agencyId);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.ticketsService.findOne(id, agencyId);
  }

  @Post()
  @ApiOperation({ summary: 'Abrir novo ticket de suporte' })
  create(@TenantId() agencyId: string, @Body() dto: CreateTicketDto, @CurrentUser() user: User) {
    return this.ticketsService.create(dto, user, agencyId);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Responder ticket' })
  addMessage(
    @TenantId() agencyId: string,
    @Param('id') id: string,
    @Body() dto: AddTicketMessageDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.addMessage(id, dto, user, agencyId);
  }
}
