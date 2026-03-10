import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { seed } from './seed';
import { Agency } from '../entities/agency.entity';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';
import { Campaign } from '../entities/campaign.entity';
import { Goal } from '../entities/goal.entity';
import { Reminder } from '../entities/reminder.entity';
import { FinancialTransaction } from '../entities/financial-transaction.entity';
import { Ticket } from '../entities/ticket.entity';
import { TicketMessage } from '../entities/ticket-message.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { CrmContact } from '../entities/crm-contact.entity';
import { Project } from '../entities/project.entity';
import { KanbanTask } from '../entities/kanban-task.entity';
import { Event } from '../entities/event.entity';
import { Report } from '../entities/report.entity';
import { Invoice } from '../entities/invoice.entity';
import { Document } from '../entities/document.entity';
import { ChatMessage } from '../entities/chat-message.entity';

dotenv.config();

export async function runSeed() {
  const isProduction = process.env.NODE_ENV === 'production';

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: String(process.env.DB_PASSWORD || 'postgres'),
    database: process.env.DB_DATABASE || 'agency_hub',
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    entities: [
      Agency, User, Client, Campaign, Goal, Reminder, FinancialTransaction,
      Ticket, TicketMessage, AuditLog, CrmContact, Project, KanbanTask,
      Event, Report, Invoice, Document, ChatMessage,
    ],
    synchronize: false,
    logging: false,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  });

  const ds = await dataSource.initialize();
  console.log('🔄 Rodando migrations...');
  await ds.runMigrations();
  console.log('✅ Migrations concluídas');
  await seed(ds);
  await ds.destroy();
}

// Permite rodar diretamente via CLI: npx ts-node run-seed.ts
if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Erro no seed:', err);
      process.exit(1);
    });
}
