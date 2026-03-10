import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../../database/entities/report.entity';
import { ReportStatus } from '../../../common/enums';
import { ClientReportFilterDto } from '../shared/client-filter.dto';
import { ClientContextService } from '../../../common/client-context.service';

@Injectable()
export class ClientReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private clientContextService: ClientContextService,
  ) {}

  async findAll(agencyId: string, userId: string, filters: ClientReportFilterDto) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);
    const { status, page = 1, limit = 20 } = filters;

    const where: any = { agencyId, clientId: client.id };
    if (status) where.status = status;

    const [reports, total] = await this.reportRepository.findAndCount({
      where, skip: (page - 1) * limit, take: limit, order: { createdAt: 'DESC' },
    });

    return { data: reports, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(agencyId: string, userId: string, id: string) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);
    const report = await this.reportRepository.findOne({ where: { id, agencyId, clientId: client.id } });
    if (!report) throw new NotFoundException('Relatório não encontrado');
    return report;
  }

  async approve(agencyId: string, userId: string, id: string) {
    const report = await this.findOne(agencyId, userId, id);
    if (report.status === ReportStatus.APPROVED) {
      throw new ForbiddenException('Relatório já foi aprovado');
    }
    report.status = ReportStatus.APPROVED;
    report.approvedAt = new Date();
    return this.reportRepository.save(report);
  }

  async requestAdjustment(agencyId: string, userId: string, id: string) {
    const report = await this.findOne(agencyId, userId, id);
    report.status = ReportStatus.NEEDS_ADJUSTMENT;
    return this.reportRepository.save(report);
  }
}
