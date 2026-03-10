import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialTransaction } from '../../../database/entities/financial-transaction.entity';
import { TransactionScope, TransactionType } from '../../../common/enums';
import { CreateTransactionDto, UpdateTransactionDto, TransactionFilterDto } from './dto/financial.dto';

@Injectable()
export class AgencyFinancialService {
  constructor(
    @InjectRepository(FinancialTransaction)
    private txRepository: Repository<FinancialTransaction>,
  ) {}

  async findAll(
    agencyId: string,
    filters: TransactionFilterDto,
  ) {
    const { type, clientId, page = 1, limit = 20 } = filters;
    const where: any = { agencyId, scope: TransactionScope.AGENCY };
    if (type) where.type = type;
    if (clientId) where.clientId = clientId;

    const [transactions, total] = await this.txRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });

    // Resumo do período filtrado
    const income = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((s, t) => s + Number(t.amount), 0);
    const expense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((s, t) => s + Number(t.amount), 0);

    return {
      data: transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      summary: { income, expense, balance: income - expense },
    };
  }

  async findOne(agencyId: string, id: string) {
    const tx = await this.txRepository.findOne({
      where: { id, agencyId, scope: TransactionScope.AGENCY },
    });
    if (!tx) throw new NotFoundException('Transação não encontrada');
    return tx;
  }

  async create(agencyId: string, dto: CreateTransactionDto, userId: string) {
    const tx = this.txRepository.create({
      ...dto,
      agencyId,
      createdBy: userId,
      scope: TransactionScope.AGENCY,
    });
    return this.txRepository.save(tx);
  }

  async update(agencyId: string, id: string, dto: UpdateTransactionDto) {
    const tx = await this.findOne(agencyId, id);
    Object.assign(tx, dto);
    return this.txRepository.save(tx);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.txRepository.softDelete(id);
    return { message: 'Transação removida com sucesso' };
  }
}
