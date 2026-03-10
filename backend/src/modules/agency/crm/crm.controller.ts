import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import { CreateContactDto, UpdateContactDto, MoveStageDto, CrmFilterDto } from './dto/crm.dto';
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
@Controller('agency/crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get()
  findAll(@TenantId() agencyId: string, @Query() filters: CrmFilterDto) {
    return this.crmService.findAll(agencyId, filters);
  }

  @Get('board')
  @ApiOperation({ summary: 'Contatos agrupados por stage (para board visual)' })
  findBoard(@TenantId() agencyId: string) {
    return this.crmService.findBoard(agencyId);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.crmService.findOne(agencyId, id);
  }

  @Post()
  create(@TenantId() agencyId: string, @Body() dto: CreateContactDto) {
    return this.crmService.create(agencyId, dto);
  }

  @Patch(':id')
  update(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.crmService.update(agencyId, id, dto);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Mover contato para outro stage do funil' })
  moveStage(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: MoveStageDto) {
    return this.crmService.moveStage(agencyId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.crmService.remove(agencyId, id);
  }
}
