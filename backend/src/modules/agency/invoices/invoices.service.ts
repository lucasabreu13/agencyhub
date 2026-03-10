import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../../database/entities/invoice.entity';
import { InvoiceStatus } from '../../../common/enums';
import { CreateInvoiceDto, UpdateInvoiceDto, MarkAsPaidDto, InvoiceFilterDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  private async generateNumber(agencyId: string): Promise<string> {
    const count = await this.invoiceRepository.count({ where: { agencyId } });
    const year = new Date().getFullYear();
    return `NF-${year}-${String(count + 1).padStart(3, '0')}`;
  }

  async findAll(agencyId: string, filters: InvoiceFilterDto) {
    const { clientId, status, page = 1, limit = 20 } = filters;
    const where: any = { agencyId };
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where, skip: (page - 1) * limit, take: limit, order: { createdAt: 'DESC' },
    });

    return { data: invoices, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(agencyId: string, id: string) {
    const invoice = await this.invoiceRepository.findOne({ where: { id, agencyId } });
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada');
    return invoice;
  }

  async create(agencyId: string, dto: CreateInvoiceDto, userId: string) {
    const number = await this.generateNumber(agencyId);
    const invoice = this.invoiceRepository.create({ ...dto, agencyId, createdBy: userId, number });
    return this.invoiceRepository.save(invoice);
  }

  async markAsPaid(agencyId: string, id: string, dto: MarkAsPaidDto) {
    const invoice = await this.findOne(agencyId, id);
    invoice.status = InvoiceStatus.PAID;
    invoice.paymentMethod = dto.paymentMethod;
    invoice.paidDate = dto.paidDate ? new Date(dto.paidDate) : new Date();
    return this.invoiceRepository.save(invoice);
  }

  async cancel(agencyId: string, id: string) {
    const invoice = await this.findOne(agencyId, id);
    invoice.status = InvoiceStatus.CANCELLED;
    return this.invoiceRepository.save(invoice);
  }

  async update(agencyId: string, id: string, dto: UpdateInvoiceDto) {
    const invoice = await this.findOne(agencyId, id);
    Object.assign(invoice, dto);
    return this.invoiceRepository.save(invoice);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.invoiceRepository.softDelete(id);
    return { message: 'Nota fiscal removida com sucesso' };
  }
}
