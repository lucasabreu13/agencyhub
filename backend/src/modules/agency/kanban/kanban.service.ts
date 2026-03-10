import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KanbanTask } from '../../../database/entities/kanban-task.entity';
import { KanbanColumn } from '../../../common/enums';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto, KanbanFilterDto } from './dto/kanban.dto';

@Injectable()
export class KanbanService {
  constructor(
    @InjectRepository(KanbanTask)
    private taskRepository: Repository<KanbanTask>,
  ) {}

  // Retorna tarefas agrupadas por coluna — formato ideal para o board
  async findBoard(agencyId: string, filters: KanbanFilterDto) {
    const where: any = { agencyId };
    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.assignedTo) where.assignedTo = filters.assignedTo;

    const tasks = await this.taskRepository.find({
      where,
      order: { column: 'ASC', position: 'ASC' },
    });

    // Agrupa por coluna mantendo a ordem
    const board = Object.values(KanbanColumn).reduce((acc, col) => {
      acc[col] = tasks.filter(t => t.column === col);
      return acc;
    }, {} as Record<KanbanColumn, KanbanTask[]>);

    return board;
  }

  async findOne(agencyId: string, id: string) {
    const task = await this.taskRepository.findOne({ where: { id, agencyId } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async create(agencyId: string, dto: CreateTaskDto) {
    // Posiciona a nova tarefa no final da coluna
    const lastInColumn = await this.taskRepository.findOne({
      where: { agencyId, column: dto.column || KanbanColumn.BACKLOG },
      order: { position: 'DESC' },
    });

    const task = this.taskRepository.create({
      ...dto,
      agencyId,
      position: lastInColumn ? lastInColumn.position + 1 : 0,
    });

    return this.taskRepository.save(task);
  }

  async update(agencyId: string, id: string, dto: UpdateTaskDto) {
    const task = await this.findOne(agencyId, id);
    Object.assign(task, dto);
    return this.taskRepository.save(task);
  }

  async moveTask(agencyId: string, id: string, dto: MoveTaskDto) {
    const task = await this.findOne(agencyId, id);
    const { column, position } = dto;

    // Se mudou de coluna, reposiciona no final por padrão
    if (task.column !== column) {
      const lastInTarget = await this.taskRepository.findOne({
        where: { agencyId, column },
        order: { position: 'DESC' },
      });
      task.column = column;
      task.position = position ?? (lastInTarget ? lastInTarget.position + 1 : 0);
    } else if (position !== undefined) {
      // Reordena dentro da mesma coluna
      const tasksInColumn = await this.taskRepository.find({
        where: { agencyId, column },
        order: { position: 'ASC' },
      });

      // Ajusta posições das outras tarefas
      const updates = tasksInColumn
        .filter(t => t.id !== id)
        .map((t, idx) => {
          t.position = idx >= position ? idx + 1 : idx;
          return t;
        });

      if (updates.length) await this.taskRepository.save(updates);
      task.position = position;
    }

    return this.taskRepository.save(task);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.taskRepository.softDelete(id);
    return { message: 'Tarefa removida com sucesso' };
  }
}
