import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../../../database/entities/goal.entity';
import { GoalScope, GoalStatus } from '../../../common/enums';
import { CreateGoalDto, UpdateGoalDto, UpdateProgressDto, GoalFilterDto } from './dto/goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
  ) {}

  async findAll(filters: GoalFilterDto, agencyId?: string) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (agencyId) {
      where.agencyId = agencyId;
      where.scope = GoalScope.AGENCY;
    } else {
      where.scope = GoalScope.PLATFORM;
    }
    if (status) where.status = status;

    const [goals, total] = await this.goalRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data: goals, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, agencyId?: string) {
    const where: any = { id };
    if (agencyId) where.agencyId = agencyId;

    const goal = await this.goalRepository.findOne({ where });
    if (!goal) throw new NotFoundException('Meta não encontrada');
    return goal;
  }

  async create(dto: CreateGoalDto, userId: string, agencyId?: string) {
    const goal = this.goalRepository.create({
      ...dto,
      createdBy: userId,
      agencyId: agencyId ?? null,
      scope: agencyId ? GoalScope.AGENCY : GoalScope.PLATFORM,
    });
    return this.goalRepository.save(goal);
  }

  async update(id: string, dto: UpdateGoalDto, agencyId?: string) {
    const goal = await this.findOne(id, agencyId);
    Object.assign(goal, dto);
    return this.goalRepository.save(goal);
  }

  async updateProgress(id: string, dto: UpdateProgressDto, agencyId?: string) {
    const goal = await this.findOne(id, agencyId);
    goal.currentValue = dto.currentValue;

    // Atualiza status automaticamente
    if (goal.currentValue >= goal.targetValue) {
      goal.status = GoalStatus.COMPLETED;
    }

    return this.goalRepository.save(goal);
  }

  async remove(id: string, agencyId?: string) {
    await this.findOne(id, agencyId);
    await this.goalRepository.softDelete(id);
    return { message: 'Meta removida com sucesso' };
  }
}
