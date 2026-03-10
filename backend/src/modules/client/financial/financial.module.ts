import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientFinancialController } from './financial.controller';
import { ClientFinancialService } from './financial.service';
import { Client } from '../../../database/entities/client.entity';
import { Invoice } from '../../../database/entities/invoice.entity';
import { ClientContextService } from '../../../common/client-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Client])],
  controllers: [ClientFinancialController],
  providers: [ClientFinancialService, ClientContextService],
})
export class ClientFinancialModule {}
