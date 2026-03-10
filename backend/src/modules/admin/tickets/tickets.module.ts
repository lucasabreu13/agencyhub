import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from '../../../database/entities/ticket.entity';
import { TicketMessage } from '../../../database/entities/ticket-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketMessage])],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class AdminTicketsModule {}
