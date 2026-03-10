import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CrmContact } from '../../../database/entities/crm-contact.entity';
import { CrmStage } from '../../../common/enums';
import { CreateContactDto, UpdateContactDto, MoveStageDto, CrmFilterDto } from './dto/crm.dto';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(CrmContact)
    private contactRepository: Repository<CrmContact>,
  ) {}

  async findAll(agencyId: string, filters: CrmFilterDto) {
    const { search, stage, assignedTo, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { agencyId };
    if (stage) where.stage = stage;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) where.name = Like(`%${search}%`);

    const [contacts, total] = await this.contactRepository.findAndCount({
      where, skip, take: limit, order: { createdAt: 'DESC' },
    });

    return { data: contacts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // Retorna contatos agrupados por stage — útil para o board de kanban do CRM
  async findBoard(agencyId: string) {
    const contacts = await this.contactRepository.find({
      where: { agencyId },
      order: { createdAt: 'ASC' },
    });

    const board = Object.values(CrmStage).reduce((acc, stage) => {
      acc[stage] = contacts.filter(c => c.stage === stage);
      return acc;
    }, {} as Record<CrmStage, CrmContact[]>);

    return board;
  }

  async findOne(agencyId: string, id: string) {
    const contact = await this.contactRepository.findOne({ where: { id, agencyId } });
    if (!contact) throw new NotFoundException('Contato não encontrado');
    return contact;
  }

  async create(agencyId: string, dto: CreateContactDto) {
    const contact = this.contactRepository.create({ ...dto, agencyId });
    return this.contactRepository.save(contact);
  }

  async update(agencyId: string, id: string, dto: UpdateContactDto) {
    const contact = await this.findOne(agencyId, id);
    Object.assign(contact, dto);
    return this.contactRepository.save(contact);
  }

  async moveStage(agencyId: string, id: string, dto: MoveStageDto) {
    const contact = await this.findOne(agencyId, id);
    contact.stage = dto.stage;
    contact.lastContact = new Date();
    return this.contactRepository.save(contact);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.contactRepository.softDelete(id);
    return { message: 'Contato removido com sucesso' };
  }
}
