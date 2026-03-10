import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCampaignsController } from './campaigns.controller';
import { ClientCampaignsService } from './campaigns.service';
import { Campaign } from '../../../database/entities/campaign.entity';
import { Client } from '../../../database/entities/client.entity';
import { ClientContextService } from '../../../common/client-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, Client])],
  controllers: [ClientCampaignsController],
  providers: [ClientCampaignsService, ClientContextService],
})
export class ClientCampaignsModule {}
