import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgencySettingsService } from './settings.service';
import { UpdateAgencyProfileDto, UpdateMyProfileDto, ChangePasswordDto } from '../shared/dto/shared.dto';
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
@Controller('agency/settings')
export class AgencySettingsController {
  constructor(private readonly service: AgencySettingsService) {}

  @Get('agency')
  @ApiOperation({ summary: 'Dados da agência' })
  getProfile(@TenantId() agencyId: string) {
    return this.service.getProfile(agencyId);
  }

  @Patch('agency')
  @ApiOperation({ summary: 'Atualizar nome da agência' })
  updateProfile(@TenantId() agencyId: string, @Body() dto: UpdateAgencyProfileDto) {
    return this.service.updateProfile(agencyId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Meu perfil pessoal' })
  getMyProfile(@CurrentUser() user: User) {
    return this.service.getMyProfile(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar meu nome' })
  updateMyProfile(@CurrentUser() user: User, @Body() dto: UpdateMyProfileDto) {
    return this.service.updateMyProfile(user.id, dto);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Alterar minha senha' })
  changeMyPassword(@CurrentUser() user: User, @Body() dto: ChangePasswordDto) {
    return this.service.changeMyPassword(user.id, dto);
  }
}
