import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RevenueService } from './revenue.service';
import { CreateTransactionDto, UpdateTransactionDto, RevenueFilterDto } from './dto/revenue.dto';
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
@Controller('admin/revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get()
  @ApiOperation({ summary: 'Listar transações financeiras da plataforma' })
  findAll(@Query() filters: RevenueFilterDto) {
    return this.revenueService.findAll(filters);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resumo financeiro (MRR, despesas, saldo)' })
  getSummary(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.revenueService.getSummary(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da transação' })
  findOne(@Param('id') id: string) {
    return this.revenueService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar transação' })
  create(@Body() dto: CreateTransactionDto, @CurrentUser() user: User) {
    return this.revenueService.create(dto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar transação' })
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.revenueService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover transação' })
  remove(@Param('id') id: string) {
    return this.revenueService.remove(id);
  }
}
