import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientMessagesController } from './messages.controller';
import { ClientMessagesService } from './messages.service';
import { ChatMessage } from '../../../database/entities/chat-message.entity';
import { Client } from '../../../database/entities/client.entity';
import { ClientContextService } from '../../../common/client-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, Client])],
  controllers: [ClientMessagesController],
  providers: [ClientMessagesService, ClientContextService],
})
export class ClientMessagesModule {}
