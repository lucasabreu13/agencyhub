import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../../../database/entities/reminder.entity';
import { CreateReminderDto, UpdateReminderDto } from './dto/reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
  ) {}

  async findAll(userId: string, agencyId?: string) {
    const where: any = { userId };
    if (agencyId) where.agencyId = agencyId;
    else where.agencyId = null; // admin vê só os dele

    return this.reminderRepository.find({
      where,
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: string, userId: string) {
    const reminder = await this.reminderRepository.findOne({ where: { id, userId } });
    if (!reminder) throw new NotFoundException('Lembrete não encontrado');
    return reminder;
  }

  async create(dto: CreateReminderDto, userId: string, agencyId?: string) {
    const reminder = this.reminderRepository.create({
      ...dto,
      userId,
      agencyId: agencyId ?? null,
    });
    return this.reminderRepository.save(reminder);
  }

  async update(id: string, dto: UpdateReminderDto, userId: string) {
    const reminder = await this.findOne(id, userId);
    Object.assign(reminder, dto);
    return this.reminderRepository.save(reminder);
  }

  async toggleDone(id: string, userId: string) {
    const reminder = await this.findOne(id, userId);
    reminder.isDone = !reminder.isDone;
    reminder.doneAt = reminder.isDone ? new Date() : null;
    return this.reminderRepository.save(reminder);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.reminderRepository.softDelete(id);
    return { message: 'Lembrete removido com sucesso' };
  }
}
