import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto, ClientFilterDto } from './dto/client.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { TenantGuard } from '../../../auth/guards/tenant.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { TenantId } from '../../../auth/decorators/user.decorator';
import { UserRole } from '../../../common/enums';

@ApiTags('agency')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.AGENCY_OWNER)
@Controller('agency/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar clientes da agência' })
  findAll(@TenantId() agencyId: string, @Query() filters: ClientFilterDto) {
    return this.clientsService.findAll(agencyId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do cliente' })
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.clientsService.findOne(agencyId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo cliente' })
  create(@TenantId() agencyId: string, @Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(agencyId, createClientDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  update(
    @TenantId() agencyId: string,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(agencyId, id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover cliente (soft delete)' })
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.clientsService.remove(agencyId, id);
  }
}
