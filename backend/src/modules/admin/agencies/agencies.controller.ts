import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto, UpdateAgencyDto, AgencyFilterDto } from './dto/agency.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../common/enums';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN) // Só admin da plataforma acessa estes endpoints
@Controller('admin/agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as agências' })
  findAll(@Query() filters: AgencyFilterDto) {
    return this.agenciesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de uma agência' })
  findOne(@Param('id') id: string) {
    return this.agenciesService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Estatísticas de uma agência' })
  findStats(@Param('id') id: string) {
    return this.agenciesService.findStats(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova agência (cria o owner automaticamente)' })
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agenciesService.create(createAgencyDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar agência' })
  update(@Param('id') id: string, @Body() updateAgencyDto: UpdateAgencyDto) {
    return this.agenciesService.update(id, updateAgencyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover agência (soft delete)' })
  remove(@Param('id') id: string) {
    return this.agenciesService.remove(id);
  }
}
