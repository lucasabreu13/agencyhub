import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { Campaign } from '../../database/entities/campaign.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign])],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
