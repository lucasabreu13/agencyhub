import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../../../database/entities/campaign.entity';
import { CampaignStatus } from '../../../common/enums';
import { ClientContextService } from '../../../common/client-context.service';

@Injectable()
export class ClientCampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    private clientContextService: ClientContextService,
  ) {}

  async findAll(agencyId: string, userId: string, filters: { status?: CampaignStatus; page?: number; limit?: number }) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);
    const { status, page = 1, limit = 20 } = filters;

    const where: any = { agencyId, clientId: client.id };
    if (status) where.status = status;

    const [campaigns, total] = await this.campaignRepository.findAndCount({
      where, skip: (page - 1) * limit, take: limit, order: { createdAt: 'DESC' },
    });

    return { data: campaigns, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(agencyId: string, userId: string, id: string) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);
    const campaign = await this.campaignRepository.findOne({
      where: { id, agencyId, clientId: client.id },
    });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');
    return campaign;
  }
}
