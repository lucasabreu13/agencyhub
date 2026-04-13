import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/database.config';

// Novos módulos
import { UploadModule } from './modules/upload/upload.module';
import { EmailModule } from './modules/email/email.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { PaymentsModule } from './modules/payments/payments.module';

// Admin modules
import { AdminAgenciesModule } from './modules/admin/agencies/agencies.module';
import { AdminUsersModule } from './modules/admin/users/users.module';
import { AdminTicketsModule } from './modules/admin/tickets/tickets.module';
import { AdminRevenueModule } from './modules/admin/revenue/revenue.module';
import { AdminGoalsModule } from './modules/admin/goals/goals.module';
import { AdminRemindersModule } from './modules/admin/reminders/reminders.module';
import { AdminAuditModule } from './modules/admin/audit/audit.module';
import { AdminDashboardModule } from './modules/admin/dashboard/dashboard.module';

// Agency modules
import { AgencyClientsModule } from './modules/agency/clients/clients.module';
import { AgencyCampaignsModule } from './modules/agency/campaigns/campaigns.module';
import { AgencyCrmModule } from './modules/agency/crm/crm.module';
import { AgencyProjectsModule } from './modules/agency/projects/projects.module';
import { AgencyKanbanModule } from './modules/agency/kanban/kanban.module';
import { AgencyCalendarModule } from './modules/agency/calendar/calendar.module';
import { AgencyReportsModule } from './modules/agency/reports/reports.module';
import { AgencyInvoicesModule } from './modules/agency/invoices/invoices.module';
import { AgencyDocumentsModule } from './modules/agency/documents/documents.module';
import { AgencyChatModule } from './modules/agency/chat/chat.module';
import { AgencySupportModule } from './modules/agency/support/support.module';
import { AgencyGoalsModule } from './modules/agency/goals/goals.module';
import { AgencyUsersModule } from './modules/agency/users/users.module';
import { AgencyFinancialModule } from './modules/agency/financial/financial.module';
import { AgencySettingsModule } from './modules/agency/settings/settings.module';

// Client modules
import { ClientDashboardModule } from './modules/client/dashboard/dashboard.module';
import { ClientCampaignsModule } from './modules/client/campaigns/campaigns.module';
import { ClientReportsModule } from './modules/client/reports/reports.module';
import { ClientDocumentsModule } from './modules/client/documents/documents.module';
import { ClientFinancialModule } from './modules/client/financial/financial.module';
import { ClientSupportModule } from './modules/client/support/support.module';
import { ClientMessagesModule } from './modules/client/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({ useFactory: databaseConfig }),

    // Servir arquivos de upload como estáticos
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // Auth
    AuthModule,

    // Infra
    EmailModule,
    NotificationsModule,
    UploadModule,
    WebhooksModule,
    PaymentsModule,

    // Admin
    AdminDashboardModule,
    AdminAgenciesModule,
    AdminUsersModule,
    AdminTicketsModule,
    AdminRevenueModule,
    AdminGoalsModule,
    AdminRemindersModule,
    AdminAuditModule,

    // Agency
    AgencyClientsModule,
    AgencyCampaignsModule,
    AgencyCrmModule,
    AgencyProjectsModule,
    AgencyKanbanModule,
    AgencyCalendarModule,
    AgencyReportsModule,
    AgencyInvoicesModule,
    AgencyDocumentsModule,
    AgencyChatModule,
    AgencySupportModule,
    AgencyGoalsModule,
    AgencyUsersModule,
    AgencyFinancialModule,
    AgencySettingsModule,

    // Client
    ClientDashboardModule,
    ClientCampaignsModule,
    ClientReportsModule,
    ClientDocumentsModule,
    ClientFinancialModule,
    ClientSupportModule,
    ClientMessagesModule,
  ],
})
export class AppModule {}
