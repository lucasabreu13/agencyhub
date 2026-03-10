import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KanbanService } from './kanban.service';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto, KanbanFilterDto } from './dto/kanban.dto';
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
@Controller('agency/kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Get('board')
  @ApiOperation({ summary: 'Board completo agrupado por coluna' })
  findBoard(@TenantId() agencyId: string, @Query() filters: KanbanFilterDto) {
    return this.kanbanService.findBoard(agencyId, filters);
  }

  @Get('tasks/:id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.kanbanService.findOne(agencyId, id);
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Criar tarefa (posicionada automaticamente no fim da coluna)' })
  create(@TenantId() agencyId: string, @Body() dto: CreateTaskDto) {
    return this.kanbanService.create(agencyId, dto);
  }

  @Patch('tasks/:id')
  update(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.kanbanService.update(agencyId, id, dto);
  }

  @Patch('tasks/:id/move')
  @ApiOperation({ summary: 'Mover tarefa para outra coluna ou posição (drag & drop)' })
  moveTask(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: MoveTaskDto) {
    return this.kanbanService.moveTask(agencyId, id, dto);
  }

  @Delete('tasks/:id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.kanbanService.remove(agencyId, id);
  }
}
