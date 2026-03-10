import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  UpdateMetricsDto,
  CampaignFilterDto,
} from './dto/campaign.dto';
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
@Controller('agency/campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar campanhas da agência' })
  findAll(@TenantId() agencyId: string, @Query() filters: CampaignFilterDto) {
    return this.campaignsService.findAll(agencyId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da campanha' })
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.campaignsService.findOne(agencyId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar campanha' })
  create(@TenantId() agencyId: string, @Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(agencyId, createCampaignDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campanha' })
  update(
    @TenantId() agencyId: string,
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(agencyId, id, updateCampaignDto);
  }

  @Patch(':id/metrics')
  @ApiOperation({ summary: 'Atualizar métricas da campanha (impressões, cliques, etc.)' })
  updateMetrics(
    @TenantId() agencyId: string,
    @Param('id') id: string,
    @Body() metricsDto: UpdateMetricsDto,
  ) {
    return this.campaignsService.updateMetrics(agencyId, id, metricsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover campanha' })
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.campaignsService.remove(agencyId, id);
  }
}
