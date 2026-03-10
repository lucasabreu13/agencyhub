import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';
import { KanbanTask } from '../../../database/entities/kanban-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KanbanTask])],
  controllers: [KanbanController],
  providers: [KanbanService],
  exports: [KanbanService],
})
export class AgencyKanbanModule {}
