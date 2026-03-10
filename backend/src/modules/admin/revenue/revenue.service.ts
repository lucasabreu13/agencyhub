import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { FinancialTransaction } from '../../../database/entities/financial-transaction.entity';
import { TransactionScope, TransactionType } from '../../../common/enums';
import { CreateTransactionDto, UpdateTransactionDto, RevenueFilterDto } from './dto/revenue.dto';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(FinancialTransaction)
    private transactionRepository: Repository<FinancialTransaction>,
  ) {}

  async findAll(filters: RevenueFilterDto) {
    const { type, agencyId, category, startDate, endDate, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const qb = this.transactionRepository.createQueryBuilder('t')
      .where('t.scope = :scope', { scope: TransactionScope.PLATFORM });

    if (type) qb.andWhere('t.type = :type', { type });
    if (agencyId) qb.andWhere('t.agencyId = :agencyId', { agencyId });
    if (category) qb.andWhere('t.category = :category', { category });
    if (startDate) qb.andWhere('t.date >= :startDate', { startDate });
    if (endDate) qb.andWhere('t.date <= :endDate', { endDate });

    qb.orderBy('t.date', 'DESC').skip(skip).take(limit);

    const [transactions, total] = await qb.getManyAndCount();

    return { data: transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getSummary(startDate?: string, endDate?: string) {
    const qb = this.transactionRepository.createQueryBuilder('t')
      .where('t.scope = :scope', { scope: TransactionScope.PLATFORM });

    if (startDate) qb.andWhere('t.date >= :startDate', { startDate });
    if (endDate) qb.andWhere('t.date <= :endDate', { endDate });

    const transactions = await qb.getMany();

    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }

  async findOne(id: string) {
    const t = await this.transactionRepository.findOne({
      where: { id, scope: TransactionScope.PLATFORM },
    });
    if (!t) throw new NotFoundException('Transação não encontrada');
    return t;
  }

  async create(dto: CreateTransactionDto, userId: string) {
    const transaction = this.transactionRepository.create({
      ...dto,
      scope: TransactionScope.PLATFORM,
      createdBy: userId,
    });
    return this.transactionRepository.save(transaction);
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const t = await this.findOne(id);
    Object.assign(t, dto);
    return this.transactionRepository.save(t);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.transactionRepository.softDelete(id);
    return { message: 'Transação removida com sucesso' };
  }
}
