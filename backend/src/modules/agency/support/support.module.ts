import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencySupportController } from './support.controller';
import { TicketsService } from '../../admin/tickets/tickets.service';
import { Ticket } from '../../../database/entities/ticket.entity';
import { TicketMessage } from '../../../database/entities/ticket-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketMessage])],
  controllers: [AgencySupportController],
  providers: [TicketsService],
})
export class AgencySupportModule {}
