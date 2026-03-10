import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClientDocumentsService } from './documents.service';
import { ClientDocumentFilterDto } from '../shared/client-filter.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { TenantGuard } from '../../../auth/guards/tenant.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { TenantId, CurrentUser } from '../../../auth/decorators/user.decorator';
import { User } from '../../../database/entities/user.entity';
import { UserRole } from '../../../common/enums';

@ApiTags('client')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.AGENCY_CLIENT)
@Controller('client/documents')
export class ClientDocumentsController {
  constructor(private readonly service: ClientDocumentsService) {}

  @Get()
  findAll(@TenantId() agencyId: string, @CurrentUser() user: User, @Query() filters: ClientDocumentFilterDto) {
    return this.service.findAll(agencyId, user.id, filters);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne(agencyId, user.id, id);
  }
}
