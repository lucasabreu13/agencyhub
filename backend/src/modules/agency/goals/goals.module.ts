import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyGoalsController } from './goals.controller';
import { GoalsService } from '../../admin/goals/goals.service';
import { Goal } from '../../../database/entities/goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  controllers: [AgencyGoalsController],
  providers: [GoalsService],
})
export class AgencyGoalsModule {}
