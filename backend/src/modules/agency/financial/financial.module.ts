import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyFinancialController } from './financial.controller';
import { AgencyFinancialService } from './financial.service';
import { FinancialTransaction } from '../../../database/entities/financial-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTransaction])],
  controllers: [AgencyFinancialController],
  providers: [AgencyFinancialService],
})
export class AgencyFinancialModule {}
