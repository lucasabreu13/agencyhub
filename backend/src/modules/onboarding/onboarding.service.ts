import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal, GoalStatus, GoalScope } from '../../database/entities/goal.entity';
import { Reminder } from '../../database/entities/reminder.entity';
import { KanbanTask, KanbanColumn, TaskPriority } from '../../database/entities/kanban-task.entity';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,

    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,

    @InjectRepository(KanbanTask)
    private kanbanRepository: Repository<KanbanTask>,
  ) {}

  async seedAgencyData(agencyId: string, ownerId: string): Promise<void> {
    try {
      await Promise.all([
        this.createInitialGoal(agencyId, ownerId),
        this.createInitialReminders(agencyId, ownerId),
        this.createInitialKanbanTasks(agencyId, ownerId),
      ]);
      this.logger.log(`Dados iniciais criados para agência ${agencyId}`);
    } catch (err) {
      // Seed não bloqueia o cadastro — loga o erro e segue
      this.logger.error(`Erro ao criar dados iniciais para ${agencyId}: ${err.message}`);
    }
  }

  private async createInitialGoal(agencyId: string, ownerId: string): Promise<void> {
    const goal = this.goalRepository.create({
      agencyId,
      createdBy: ownerId,
      scope: GoalScope.AGENCY,
      title: 'Conquistar os primeiros 3 clientes',
      description: 'Feche seus primeiros contratos e comece a usar o CRM para acompanhar cada lead.',
      targetValue: 3,
      currentValue: 0,
      unit: 'clientes',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
      status: GoalStatus.ON_TRACK,
    });
    await this.goalRepository.save(goal);
  }

  private async createInitialReminders(agencyId: string, ownerId: string): Promise<void> {
    const reminders = [
      {
        agencyId,
        userId: ownerId,
        title: 'Configure o perfil da sua agência',
        description: 'Acesse Configurações e preencha logo, endereço e dados de contato da agência.',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // amanhã
      },
      {
        agencyId,
        userId: ownerId,
        title: 'Cadastre seu primeiro cliente',
        description: 'Vá para a seção Clientes e adicione o primeiro contrato ativo.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    ];

    await this.reminderRepository.save(
      reminders.map((r) => this.reminderRepository.create(r)),
    );
  }

  private async createInitialKanbanTasks(agencyId: string, ownerId: string): Promise<void> {
    const tasks = [
      {
        agencyId,
        assignedTo: ownerId,
        title: 'Configurar perfil da agência',
        description: 'Preencher informações de contato, logo e endereço nas Configurações.',
        column: KanbanColumn.TODO,
        priority: TaskPriority.HIGH,
        position: 0,
      },
      {
        agencyId,
        assignedTo: ownerId,
        title: 'Criar primeiro cliente',
        description: 'Cadastrar o primeiro cliente na plataforma e vincular campanhas.',
        column: KanbanColumn.TODO,
        priority: TaskPriority.HIGH,
        position: 1,
      },
      {
        agencyId,
        assignedTo: ownerId,
        title: 'Explorar módulo de CRM',
        description: 'Conhecer o pipeline de leads e adicionar os primeiros contatos.',
        column: KanbanColumn.BACKLOG,
        priority: TaskPriority.MEDIUM,
        position: 0,
      },
      {
        agencyId,
        assignedTo: ownerId,
        title: 'Criar primeira campanha',
        description: 'Registrar uma campanha ativa com budget e métricas iniciais.',
        column: KanbanColumn.BACKLOG,
        priority: TaskPriority.MEDIUM,
        position: 1,
      },
    ];

    await this.kanbanRepository.save(
      tasks.map((t) => this.kanbanRepository.create(t)),
    );
  }
}
