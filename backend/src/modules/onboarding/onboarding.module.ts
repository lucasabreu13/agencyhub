import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingService } from './onboarding.service';
import { Goal } from '../../database/entities/goal.entity';
import { Reminder } from '../../database/entities/reminder.entity';
import { KanbanTask } from '../../database/entities/kanban-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Reminder, KanbanTask])],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
