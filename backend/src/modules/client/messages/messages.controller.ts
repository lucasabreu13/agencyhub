import { Controller, Get, Post, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientMessagesService } from './messages.service';
import { SendMessageDto } from '../../agency/shared/dto/shared.dto';
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
@Controller('client/messages')
export class ClientMessagesController {
  constructor(private readonly service: ClientMessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Mensagens do cliente com a agência' })
  findMessages(
    @TenantId() agencyId: string,
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.findMessages(agencyId, user.id, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Enviar mensagem para a agência' })
  sendMessage(@TenantId() agencyId: string, @CurrentUser() user: User, @Body() dto: SendMessageDto) {
    return this.service.sendMessage(agencyId, user.id, dto);
  }

  @Patch('read')
  @ApiOperation({ summary: 'Marcar todas as mensagens como lidas' })
  markAsRead(@TenantId() agencyId: string, @CurrentUser() user: User) {
    return this.service.markAsRead(agencyId, user.id);
  }
}
