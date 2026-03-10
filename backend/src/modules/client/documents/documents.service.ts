import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../../database/entities/document.entity';
import { ClientDocumentFilterDto } from '../shared/client-filter.dto';
import { ClientContextService } from '../../../common/client-context.service';

@Injectable()
export class ClientDocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private clientContextService: ClientContextService,
  ) {}

  async findAll(agencyId: string, userId: string, filters: ClientDocumentFilterDto) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);
    const { category, page = 1, limit = 20 } = filters;

    const where: any = { agencyId, clientId: client.id };
    if (category) where.category = category;

    const [docs, total] = await this.documentRepository.findAndCount({
      where, skip: (page - 1) * limit, take: limit, order: { createdAt: 'DESC' },
    });

    return { data: docs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(agencyId: string, userId: string, id: string) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);
    const doc = await this.documentRepository.findOne({ where: { id, agencyId, clientId: client.id } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    return doc;
  }
}
