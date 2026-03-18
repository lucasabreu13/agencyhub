import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { User } from '../../database/entities/user.entity';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificações do usuário' })
  findAll(@CurrentUser() user: User, @Query('unread') unread?: string) {
    return this.service.findByUser(user.id, unread === 'true');
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Contagem de notificações não lidas' })
  countUnread(@CurrentUser() user: User) {
    return this.service.countUnread(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.markAsRead(id, user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marcar todas como lidas' })
  markAllAsRead(@CurrentUser() user: User) {
    return this.service.markAllAsRead(user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.delete(id, user.id);
  }
}
