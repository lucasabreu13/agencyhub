import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =============================================
    // AGENCIES
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "agencies_plan_enum" AS ENUM ('basic', 'pro', 'enterprise');
      CREATE TYPE "agencies_status_enum" AS ENUM ('active', 'inactive', 'suspended');

      CREATE TABLE "agencies" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "name"       VARCHAR(255) NOT NULL,
        "plan"       "agencies_plan_enum" NOT NULL DEFAULT 'basic',
        "status"     "agencies_status_enum" NOT NULL DEFAULT 'active',
        "owner_id"   UUID,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_agencies" PRIMARY KEY ("id")
      );
    `);

    // =============================================
    // USERS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM ('admin', 'agency_owner', 'agency_client');

      CREATE TABLE "users" (
        "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
        "email"         VARCHAR(255) NOT NULL,
        "password_hash" VARCHAR NOT NULL,
        "name"          VARCHAR(255) NOT NULL,
        "role"          "users_role_enum" NOT NULL DEFAULT 'agency_owner',
        "agency_id"     UUID,
        "is_active"     BOOLEAN NOT NULL DEFAULT true,
        "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"    TIMESTAMP,
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      );

      CREATE INDEX "IDX_users_agency_id" ON "users" ("agency_id");
      CREATE INDEX "IDX_users_email" ON "users" ("email");
    `);

    // =============================================
    // CLIENTS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "clients_status_enum" AS ENUM ('active', 'inactive', 'paused');

      CREATE TABLE "clients" (
        "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"      UUID NOT NULL,
        "user_id"        UUID,
        "name"           VARCHAR(255) NOT NULL,
        "email"          VARCHAR(255) NOT NULL,
        "company"        VARCHAR(255),
        "phone"          VARCHAR(20),
        "monthly_budget" DECIMAL(12,2) NOT NULL DEFAULT 0,
        "status"         "clients_status_enum" NOT NULL DEFAULT 'active',
        "start_date"     DATE,
        "notes"          TEXT,
        "created_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"     TIMESTAMP,
        CONSTRAINT "PK_clients" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_clients_agency_id" ON "clients" ("agency_id");
    `);

    // =============================================
    // CAMPAIGNS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "campaigns_status_enum" AS ENUM ('active', 'paused', 'finished');

      CREATE TABLE "campaigns" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"   UUID NOT NULL,
        "client_id"   UUID NOT NULL,
        "name"        VARCHAR(255) NOT NULL,
        "platform"    VARCHAR(100),
        "status"      "campaigns_status_enum" NOT NULL DEFAULT 'active',
        "objective"   VARCHAR(255),
        "budget"      DECIMAL(12,2) NOT NULL DEFAULT 0,
        "spent"       DECIMAL(12,2) NOT NULL DEFAULT 0,
        "start_date"  DATE,
        "end_date"    DATE,
        "kpi"         VARCHAR(100),
        "kpi_value"   DECIMAL(12,2),
        "metrics"     JSONB DEFAULT '{"impressions":0,"clicks":0,"ctr":0,"conversions":0}',
        "agency_notes" TEXT,
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_campaigns" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_campaigns_agency_id" ON "campaigns" ("agency_id");
      CREATE INDEX "IDX_campaigns_client_id" ON "campaigns" ("client_id");
    `);

    // =============================================
    // PROJECTS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "projects_status_enum" AS ENUM ('planning', 'in_progress', 'review', 'completed', 'cancelled');
      CREATE TYPE "projects_priority_enum" AS ENUM ('low', 'medium', 'high');

      CREATE TABLE "projects" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"   UUID NOT NULL,
        "client_id"   UUID,
        "name"        VARCHAR(255) NOT NULL,
        "description" TEXT,
        "status"      "projects_status_enum" NOT NULL DEFAULT 'planning',
        "priority"    "projects_priority_enum" NOT NULL DEFAULT 'medium',
        "due_date"    DATE,
        "assigned_to" VARCHAR(255),
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_projects" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_projects_agency_id" ON "projects" ("agency_id");
    `);

    // =============================================
    // KANBAN TASKS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "kanban_tasks_column_enum" AS ENUM ('backlog', 'todo', 'doing', 'review', 'done');
      CREATE TYPE "kanban_tasks_priority_enum" AS ENUM ('low', 'medium', 'high');

      CREATE TABLE "kanban_tasks" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"   UUID NOT NULL,
        "project_id"  UUID,
        "client_id"   UUID,
        "title"       VARCHAR(255) NOT NULL,
        "description" TEXT,
        "column"      "kanban_tasks_column_enum" NOT NULL DEFAULT 'backlog',
        "position"    INTEGER NOT NULL DEFAULT 0,
        "assigned_to" UUID,
        "due_date"    DATE,
        "priority"    "kanban_tasks_priority_enum" NOT NULL DEFAULT 'medium',
        "tags"        JSONB,
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_kanban_tasks" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_kanban_tasks_agency_id" ON "kanban_tasks" ("agency_id");
    `);

    // =============================================
    // EVENTS (CALENDAR)
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "events_type_enum" AS ENUM ('meeting', 'delivery', 'report', 'renewal', 'other');
      CREATE TYPE "events_status_enum" AS ENUM ('pending', 'confirmed', 'cancelled');

      CREATE TABLE "events" (
        "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"    UUID NOT NULL,
        "client_id"    UUID,
        "created_by"   UUID NOT NULL,
        "title"        VARCHAR(255) NOT NULL,
        "description"  TEXT,
        "type"         "events_type_enum" NOT NULL DEFAULT 'other',
        "start_date"   TIMESTAMP NOT NULL,
        "end_date"     TIMESTAMP NOT NULL,
        "status"       "events_status_enum" NOT NULL DEFAULT 'pending',
        "meeting_link" VARCHAR,
        "participants" JSONB,
        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"   TIMESTAMP,
        CONSTRAINT "PK_events" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_events_agency_id" ON "events" ("agency_id");
    `);

    // =============================================
    // REPORTS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "reports_type_enum" AS ENUM ('monthly', 'weekly', 'custom');
      CREATE TYPE "reports_status_enum" AS ENUM ('pending', 'approved', 'needsAdjustment');

      CREATE TABLE "reports" (
        "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"      UUID NOT NULL,
        "client_id"      UUID NOT NULL,
        "created_by"     UUID NOT NULL,
        "title"          VARCHAR(255) NOT NULL,
        "period"         VARCHAR(100),
        "type"           "reports_type_enum" NOT NULL DEFAULT 'monthly',
        "status"         "reports_status_enum" NOT NULL DEFAULT 'pending',
        "pdf_url"        VARCHAR,
        "agency_summary" JSONB DEFAULT '{"whatWorked":"","whatDidntWork":"","nextSteps":""}',
        "approved_at"    TIMESTAMP,
        "created_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"     TIMESTAMP,
        CONSTRAINT "PK_reports" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_reports_agency_id" ON "reports" ("agency_id");
      CREATE INDEX "IDX_reports_client_id" ON "reports" ("client_id");
    `);

    // =============================================
    // INVOICES
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "invoices_status_enum" AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
      CREATE TYPE "invoices_payment_method_enum" AS ENUM ('pix', 'card', 'boleto');

      CREATE TABLE "invoices" (
        "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"      UUID NOT NULL,
        "client_id"      UUID NOT NULL,
        "created_by"     UUID NOT NULL,
        "number"         VARCHAR(50) NOT NULL,
        "amount"         DECIMAL(12,2) NOT NULL,
        "due_date"       DATE NOT NULL,
        "paid_date"      DATE,
        "status"         "invoices_status_enum" NOT NULL DEFAULT 'pending',
        "payment_method" "invoices_payment_method_enum",
        "payment_proof"  VARCHAR,
        "items"          JSONB NOT NULL DEFAULT '[]',
        "notes"          TEXT,
        "created_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"     TIMESTAMP,
        CONSTRAINT "PK_invoices" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_invoices_number" UNIQUE ("number")
      );

      CREATE INDEX "IDX_invoices_agency_id" ON "invoices" ("agency_id");
      CREATE INDEX "IDX_invoices_client_id" ON "invoices" ("client_id");
    `);

    // =============================================
    // TICKETS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "tickets_type_enum" AS ENUM ('campaign', 'report', 'financial', 'meeting', 'other');
      CREATE TYPE "tickets_priority_enum" AS ENUM ('low', 'medium', 'high', 'urgent');
      CREATE TYPE "tickets_status_enum" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

      CREATE TABLE "tickets" (
        "id"                 UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"          UUID,
        "client_id"          UUID,
        "created_by"         UUID NOT NULL,
        "assigned_to"        UUID,
        "title"              VARCHAR(255) NOT NULL,
        "description"        TEXT,
        "type"               "tickets_type_enum" NOT NULL DEFAULT 'other',
        "priority"           "tickets_priority_enum" NOT NULL DEFAULT 'medium',
        "status"             "tickets_status_enum" NOT NULL DEFAULT 'open',
        "sla_hours"          INTEGER NOT NULL DEFAULT 24,
        "linked_entity_type" VARCHAR,
        "linked_entity_id"   UUID,
        "resolved_at"        TIMESTAMP,
        "created_at"         TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"         TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"         TIMESTAMP,
        CONSTRAINT "PK_tickets" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_tickets_agency_id" ON "tickets" ("agency_id");

      CREATE TABLE "ticket_messages" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "ticket_id"  UUID NOT NULL,
        "user_id"    UUID NOT NULL,
        "user_name"  VARCHAR(255) NOT NULL,
        "user_role"  VARCHAR(50) NOT NULL,
        "content"    TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_ticket_messages" PRIMARY KEY ("id")
      );
    `);

    // =============================================
    // AUDIT LOGS (imutável)
    // =============================================
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"   UUID,
        "user_id"     UUID NOT NULL,
        "user_name"   VARCHAR(255) NOT NULL,
        "user_role"   VARCHAR(50) NOT NULL,
        "entity_type" VARCHAR(100) NOT NULL,
        "entity_id"   UUID,
        "action"      VARCHAR(100) NOT NULL,
        "details"     TEXT,
        "ip_address"  VARCHAR(45),
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_audit_logs_agency_id" ON "audit_logs" ("agency_id");
      CREATE INDEX "IDX_audit_logs_created_at" ON "audit_logs" ("created_at");
    `);

    // =============================================
    // GOALS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "goals_status_enum" AS ENUM ('on_track', 'at_risk', 'completed', 'failed');
      CREATE TYPE "goals_scope_enum" AS ENUM ('platform', 'agency');

      CREATE TABLE "goals" (
        "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"     UUID,
        "created_by"    UUID NOT NULL,
        "scope"         "goals_scope_enum" NOT NULL DEFAULT 'agency',
        "title"         VARCHAR(255) NOT NULL,
        "description"   TEXT,
        "target_value"  DECIMAL(12,2) NOT NULL,
        "current_value" DECIMAL(12,2) NOT NULL DEFAULT 0,
        "unit"          VARCHAR(50),
        "deadline"      DATE,
        "status"        "goals_status_enum" NOT NULL DEFAULT 'on_track',
        "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"    TIMESTAMP,
        CONSTRAINT "PK_goals" PRIMARY KEY ("id")
      );
    `);

    // =============================================
    // REMINDERS
    // =============================================
    await queryRunner.query(`
      CREATE TABLE "reminders" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"   UUID,
        "user_id"     UUID NOT NULL,
        "title"       VARCHAR(255) NOT NULL,
        "description" TEXT,
        "due_date"    TIMESTAMP NOT NULL,
        "is_done"     BOOLEAN NOT NULL DEFAULT false,
        "done_at"     TIMESTAMP,
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_reminders" PRIMARY KEY ("id")
      );
    `);

    // =============================================
    // FINANCIAL TRANSACTIONS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "financial_transactions_type_enum" AS ENUM ('income', 'expense');
      CREATE TYPE "financial_transactions_scope_enum" AS ENUM ('platform', 'agency');

      CREATE TABLE "financial_transactions" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"   UUID,
        "client_id"   UUID,
        "created_by"  UUID NOT NULL,
        "scope"       "financial_transactions_scope_enum" NOT NULL DEFAULT 'agency',
        "type"        "financial_transactions_type_enum" NOT NULL,
        "amount"      DECIMAL(12,2) NOT NULL,
        "description" VARCHAR(255) NOT NULL,
        "category"    VARCHAR(100),
        "date"        DATE NOT NULL,
        "notes"       TEXT,
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_financial_transactions" PRIMARY KEY ("id")
      );
    `);

    // =============================================
    // CRM CONTACTS
    // =============================================
    await queryRunner.query(`
      CREATE TYPE "crm_contacts_stage_enum" AS ENUM ('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost');

      CREATE TABLE "crm_contacts" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"   UUID NOT NULL,
        "name"        VARCHAR(255) NOT NULL,
        "email"       VARCHAR(255),
        "phone"       VARCHAR(30),
        "company"     VARCHAR(255),
        "position"    VARCHAR(100),
        "stage"       "crm_contacts_stage_enum" NOT NULL DEFAULT 'lead',
        "deal_value"  DECIMAL(12,2),
        "notes"       TEXT,
        "last_contact" DATE,
        "assigned_to" UUID,
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_crm_contacts" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_crm_contacts_agency_id" ON "crm_contacts" ("agency_id");
    `);

    // =============================================
    // DOCUMENTS
    // =============================================
    await queryRunner.query(`
      CREATE TABLE "documents" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"   UUID NOT NULL,
        "client_id"   UUID,
        "uploaded_by" UUID NOT NULL,
        "name"        VARCHAR(255) NOT NULL,
        "file_url"    VARCHAR NOT NULL,
        "file_type"   VARCHAR(50),
        "file_size"   INTEGER,
        "category"    VARCHAR(100),
        "description" TEXT,
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_documents" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_documents_agency_id" ON "documents" ("agency_id");
    `);

    // =============================================
    // CHAT MESSAGES
    // =============================================
    await queryRunner.query(`
      CREATE TABLE "chat_messages" (
        "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
        "agency_id"      UUID NOT NULL,
        "sender_id"      UUID NOT NULL,
        "receiver_id"    UUID NOT NULL,
        "client_id"      UUID,
        "content"        TEXT NOT NULL,
        "read_at"        TIMESTAMP,
        "attachment_url" VARCHAR,
        "created_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"     TIMESTAMP,
        CONSTRAINT "PK_chat_messages" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_chat_messages_agency_id" ON "chat_messages" ("agency_id");
      CREATE INDEX "IDX_chat_messages_client_id" ON "chat_messages" ("client_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "chat_messages" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "documents" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "crm_contacts" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "financial_transactions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "reminders" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "goals" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ticket_messages" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tickets" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invoices" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "reports" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "events" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "kanban_tasks" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "campaigns" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clients" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "agencies" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "agencies_plan_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "agencies_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "clients_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "campaigns_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "projects_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "projects_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "kanban_tasks_column_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "kanban_tasks_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "events_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "events_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "reports_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "reports_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "invoices_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "invoices_payment_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tickets_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tickets_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tickets_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "goals_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "goals_scope_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "financial_transactions_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "financial_transactions_scope_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "crm_contacts_stage_enum"`);
  }
}
