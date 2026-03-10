import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../database/entities/audit-log.entity';

export interface AuditLogDto {
  userId: string;
  userName: string;
  userRole: string;
  agencyId?: string | null;
  entityType: string;
  entityId?: string | null;
  action: string;
  details?: string;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(data: AuditLogDto): Promise<void> {
    const log = this.auditRepository.create({
      ...data,
      agencyId: data.agencyId ?? null,
      entityId: data.entityId ?? null,
    });
    await this.auditRepository.save(log);
  }

  async findAll(filters: {
    agencyId?: string;
    entityType?: string;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 50, agencyId, entityType, userId, action, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const qb = this.auditRepository.createQueryBuilder('log');

    if (agencyId) qb.andWhere('log.agencyId = :agencyId', { agencyId });
    if (entityType) qb.andWhere('log.entityType = :entityType', { entityType });
    if (userId) qb.andWhere('log.userId = :userId', { userId });
    if (action) qb.andWhere('log.action = :action', { action });
    if (startDate) qb.andWhere('log.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('log.createdAt <= :endDate', { endDate });

    qb.orderBy('log.createdAt', 'DESC').skip(skip).take(limit);

    const [logs, total] = await qb.getManyAndCount();

    return { data: logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
