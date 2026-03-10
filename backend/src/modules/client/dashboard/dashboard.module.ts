import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDashboardController } from './dashboard.controller';
import { ClientDashboardService } from './dashboard.service';
import { Campaign } from '../../../database/entities/campaign.entity';
import { Client } from '../../../database/entities/client.entity';
import { Invoice } from '../../../database/entities/invoice.entity';
import { Report } from '../../../database/entities/report.entity';
import { ClientContextService } from '../../../common/client-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, Report, Invoice, Client])],
  controllers: [ClientDashboardController],
  providers: [ClientDashboardService, ClientContextService],
})
export class ClientDashboardModule {}
