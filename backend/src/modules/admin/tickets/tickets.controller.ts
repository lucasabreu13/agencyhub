import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, AddTicketMessageDto, TicketFilterDto } from './dto/ticket.dto';
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
@Controller('admin/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os tickets da plataforma' })
  findAll(@Query() filters: TicketFilterDto) {
    return this.ticketsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do ticket com mensagens' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar ticket' })
  create(@Body() dto: CreateTicketDto, @CurrentUser() user: User) {
    return this.ticketsService.create(dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar ticket (status, prioridade, etc.)' })
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(id, dto);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Adicionar mensagem ao ticket' })
  addMessage(
    @Param('id') id: string,
    @Body() dto: AddTicketMessageDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.addMessage(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover ticket' })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
