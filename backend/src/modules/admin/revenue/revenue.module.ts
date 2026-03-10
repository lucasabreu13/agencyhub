import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevenueController } from './revenue.controller';
import { RevenueService } from './revenue.service';
import { FinancialTransaction } from '../../../database/entities/financial-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTransaction])],
  controllers: [RevenueController],
  providers: [RevenueService],
  exports: [RevenueService],
})
export class AdminRevenueModule {}
