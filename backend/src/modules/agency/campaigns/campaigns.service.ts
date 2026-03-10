import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Campaign } from '../../../database/entities/campaign.entity';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  UpdateMetricsDto,
  CampaignFilterDto,
} from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  async findAll(agencyId: string, filters: CampaignFilterDto) {
    const { search, clientId, status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { agencyId };
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (search) where.name = Like(`%${search}%`);

    const [campaigns, total] = await this.campaignRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data: campaigns, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(agencyId: string, id: string) {
    const campaign = await this.campaignRepository.findOne({ where: { id, agencyId } });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');
    return campaign;
  }

  async create(agencyId: string, createCampaignDto: CreateCampaignDto) {
    const campaign = this.campaignRepository.create({
      ...createCampaignDto,
      agencyId,
      metrics: { impressions: 0, clicks: 0, ctr: 0, conversions: 0 },
    });
    return this.campaignRepository.save(campaign);
  }

  async update(agencyId: string, id: string, updateCampaignDto: UpdateCampaignDto) {
    const campaign = await this.findOne(agencyId, id);
    Object.assign(campaign, updateCampaignDto);
    return this.campaignRepository.save(campaign);
  }

  async updateMetrics(agencyId: string, id: string, metricsDto: UpdateMetricsDto) {
    const campaign = await this.findOne(agencyId, id);
    const { spent, ...metrics } = metricsDto;

    campaign.metrics = { ...campaign.metrics, ...metrics };
    if (spent !== undefined) campaign.spent = spent;

    return this.campaignRepository.save(campaign);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.campaignRepository.softDelete(id);
    return { message: 'Campanha removida com sucesso' };
  }
}
