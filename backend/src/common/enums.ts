export enum AgencyPlan {
  STARTER = 'starter',
  PRO = 'pro',
  SCALE = 'scale',
}

export enum AgencyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum UserRole {
  ADMIN = 'admin',
  AGENCY_OWNER = 'agency_owner',
  AGENCY_CLIENT = 'agency_client',
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
}

export enum CampaignStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  FINISHED = 'finished',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionScope {
  PLATFORM = 'platform',
  AGENCY = 'agency',
}

export enum PaymentMethod {
  PIX = 'pix',
  CARD = 'card',
  BOLETO = 'boleto',
}

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum ReportType {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export enum ReportStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  NEEDS_ADJUSTMENT = 'needsAdjustment',
}

export enum TicketType {
  CAMPAIGN = 'campaign',
  REPORT = 'report',
  FINANCIAL = 'financial',
  MEETING = 'meeting',
  OTHER = 'other',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum GoalScope {
  PLATFORM = 'platform',
  AGENCY = 'agency',
}

export enum GoalStatus {
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum CrmStage {
  LEAD = 'lead',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum KanbanColumn {
  BACKLOG = 'backlog',
  TODO = 'todo',
  DOING = 'doing',
  REVIEW = 'review',
  DONE = 'done',
}

export enum EventType {
  MEETING = 'meeting',
  DELIVERY = 'delivery',
  REPORT = 'report',
  RENEWAL = 'renewal',
  OTHER = 'other',
}

export enum EventStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum SubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}
