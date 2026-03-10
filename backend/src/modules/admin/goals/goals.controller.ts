import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto, UpdateProgressDto, GoalFilterDto } from './dto/goal.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/decorators/user.decorator';
import { User } from '../../../database/entities/user.entity';
import { UserRole } from '../../../common/enums';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar metas da plataforma' })
  findAll(@Query() filters: GoalFilterDto) {
    return this.goalsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar meta da plataforma' })
  create(@Body() dto: CreateGoalDto, @CurrentUser() user: User) {
    return this.goalsService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(id, dto);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Atualizar progresso da meta' })
  updateProgress(@Param('id') id: string, @Body() dto: UpdateProgressDto) {
    return this.goalsService.updateProgress(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalsService.remove(id);
  }
}
