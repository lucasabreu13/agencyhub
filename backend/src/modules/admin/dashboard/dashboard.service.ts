import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgencyStatus, TicketStatus, TransactionScope, TransactionType, UserRole } from '../../../common/enums';
import { Agency } from '../../../database/entities/agency.entity';
import { User } from '../../../database/entities/user.entity';
import { Client } from '../../../database/entities/client.entity';
import { Campaign } from '../../../database/entities/campaign.entity';
import { Ticket } from '../../../database/entities/ticket.entity';
import { FinancialTransaction } from '../../../database/entities/financial-transaction.entity';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(FinancialTransaction)
    private txRepository: Repository<FinancialTransaction>,
  ) {}

  async getDashboard() {
    const [totalAgencies, activeAgencies, totalUsers, openTickets, totalClients, totalCampaigns] = await Promise.all([
      this.agencyRepository.count(),
      this.agencyRepository.count({ where: { status: AgencyStatus.ACTIVE } }),
      this.userRepository.count({ where: { role: UserRole.AGENCY_OWNER } }),
      this.ticketRepository.count({ where: { status: TicketStatus.OPEN } }),
      this.clientRepository.count(),
      this.campaignRepository.count(),
    ]);

    // MRR — soma das receitas da plataforma no mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = await this.txRepository
      .createQueryBuilder('tx')
      .where('tx.scope = :scope', { scope: TransactionScope.PLATFORM })
      .andWhere('tx.type = :type', { type: TransactionType.INCOME })
      .andWhere('tx.date >= :start', { start: startOfMonth })
      .getMany();

    const mrr = monthlyTransactions.reduce((s, t) => s + Number(t.amount), 0);

    // Agências por plano
    const byPlan = await this.agencyRepository
      .createQueryBuilder('a')
      .select(['a.plan AS plan', 'COUNT(*)::int AS count'])
      .where('a.deleted_at IS NULL')
      .groupBy('a.plan')
      .getRawMany();

    return {
      summary: {
        totalAgencies,
        activeAgencies,
        inactiveAgencies: totalAgencies - activeAgencies,
        totalOwners: totalUsers,
        openTickets,
        mrr,
        totalClients,
        totalCampaigns,
      },
      agenciesByPlan: byPlan,
    };
  }
}
