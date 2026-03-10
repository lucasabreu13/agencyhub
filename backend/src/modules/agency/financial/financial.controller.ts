import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgencyFinancialService } from './financial.service';
import { CreateTransactionDto, UpdateTransactionDto, TransactionFilterDto } from './dto/financial.dto';
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
@Controller('agency/financial')
export class AgencyFinancialController {
  constructor(private readonly service: AgencyFinancialService) {}

  @Get()
  @ApiOperation({ summary: 'Transações financeiras com resumo (receita, despesa, saldo)' })
  findAll(@TenantId() agencyId: string, @Query() filters: TransactionFilterDto) {
    return this.service.findAll(agencyId, filters);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.service.findOne(agencyId, id);
  }

  @Post()
  create(@TenantId() agencyId: string, @Body() dto: CreateTransactionDto, @CurrentUser() user: User) {
    return this.service.create(agencyId, dto, user.id);
  }

  @Patch(':id')
  update(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(agencyId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.service.remove(agencyId, id);
  }
}
