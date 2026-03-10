import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RemindersService } from './reminders.service';
import { CreateReminderDto, UpdateReminderDto } from './dto/reminder.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/decorators/user.decorator';
import { User } from '../../../database/entities/user.entity';
import { UserRole } from '../../../common/enums';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar lembretes do admin' })
  findAll(@CurrentUser() user: User) {
    return this.remindersService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar lembrete' })
  create(@Body() dto: CreateReminderDto, @CurrentUser() user: User) {
    return this.remindersService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReminderDto, @CurrentUser() user: User) {
    return this.remindersService.update(id, dto, user.id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Marcar lembrete como feito/pendente' })
  toggle(@Param('id') id: string, @CurrentUser() user: User) {
    return this.remindersService.toggleDone(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.remindersService.remove(id, user.id);
  }
}
