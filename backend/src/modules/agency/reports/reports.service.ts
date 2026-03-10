import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../../database/entities/report.entity';
import { ReportStatus } from '../../../common/enums';
import { CreateReportDto, UpdateReportDto, ReportFilterDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async findAll(agencyId: string, filters: { clientId?: string; status?: ReportStatus; page?: number; limit?: number }) {
    const { clientId, status, page = 1, limit = 20 } = filters;
    const where: any = { agencyId };
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const [reports, total] = await this.reportRepository.findAndCount({
      where, skip: (page - 1) * limit, take: limit, order: { createdAt: 'DESC' },
    });

    return { data: reports, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(agencyId: string, id: string) {
    const report = await this.reportRepository.findOne({ where: { id, agencyId } });
    if (!report) throw new NotFoundException('Relatório não encontrado');
    return report;
  }

  async create(agencyId: string, dto: CreateReportDto, userId: string) {
    const report = this.reportRepository.create({ ...dto, agencyId, createdBy: userId });
    return this.reportRepository.save(report);
  }

  async update(agencyId: string, id: string, dto: UpdateReportDto) {
    const report = await this.findOne(agencyId, id);
    Object.assign(report, dto);
    return this.reportRepository.save(report);
  }

  async approve(agencyId: string, id: string) {
    const report = await this.findOne(agencyId, id);
    report.status = ReportStatus.APPROVED;
    report.approvedAt = new Date();
    return this.reportRepository.save(report);
  }

  async requestAdjustment(agencyId: string, id: string) {
    const report = await this.findOne(agencyId, id);
    report.status = ReportStatus.NEEDS_ADJUSTMENT;
    return this.reportRepository.save(report);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.reportRepository.softDelete(id);
    return { message: 'Relatório removido com sucesso' };
  }
}
