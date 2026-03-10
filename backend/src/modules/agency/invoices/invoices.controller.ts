import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceDto, MarkAsPaidDto, InvoiceFilterDto } from './dto/invoice.dto';
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
@Controller('agency/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@TenantId() agencyId: string, @Query() filters: InvoiceFilterDto) {
    return this.invoicesService.findAll(agencyId, filters);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.invoicesService.findOne(agencyId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar fatura (número gerado automaticamente: NF-2026-001)' })
  create(@TenantId() agencyId: string, @Body() dto: CreateInvoiceDto, @CurrentUser() user: User) {
    return this.invoicesService.create(agencyId, dto, user.id);
  }

  @Patch(':id')
  update(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoicesService.update(agencyId, id, dto);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Registrar pagamento da fatura' })
  markAsPaid(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: MarkAsPaidDto) {
    return this.invoicesService.markAsPaid(agencyId, id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar fatura' })
  cancel(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.invoicesService.cancel(agencyId, id);
  }

  @Delete(':id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.invoicesService.remove(agencyId, id);
  }
}
