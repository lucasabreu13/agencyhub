import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../../../database/entities/ticket.entity';
import { User } from '../../../database/entities/user.entity';
import { TicketStatus } from '../../../common/enums';
import { TicketMessage } from '../../../database/entities/ticket-message.entity';
import {
  CreateTicketDto, UpdateTicketDto, AddTicketMessageDto, TicketFilterDto,
} from './dto/ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketMessage)
    private messageRepository: Repository<TicketMessage>,
  ) {}

  async findAll(filters: TicketFilterDto, agencyId?: string) {
    const { status, priority, type, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const qb = this.ticketRepository.createQueryBuilder('ticket');

    // Admin vê todos; agência vê só os seus
    if (agencyId) {
      qb.andWhere('ticket.agencyId = :agencyId', { agencyId });
    }
    if (status) qb.andWhere('ticket.status = :status', { status });
    if (priority) qb.andWhere('ticket.priority = :priority', { priority });
    if (type) qb.andWhere('ticket.type = :type', { type });
    if (filters.agencyId && !agencyId) {
      qb.andWhere('ticket.agencyId = :filterAgencyId', { filterAgencyId: filters.agencyId });
    }

    qb.orderBy('ticket.createdAt', 'DESC').skip(skip).take(limit);

    const [tickets, total] = await qb.getManyAndCount();
    return { data: tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, agencyId?: string) {
    const where: any = { id };
    if (agencyId) where.agencyId = agencyId;

    const ticket = await this.ticketRepository.findOne({ where });
    if (!ticket) throw new NotFoundException('Ticket não encontrado');

    const messages = await this.messageRepository.find({
      where: { ticketId: id },
      order: { createdAt: 'ASC' },
    });

    return { ...ticket, messages };
  }

  async create(createTicketDto: CreateTicketDto, user: User, agencyId?: string) {
    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      agencyId: agencyId ?? null,
      createdBy: user.id,
    });
    return this.ticketRepository.save(ticket);
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, agencyId?: string) {
    const ticket = await this.findOne(id, agencyId);

    // Se está resolvendo, registra o horário
    if (updateTicketDto.status === TicketStatus.RESOLVED && !ticket.resolvedAt) {
      (ticket as any).resolvedAt = new Date();
    }

    Object.assign(ticket, updateTicketDto);
    return this.ticketRepository.save(ticket);
  }

  async addMessage(ticketId: string, dto: AddTicketMessageDto, user: User, agencyId?: string) {
    await this.findOne(ticketId, agencyId); // valida acesso

    const message = this.messageRepository.create({
      ticketId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: dto.content,
    });

    // Reabre o ticket se estava fechado
    await this.ticketRepository.update(ticketId, { status: TicketStatus.IN_PROGRESS });

    return this.messageRepository.save(message);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.ticketRepository.softDelete(id);
    return { message: 'Ticket removido com sucesso' };
  }
}
