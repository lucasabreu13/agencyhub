export type UserRole = "admin" | "agency_owner" | "agency_client"

export interface ActivityLog {
  id: string
  entityType: "campaign" | "report" | "ticket" | "event" | "message" | "document" | "invoice"
  entityId: string
  action: string
  userId: string
  userName: string
  userRole: UserRole
  timestamp: Date
  details: string
  ipAddress?: string
}

export interface Campaign {
  id: string
  name: string
  platform: string
  status: "active" | "paused" | "finished"
  objective: string
  startDate: Date
  endDate?: Date
  budget: number
  spent: number
  kpi: string
  kpiValue: number
  clientId: string
  agencyId: string
  metrics: {
    impressions: number
    clicks: number
    ctr: number
    conversions: number
  }
  history: ActivityLog[]
  agencyNotes: string
}

export interface Report {
  id: string
  title: string
  period: string
  type: "monthly" | "weekly" | "custom"
  status: "pending" | "approved" | "needsAdjustment"
  createdAt: Date
  clientId: string
  agencyId: string
  agencySummary: {
    whatWorked: string
    whatDidntWork: string
    nextSteps: string
  }
  pdfUrl: string
  comments: Comment[]
  logs: ActivityLog[]
}

export interface Event {
  id: string
  title: string
  type: "meeting" | "delivery" | "report" | "renewal" | "other"
  startDate: Date
  endDate: Date
  description: string
  status: "pending" | "confirmed" | "cancelled"
  participants: Array<{
    id: string
    name: string
    email: string
    role: UserRole
    confirmationStatus: "pending" | "confirmed" | "declined"
  }>
  createdBy: string
  clientId: string
  agencyId: string
  meetingLink?: string
  logs: ActivityLog[]
}

export interface Ticket {
  id: string
  title: string
  type: "campaign" | "report" | "financial" | "meeting" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_progress" | "resolved" | "closed"
  createdAt: Date
  updatedAt: Date
  sla: number // hours
  linkedEntityType?: "campaign" | "report"
  linkedEntityId?: string
  clientId: string
  agencyId: string
  createdBy: string
  assignedTo?: string
  messages: TicketMessage[]
  logs: ActivityLog[]
}

export interface TicketMessage {
  id: string
  ticketId: string
  content: string
  createdAt: Date
  userId: string
  userName: string
  userRole: UserRole
}

export interface Comment {
  id: string
  entityType: "campaign" | "report"
  entityId: string
  content: string
  createdAt: Date
  userId: string
  userName: string
  userRole: UserRole
}

export interface Invoice {
  id: string
  number: string
  clientId: string
  agencyId: string
  amount: number
  dueDate: Date
  paidDate?: Date
  status: "pending" | "paid" | "overdue" | "cancelled"
  paymentMethod?: "pix" | "card" | "boleto"
  paymentProof?: string
  items: Array<{
    description: string
    amount: number
  }>
}
