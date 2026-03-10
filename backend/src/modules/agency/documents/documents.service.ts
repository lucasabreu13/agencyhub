import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../../database/entities/document.entity';
import { CreateDocumentDto, UpdateDocumentDto, DocumentFilterDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async findAll(agencyId: string, filters: DocumentFilterDto) {
    const { clientId, category, page = 1, limit = 20 } = filters;
    const where: any = { agencyId };
    if (clientId) where.clientId = clientId;
    if (category) where.category = category;

    const [docs, total] = await this.documentRepository.findAndCount({
      where, skip: (page - 1) * limit, take: limit, order: { createdAt: 'DESC' },
    });

    return { data: docs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(agencyId: string, id: string) {
    const doc = await this.documentRepository.findOne({ where: { id, agencyId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    return doc;
  }

  async create(agencyId: string, dto: CreateDocumentDto, userId: string) {
    const doc = this.documentRepository.create({ ...dto, agencyId, uploadedBy: userId });
    return this.documentRepository.save(doc);
  }

  async update(agencyId: string, id: string, dto: UpdateDocumentDto) {
    const doc = await this.findOne(agencyId, id);
    Object.assign(doc, dto);
    return this.documentRepository.save(doc);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.documentRepository.softDelete(id);
    return { message: 'Documento removido com sucesso' };
  }
}
