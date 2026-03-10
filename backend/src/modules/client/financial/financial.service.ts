import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../../database/entities/invoice.entity';
import { InvoiceStatus } from '../../../common/enums';
import { ClientInvoiceFilterDto } from '../shared/client-filter.dto';
import { ClientContextService } from '../../../common/client-context.service';

@Injectable()
export class ClientFinancialService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private clientContextService: ClientContextService,
  ) {}

  async findAll(agencyId: string, userId: string, filters: ClientInvoiceFilterDto) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);
    const { status, page = 1, limit = 20 } = filters;

    const where: any = { agencyId, clientId: client.id };
    if (status) where.status = status;

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where, skip: (page - 1) * limit, take: limit, order: { dueDate: 'DESC' },
    });

    // Resumo financeiro
    const summary = {
      totalPaid: invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((s, i) => s + Number(i.amount), 0),
      totalPending: invoices.filter(i => i.status === InvoiceStatus.PENDING).reduce((s, i) => s + Number(i.amount), 0),
      totalOverdue: invoices.filter(i => i.status === InvoiceStatus.OVERDUE).reduce((s, i) => s + Number(i.amount), 0),
    };

    return { data: invoices, total, page, limit, totalPages: Math.ceil(total / limit), summary };
  }

  async findOne(agencyId: string, userId: string, id: string) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);
    const invoice = await this.invoiceRepository.findOne({ where: { id, agencyId, clientId: client.id } });
    if (!invoice) throw new NotFoundException('Fatura não encontrada');
    return invoice;
  }
}
