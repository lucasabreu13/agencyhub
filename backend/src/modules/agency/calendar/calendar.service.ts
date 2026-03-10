import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Event } from '../../../database/entities/event.entity';
import { CreateEventDto, UpdateEventDto, CalendarFilterDto } from './dto/calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async findAll(agencyId: string, filters: CalendarFilterDto) {
    const { startDate, endDate, clientId, type } = filters;

    const qb = this.eventRepository.createQueryBuilder('event')
      .where('event.agencyId = :agencyId', { agencyId });

    if (startDate) qb.andWhere('event.startDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('event.endDate <= :endDate', { endDate });
    if (clientId) qb.andWhere('event.clientId = :clientId', { clientId });
    if (type) qb.andWhere('event.type = :type', { type });

    qb.orderBy('event.startDate', 'ASC');

    return qb.getMany();
  }

  async findOne(agencyId: string, id: string) {
    const event = await this.eventRepository.findOne({ where: { id, agencyId } });
    if (!event) throw new NotFoundException('Evento não encontrado');
    return event;
  }

  async create(agencyId: string, dto: CreateEventDto, userId: string) {
    const event = this.eventRepository.create({ ...dto, agencyId, createdBy: userId });
    return this.eventRepository.save(event);
  }

  async update(agencyId: string, id: string, dto: UpdateEventDto) {
    const event = await this.findOne(agencyId, id);
    Object.assign(event, dto);
    return this.eventRepository.save(event);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.eventRepository.softDelete(id);
    return { message: 'Evento removido com sucesso' };
  }
}
