import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDocumentsController } from './documents.controller';
import { ClientDocumentsService } from './documents.service';
import { Document } from '../../../database/entities/document.entity';
import { Client } from '../../../database/entities/client.entity';
import { ClientContextService } from '../../../common/client-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Client])],
  controllers: [ClientDocumentsController],
  providers: [ClientDocumentsService, ClientContextService],
})
export class ClientDocumentsModule {}
