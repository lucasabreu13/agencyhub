import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgencyUsersService } from './users.service';
import { InviteUserDto } from '../shared/dto/shared.dto';
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
@Controller('agency/users')
export class AgencyUsersController {
  constructor(private readonly service: AgencyUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Membros da equipe da agência' })
  findAll(@TenantId() agencyId: string) {
    return this.service.findAll(agencyId);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.service.findOne(agencyId, id);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Convidar novo membro ou cliente para a agência' })
  invite(@TenantId() agencyId: string, @Body() dto: InviteUserDto) {
    return this.service.invite(agencyId, dto);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Ativar/desativar usuário' })
  toggleActive(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.service.toggleActive(agencyId, id);
  }

  @Delete(':id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.service.remove(agencyId, id);
  }
}
