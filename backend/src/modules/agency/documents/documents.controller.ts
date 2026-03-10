import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto, DocumentFilterDto } from './dto/document.dto';
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
@Controller('agency/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll(@TenantId() agencyId: string, @Query() filters: DocumentFilterDto) {
    return this.documentsService.findAll(agencyId, filters);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.documentsService.findOne(agencyId, id);
  }

  @Post()
  create(@TenantId() agencyId: string, @Body() dto: CreateDocumentDto, @CurrentUser() user: User) {
    return this.documentsService.create(agencyId, dto, user.id);
  }

  @Patch(':id')
  update(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.update(agencyId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.documentsService.remove(agencyId, id);
  }
}
