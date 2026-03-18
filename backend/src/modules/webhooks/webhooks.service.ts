import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../../database/entities/campaign.entity';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectRepository(Campaign)
    private campaignRepo: Repository<Campaign>,
  ) {}

  async handleMeta(agencyId: string, payload: any, signature: string) {
    // Verificar assinatura do Meta (segurança)
    const secret = process.env.META_APP_SECRET;
    if (secret && signature) {
      const expected = 'sha256=' + crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');
      if (expected !== signature) {
        this.logger.warn(`Meta webhook: assinatura inválida para agência ${agencyId}`);
        return { received: false, error: 'Invalid signature' };
      }
    }

    // Processar dados de campanha do Meta Ads
    if (payload?.data) {
      for (const entry of payload.data) {
        try {
          // Buscar campanha pelo externalId (ID do Meta)
          const campaign = await this.campaignRepo.findOne({
            where: { agencyId, externalId: entry.campaign_id?.toString() },
          });

          if (campaign) {
            if (entry.spend !== undefined) campaign.spent = Number(entry.spend);
            if (entry.impressions !== undefined) campaign.metrics = {
              ...((campaign.metrics as any) || {}),
              impressions: Number(entry.impressions),
              clicks: Number(entry.clicks || 0),
              ctr: entry.ctr ? Number(entry.ctr) : undefined,
              cpc: entry.cpc ? Number(entry.cpc) : undefined,
            };
            await this.campaignRepo.save(campaign);
            this.logger.log(`Campanha ${campaign.id} atualizada via Meta webhook`);
          }
        } catch (err) {
          this.logger.error(`Erro ao processar entrada Meta: ${err.message}`);
        }
      }
    }

    return { received: true };
  }

  async handleGoogle(agencyId: string, payload: any) {
    // Processar dados do Google Ads
    if (payload?.campaigns) {
      for (const entry of payload.campaigns) {
        try {
          const campaign = await this.campaignRepo.findOne({
            where: { agencyId, externalId: entry.id?.toString() },
          });

          if (campaign) {
            if (entry.cost_micros !== undefined) {
              campaign.spent = Number(entry.cost_micros) / 1_000_000;
            }
            if (entry.metrics) {
              campaign.metrics = {
                ...((campaign.metrics as any) || {}),
                impressions: Number(entry.metrics.impressions || 0),
                clicks: Number(entry.metrics.clicks || 0),
                conversions: Number(entry.metrics.conversions || 0),
              };
            }
            await this.campaignRepo.save(campaign);
            this.logger.log(`Campanha ${campaign.id} atualizada via Google webhook`);
          }
        } catch (err) {
          this.logger.error(`Erro ao processar entrada Google: ${err.message}`);
        }
      }
    }

    return { received: true };
  }
}
