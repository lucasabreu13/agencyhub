import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDashboardController } from './dashboard.controller';
import { AdminDashboardService } from './dashboard.service';
import { Agency } from '../../../database/entities/agency.entity';
import { Client } from '../../../database/entities/client.entity';
import { Campaign } from '../../../database/entities/campaign.entity';
import { FinancialTransaction } from '../../../database/entities/financial-transaction.entity';
import { Ticket } from '../../../database/entities/ticket.entity';
import { User } from '../../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, User, Client, Campaign, Ticket, FinancialTransaction])],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class AdminDashboardModule {}
