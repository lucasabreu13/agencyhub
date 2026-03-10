import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../../../database/entities/campaign.entity';
import { Client } from '../../../database/entities/client.entity';
import { Invoice } from '../../../database/entities/invoice.entity';
import { Report } from '../../../database/entities/report.entity';
import { CampaignStatus, InvoiceStatus, ReportStatus } from '../../../common/enums';
import { ClientContextService } from '../../../common/client-context.service';

@Injectable()
export class ClientDashboardService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private clientContextService: ClientContextService,
  ) {}

  async getDashboard(agencyId: string, userId: string) {
    // Resolve o client real a partir do userId autenticado
    const client = await this.clientContextService.resolveClient(agencyId, userId);
    const clientId = client.id;

    const [allCampaigns] = await this.campaignRepository.findAndCount({
      where: { agencyId, clientId },
    });

    const totalCampaigns = allCampaigns.length;
    const activeCount = allCampaigns.filter(c => c.status === CampaignStatus.ACTIVE).length;

    const [pendingReports] = await this.reportRepository.findAndCount({
      where: { agencyId, clientId, status: ReportStatus.PENDING },
    });

    const [overdueInvoices] = await this.invoiceRepository.findAndCount({
      where: { agencyId, clientId, status: InvoiceStatus.OVERDUE },
    });

    // Investimento total e gasto nas campanhas ativas
    const activeCampaigns = allCampaigns.filter(c => c.status === CampaignStatus.ACTIVE);
    const totalBudget = activeCampaigns.reduce((s, c) => s + Number(c.budget), 0);
    const totalSpent = activeCampaigns.reduce((s, c) => s + Number(c.spent), 0);

    // Métricas agregadas de todas as campanhas
    const aggregatedMetrics = activeCampaigns.reduce(
      (acc, c) => {
        if (c.metrics) {
          acc.impressions += c.metrics.impressions || 0;
          acc.clicks += c.metrics.clicks || 0;
          acc.conversions += c.metrics.conversions || 0;
        }
        return acc;
      },
      { impressions: 0, clicks: 0, conversions: 0 },
    );

    const recentCampaigns = activeCampaigns
      .filter(c => c.status === CampaignStatus.ACTIVE)
      .slice(0, 3);

    return {
      summary: {
        activeCampaigns: activeCount,
        totalCampaigns,
        pendingReports: pendingReports.length,
        overdueInvoices: overdueInvoices.length,
        totalBudget,
        totalSpent,
        budgetUsedPercent: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
      },
      metrics: aggregatedMetrics,
      recentCampaigns,
    };
  }
}
