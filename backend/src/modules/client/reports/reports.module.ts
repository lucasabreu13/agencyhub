import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientReportsController } from './reports.controller';
import { ClientReportsService } from './reports.service';
import { Client } from '../../../database/entities/client.entity';
import { Report } from '../../../database/entities/report.entity';
import { ClientContextService } from '../../../common/client-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Client])],
  controllers: [ClientReportsController],
  providers: [ClientReportsService, ClientContextService],
})
export class ClientReportsModule {}
