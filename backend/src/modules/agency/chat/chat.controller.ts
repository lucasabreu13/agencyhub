import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from '../shared/dto/shared.dto';
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
@Controller('agency/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Lista de conversas (última mensagem de cada cliente)' })
  findConversations(@TenantId() agencyId: string) {
    return this.chatService.findConversations(agencyId);
  }

  @Get('messages/:clientId')
  @ApiOperation({ summary: 'Mensagens de uma conversa específica' })
  findMessages(
    @TenantId() agencyId: string,
    @Param('clientId') clientId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.findMessages(agencyId, clientId, page, limit);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Enviar mensagem' })
  sendMessage(@TenantId() agencyId: string, @Body() dto: SendMessageDto, @CurrentUser() user: User) {
    return this.chatService.sendMessage(agencyId, dto, user.id);
  }

  @Patch('messages/:clientId/read')
  @ApiOperation({ summary: 'Marcar mensagens de uma conversa como lidas' })
  markAsRead(
    @TenantId() agencyId: string,
    @Param('clientId') clientId: string,
    @CurrentUser() user: User,
  ) {
    return this.chatService.markAsRead(agencyId, clientId, user.id);
  }
}
