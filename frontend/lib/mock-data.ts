// Mock data for the platform

export interface Client {
  id: string
  name: string
  email: string
  company: string
  status: "active" | "inactive" | "paused"
  monthlyBudget: number
  startDate: Date
  agencyId: string
}

export interface Campaign {
  id: string
  name: string
  clientId: string
  status: "active" | "paused" | "completed"
  startDate: Date
  endDate?: Date
  budget: number
  spent: number
  platform: string
  agencyId: string
}

export interface Project {
  id: string
  name: string
  clientId: string
  status: "planning" | "in_progress" | "review" | "completed"
  dueDate: Date
  assignedTo: string
  priority: "low" | "medium" | "high"
  agencyId: string
}

export const mockClients: Client[] = [
  {
    id: "c1",
    name: "TechStart Solutions",
    email: "contato@techstart.com",
    company: "TechStart",
    status: "active",
    monthlyBudget: 15000,
    startDate: new Date("2024-01-15"),
    agencyId: "agency-1",
  },
  {
    id: "c2",
    name: "Fashion Boutique",
    email: "marketing@fashion.com",
    company: "Fashion Co",
    status: "active",
    monthlyBudget: 8000,
    startDate: new Date("2024-03-20"),
    agencyId: "agency-1",
  },
  {
    id: "c3",
    name: "Food Delivery Pro",
    email: "growth@foodpro.com",
    company: "Food Pro",
    status: "paused",
    monthlyBudget: 12000,
    startDate: new Date("2023-11-10"),
    agencyId: "agency-1",
  },
]

export const mockCampaigns: Campaign[] = [
  {
    id: "cam1",
    name: "Lançamento Produto Q1",
    clientId: "c1",
    status: "active",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-03-31"),
    budget: 15000,
    spent: 8500,
    platform: "Google Ads",
    agencyId: "agency-1",
  },
  {
    id: "cam2",
    name: "Campanha Verão 2026",
    clientId: "c2",
    status: "active",
    startDate: new Date("2025-12-15"),
    endDate: new Date("2026-02-28"),
    budget: 8000,
    spent: 6200,
    platform: "Meta Ads",
    agencyId: "agency-1",
  },
  {
    id: "cam3",
    name: "Black Friday 2025",
    clientId: "c2",
    status: "completed",
    startDate: new Date("2025-11-01"),
    endDate: new Date("2025-11-30"),
    budget: 10000,
    spent: 9800,
    platform: "Multi-plataforma",
    agencyId: "agency-1",
  },
]

export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Redesign Landing Page",
    clientId: "c1",
    status: "in_progress",
    dueDate: new Date("2026-02-15"),
    assignedTo: "Ana Silva",
    priority: "high",
    agencyId: "agency-1",
  },
  {
    id: "p2",
    name: "Estratégia de Conteúdo Q1",
    clientId: "c2",
    status: "planning",
    dueDate: new Date("2026-02-28"),
    assignedTo: "Carlos Santos",
    priority: "medium",
    agencyId: "agency-1",
  },
  {
    id: "p3",
    name: "Análise de Competidores",
    clientId: "c1",
    status: "completed",
    dueDate: new Date("2025-12-31"),
    assignedTo: "Ana Silva",
    priority: "low",
    agencyId: "agency-1",
  },
]

export const mockCampaignComments: CampaignComment[] = [
  {
    id: "cc1",
    campaignId: "cam1",
    content: "Os resultados estão muito bons! Podemos aumentar o orçamento?",
    userId: "c1",
    userName: "TechStart Team",
    userRole: "client",
    createdAt: new Date("2026-01-05T11:30:00"),
  },
  {
    id: "cc2",
    campaignId: "cam1",
    content: "Ótimo! Vamos avaliar a possibilidade de aumento e retornamos em breve.",
    userId: "u1",
    userName: "João Silva",
    userRole: "agency",
    createdAt: new Date("2026-01-05T14:15:00"),
  },
]

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "new" | "contacted" | "qualified" | "unqualified"
  agencyId: string
  createdAt: Date
  logs: ActivityLog[]
}

export interface Opportunity {
  id: string
  title: string
  clientName: string
  value: number
  status: "prospecting" | "proposal" | "negotiation" | "won" | "lost"
  probability: number
  agencyId: string
  createdAt: Date
  logs: ActivityLog[]
}

export interface ActivityLog {
  id: string
  action: string
  user: string
  timestamp: Date
}

export const mockLeads: Lead[] = [
  {
    id: "l1",
    name: "Carlos Mendes",
    email: "carlos@startup.com",
    phone: "(11) 98765-4321",
    company: "Startup Tech",
    status: "new",
    agencyId: "agency-1",
    createdAt: new Date("2026-01-04T09:00:00"),
    logs: [
      {
        id: "log1",
        action: "Lead criado",
        user: "João Silva",
        timestamp: new Date("2026-01-04T09:00:00"),
      },
    ],
  },
  {
    id: "l2",
    name: "Ana Paula",
    email: "ana@ecommerce.com",
    phone: "(21) 97654-3210",
    company: "E-commerce Plus",
    status: "contacted",
    agencyId: "agency-1",
    createdAt: new Date("2026-01-03T14:30:00"),
    logs: [
      {
        id: "log2",
        action: "Lead criado",
        user: "João Silva",
        timestamp: new Date("2026-01-03T14:30:00"),
      },
      {
        id: "log3",
        action: "Status alterado para 'contacted'",
        user: "Maria Santos",
        timestamp: new Date("2026-01-04T10:15:00"),
      },
    ],
  },
  {
    id: "l3",
    name: "Roberto Lima",
    email: "roberto@consultoria.com",
    phone: "(31) 99876-5432",
    company: "Consultoria Empresarial",
    status: "qualified",
    agencyId: "agency-1",
    createdAt: new Date("2026-01-02T11:00:00"),
    logs: [
      {
        id: "log4",
        action: "Lead criado",
        user: "João Silva",
        timestamp: new Date("2026-01-02T11:00:00"),
      },
      {
        id: "log5",
        action: "Status alterado para 'qualified'",
        user: "João Silva",
        timestamp: new Date("2026-01-03T16:20:00"),
      },
    ],
  },
]

export const mockOpportunities: Opportunity[] = [
  {
    id: "o1",
    title: "Campanha Lançamento Produto",
    clientName: "Startup Tech",
    value: 25000,
    status: "proposal",
    probability: 70,
    agencyId: "agency-1",
    createdAt: new Date("2026-01-03T10:00:00"),
    logs: [
      {
        id: "log6",
        action: "Oportunidade criada",
        user: "João Silva",
        timestamp: new Date("2026-01-03T10:00:00"),
      },
      {
        id: "log7",
        action: "Proposta enviada ao cliente",
        user: "Maria Santos",
        timestamp: new Date("2026-01-04T11:30:00"),
      },
    ],
  },
  {
    id: "o2",
    title: "Gestão de Redes Sociais",
    clientName: "E-commerce Plus",
    value: 8000,
    status: "negotiation",
    probability: 85,
    agencyId: "agency-1",
    createdAt: new Date("2026-01-02T15:00:00"),
    logs: [
      {
        id: "log8",
        action: "Oportunidade criada",
        user: "João Silva",
        timestamp: new Date("2026-01-02T15:00:00"),
      },
      {
        id: "log9",
        action: "Reunião realizada",
        user: "João Silva",
        timestamp: new Date("2026-01-04T09:00:00"),
      },
    ],
  },
]

export interface KanbanCard {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  assignedTo: string
  dueDate: Date
  agencyId: string
  logs: ActivityLog[]
}

export const mockKanbanCards: KanbanCard[] = [
  {
    id: "k1",
    title: "Criar mockups landing page",
    description: "Desenvolver mockups para nova landing page do cliente TechStart",
    status: "todo",
    priority: "high",
    assignedTo: "Ana Silva",
    dueDate: new Date("2026-01-10"),
    agencyId: "agency-1",
    logs: [
      {
        id: "log10",
        action: "Card criado",
        user: "João Silva",
        timestamp: new Date("2026-01-03T09:00:00"),
      },
    ],
  },
  {
    id: "k2",
    title: "Revisar copy das campanhas",
    description: "Revisar textos publicitários das campanhas ativas",
    status: "in_progress",
    priority: "medium",
    assignedTo: "Carlos Santos",
    dueDate: new Date("2026-01-08"),
    agencyId: "agency-1",
    logs: [
      {
        id: "log11",
        action: "Card criado",
        user: "Maria Santos",
        timestamp: new Date("2026-01-02T14:00:00"),
      },
      {
        id: "log12",
        action: "Card movido para 'Em Progresso'",
        user: "Carlos Santos",
        timestamp: new Date("2026-01-04T08:30:00"),
      },
    ],
  },
  {
    id: "k3",
    title: "Relatório de performance Q4",
    description: "Compilar dados e criar relatório de performance do último trimestre",
    status: "review",
    priority: "high",
    assignedTo: "Ana Silva",
    dueDate: new Date("2026-01-07"),
    agencyId: "agency-1",
    logs: [
      {
        id: "log13",
        action: "Card criado",
        user: "João Silva",
        timestamp: new Date("2025-12-28T10:00:00"),
      },
      {
        id: "log14",
        action: "Card movido para 'Revisão'",
        user: "Ana Silva",
        timestamp: new Date("2026-01-03T16:00:00"),
      },
    ],
  },
  {
    id: "k4",
    title: "Setup Google Analytics",
    description: "Configurar Google Analytics para novo cliente",
    status: "done",
    priority: "low",
    assignedTo: "Carlos Santos",
    dueDate: new Date("2026-01-05"),
    agencyId: "agency-1",
    logs: [
      {
        id: "log15",
        action: "Card criado",
        user: "Maria Santos",
        timestamp: new Date("2026-01-01T11:00:00"),
      },
      {
        id: "log16",
        action: "Card concluído",
        user: "Carlos Santos",
        timestamp: new Date("2026-01-04T14:00:00"),
      },
    ],
  },
]

export interface FinancialTransaction {
  id: string
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: Date
  status: "pending" | "paid" | "overdue"
  agencyId: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  amount: number
  issueDate: Date
  dueDate: Date
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  agencyId: string
}

export const mockTransactions: FinancialTransaction[] = [
  {
    id: "ft1",
    type: "income",
    category: "Serviços",
    description: "Pagamento mensalidade TechStart",
    amount: 15000,
    date: new Date("2026-01-05"),
    status: "paid",
    agencyId: "agency-1",
  },
  {
    id: "ft2",
    type: "income",
    category: "Serviços",
    description: "Pagamento projeto Fashion Co",
    amount: 8000,
    date: new Date("2026-01-03"),
    status: "paid",
    agencyId: "agency-1",
  },
  {
    id: "ft3",
    type: "expense",
    category: "Marketing",
    description: "Google Ads - Cliente TechStart",
    amount: 5000,
    date: new Date("2026-01-02"),
    status: "paid",
    agencyId: "agency-1",
  },
  {
    id: "ft4",
    type: "expense",
    category: "Operacional",
    description: "Software e ferramentas",
    amount: 2500,
    date: new Date("2026-01-01"),
    status: "paid",
    agencyId: "agency-1",
  },
  {
    id: "ft5",
    type: "income",
    category: "Serviços",
    description: "Pagamento mensalidade Food Pro",
    amount: 12000,
    date: new Date("2026-01-10"),
    status: "pending",
    agencyId: "agency-1",
  },
  {
    id: "ft6",
    type: "expense",
    category: "Pessoal",
    description: "Freelancer - Design",
    amount: 3500,
    date: new Date("2026-01-15"),
    status: "pending",
    agencyId: "agency-1",
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: "inv1",
    invoiceNumber: "NF-2026-001",
    clientId: "c1",
    clientName: "TechStart Solutions",
    amount: 15000,
    issueDate: new Date("2025-12-28"),
    dueDate: new Date("2026-01-05"),
    status: "paid",
    agencyId: "agency-1",
  },
  {
    id: "inv2",
    invoiceNumber: "NF-2026-002",
    clientId: "c2",
    clientName: "Fashion Boutique",
    amount: 8000,
    issueDate: new Date("2025-12-30"),
    dueDate: new Date("2026-01-10"),
    status: "sent",
    agencyId: "agency-1",
  },
  {
    id: "inv3",
    invoiceNumber: "NF-2026-003",
    clientId: "c3",
    clientName: "Food Delivery Pro",
    amount: 12000,
    issueDate: new Date("2026-01-02"),
    dueDate: new Date("2026-01-15"),
    status: "sent",
    agencyId: "agency-1",
  },
  {
    id: "inv4",
    invoiceNumber: "NF-2025-045",
    clientId: "c2",
    clientName: "Fashion Boutique",
    amount: 8000,
    issueDate: new Date("2025-11-28"),
    dueDate: new Date("2025-12-10"),
    status: "overdue",
    agencyId: "agency-1",
  },
]

export interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  startDate: Date
  endDate: Date
  category: "revenue" | "clients" | "campaigns" | "team"
  agencyId: string
}

export const mockGoals: Goal[] = [
  {
    id: "g1",
    title: "Receita Mensal",
    description: "Meta de receita para o primeiro trimestre de 2026",
    target: 100000,
    current: 35000,
    unit: "R$",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-03-31"),
    category: "revenue",
    agencyId: "agency-1",
  },
  {
    id: "g2",
    title: "Novos Clientes",
    description: "Adquirir novos clientes no primeiro trimestre",
    target: 10,
    current: 3,
    unit: "clientes",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-03-31"),
    category: "clients",
    agencyId: "agency-1",
  },
  {
    id: "g3",
    title: "Campanhas Ativas",
    description: "Aumentar número de campanhas ativas simultâneas",
    target: 15,
    current: 12,
    unit: "campanhas",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-06-30"),
    category: "campaigns",
    agencyId: "agency-1",
  },
  {
    id: "g4",
    title: "Crescimento do Time",
    description: "Expandir equipe com novos talentos",
    target: 8,
    current: 5,
    unit: "membros",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-12-31"),
    category: "team",
    agencyId: "agency-1",
  },
]

export interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  userType: "agency_owner" | "client"
  userId: string
  userName: string
  userEmail: string
  agencyName: string
  createdAt: Date
  updatedAt: Date
  assignedTo?: string
  responses: TicketResponse[]
}

export interface TicketResponse {
  id: string
  ticketId: string
  message: string
  authorType: "admin" | "user"
  authorName: string
  createdAt: Date
}

export const mockTickets: Ticket[] = [
  {
    id: "t1",
    title: "Problema de acesso ao dashboard",
    description: "Não consigo fazer login na plataforma. Aparece erro 'credenciais inválidas' mesmo com senha correta.",
    status: "open",
    priority: "high",
    userType: "agency_owner",
    userId: "user-1",
    userName: "João Silva",
    userEmail: "joao@agenciadigital.com",
    agencyName: "Agência Digital Pro",
    createdAt: new Date("2026-01-03T10:30:00"),
    updatedAt: new Date("2026-01-03T10:30:00"),
    responses: [],
  },
  {
    id: "t2",
    title: "Dúvida sobre relatórios de ROI",
    description: "Como posso exportar os relatórios de ROI em formato PDF? Não encontrei essa opção no sistema.",
    status: "in_progress",
    priority: "medium",
    userType: "client",
    userId: "c1",
    userName: "TechStart Solutions",
    userEmail: "contato@techstart.com",
    agencyName: "Agência Digital Pro",
    createdAt: new Date("2026-01-02T14:20:00"),
    updatedAt: new Date("2026-01-03T09:15:00"),
    assignedTo: "Suporte Técnico",
    responses: [
      {
        id: "r1",
        ticketId: "t2",
        message:
          "Olá! Obrigado por entrar em contato. Estamos verificando a funcionalidade de exportação e retornaremos em breve.",
        authorType: "admin",
        authorName: "Suporte AgencyHub",
        createdAt: new Date("2026-01-03T09:15:00"),
      },
    ],
  },
  {
    id: "t3",
    title: "Erro ao adicionar novo cliente",
    description: "Quando tento adicionar um novo cliente, o formulário não salva e retorna erro 500.",
    status: "resolved",
    priority: "urgent",
    userType: "agency_owner",
    userId: "user-2",
    userName: "Maria Santos",
    userEmail: "maria@creatix.com",
    agencyName: "Creatix Marketing",
    createdAt: new Date("2026-01-01T16:45:00"),
    updatedAt: new Date("2026-01-02T11:30:00"),
    assignedTo: "Dev Team",
    responses: [
      {
        id: "r2",
        ticketId: "t3",
        message: "Identificamos o problema. Era um bug no sistema que já foi corrigido. Por favor, tente novamente.",
        authorType: "admin",
        authorName: "Equipe de Desenvolvimento",
        createdAt: new Date("2026-01-02T11:30:00"),
      },
      {
        id: "r3",
        ticketId: "t3",
        message: "Testei agora e está funcionando perfeitamente! Obrigada pela rápida resolução.",
        authorType: "user",
        authorName: "Maria Santos",
        createdAt: new Date("2026-01-02T14:00:00"),
      },
    ],
  },
  {
    id: "t4",
    title: "Solicitação de upgrade de plano",
    description: "Gostaria de fazer upgrade do plano Básico para o plano Profissional. Como proceder?",
    status: "closed",
    priority: "low",
    userType: "agency_owner",
    userId: "user-3",
    userName: "Pedro Costa",
    userEmail: "pedro@growthagency.com",
    agencyName: "Growth Agency",
    createdAt: new Date("2025-12-28T11:00:00"),
    updatedAt: new Date("2025-12-29T10:00:00"),
    assignedTo: "Vendas",
    responses: [
      {
        id: "r4",
        ticketId: "t4",
        message:
          "Olá Pedro! Já processamos seu upgrade. Você já pode aproveitar todos os recursos do plano Profissional.",
        authorType: "admin",
        authorName: "Equipe de Vendas",
        createdAt: new Date("2025-12-29T10:00:00"),
      },
    ],
  },
  {
    id: "t5",
    title: "Campanhas não aparecem no relatório",
    description: "As campanhas que criei ontem não estão aparecendo no relatório mensal. Isso é normal?",
    status: "open",
    priority: "medium",
    userType: "client",
    userId: "c2",
    userName: "Fashion Boutique",
    userEmail: "marketing@fashion.com",
    agencyName: "Agência Digital Pro",
    createdAt: new Date("2026-01-04T08:00:00"),
    updatedAt: new Date("2026-01-04T08:00:00"),
    responses: [],
  },
  {
    id: "t6",
    title: "Integração com Google Analytics",
    description: "Como faço para integrar minha conta do Google Analytics com a plataforma?",
    status: "in_progress",
    priority: "low",
    userType: "agency_owner",
    userId: "user-1",
    userName: "João Silva",
    userEmail: "joao@agenciadigital.com",
    agencyName: "Agência Digital Pro",
    createdAt: new Date("2026-01-03T15:30:00"),
    updatedAt: new Date("2026-01-04T09:00:00"),
    assignedTo: "Suporte Técnico",
    responses: [
      {
        id: "r5",
        ticketId: "t6",
        message: "Vou te enviar o passo a passo para integração. Aguarde alguns minutos.",
        authorType: "admin",
        authorName: "Suporte AgencyHub",
        createdAt: new Date("2026-01-04T09:00:00"),
      },
    ],
  },
]

export function getClientsByAgency(agencyId: string): Client[] {
  return mockClients.filter((c) => c.agencyId === agencyId)
}

export function getCampaignsByAgency(agencyId: string): Campaign[] {
  return mockCampaigns.filter((c) => c.agencyId === agencyId)
}

export function getProjectsByAgency(agencyId: string): Project[] {
  return mockProjects.filter((p) => p.agencyId === agencyId)
}

export function getClientById(clientId: string): Client | undefined {
  return mockClients.find((c) => c.id === clientId)
}

export function getTicketsByStatus(status?: string): Ticket[] {
  if (!status || status === "all") return mockTickets
  return mockTickets.filter((t) => t.status === status)
}

export function getTicketsByUserType(userType?: string): Ticket[] {
  if (!userType || userType === "all") return mockTickets
  return mockTickets.filter((t) => t.userType === userType)
}

export function getTicketById(ticketId: string): Ticket | undefined {
  return mockTickets.find((t) => t.id === ticketId)
}

export function getCampaignCommentsByCampaign(campaignId: string): CampaignComment[] {
  return mockCampaignComments.filter((cc) => cc.campaignId === campaignId)
}

export function getLeadsByAgency(agencyId: string): Lead[] {
  return mockLeads.filter((l) => l.agencyId === agencyId)
}

export function getOpportunitiesByAgency(agencyId: string): Opportunity[] {
  return mockOpportunities.filter((o) => o.agencyId === agencyId)
}

export function getKanbanCardsByAgency(agencyId: string): KanbanCard[] {
  return mockKanbanCards.filter((k) => k.agencyId === agencyId)
}

export function getTransactionsByAgency(agencyId: string): FinancialTransaction[] {
  return mockTransactions.filter((t) => t.agencyId === agencyId)
}

export function getInvoicesByAgency(agencyId: string): Invoice[] {
  return mockInvoices.filter((i) => i.agencyId === agencyId)
}

export function getGoalsByAgency(agencyId: string): Goal[] {
  return mockGoals.filter((g) => g.agencyId === agencyId)
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "manager" | "analyst" | "designer"
  agencyId: string
  permissions: {
    dashboard: boolean
    clients: boolean
    crm: boolean
    campaigns: boolean
    projects: boolean
    kanban: boolean
    financial: boolean
    goals: boolean
    reports: boolean
    support: boolean
    documents: boolean
    users: boolean
    settings: boolean
  }
  status: "active" | "inactive"
  createdAt: Date
  lastLogin?: Date
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: "tm1",
    name: "João Silva",
    email: "joao@agenciadigital.com",
    role: "owner",
    agencyId: "agency-1",
    permissions: {
      dashboard: true,
      clients: true,
      crm: true,
      campaigns: true,
      projects: true,
      kanban: true,
      financial: true,
      goals: true,
      reports: true,
      support: true,
      documents: true,
      users: true,
      settings: true,
    },
    status: "active",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date("2026-01-05T09:30:00"),
  },
  {
    id: "tm2",
    name: "Maria Santos",
    email: "maria@agenciadigital.com",
    role: "manager",
    agencyId: "agency-1",
    permissions: {
      dashboard: true,
      clients: true,
      crm: true,
      campaigns: true,
      projects: true,
      kanban: true,
      financial: false,
      goals: true,
      reports: true,
      support: true,
      documents: true,
      users: false,
      settings: false,
    },
    status: "active",
    createdAt: new Date("2024-03-20"),
    lastLogin: new Date("2026-01-05T08:15:00"),
  },
  {
    id: "tm3",
    name: "Pedro Costa",
    email: "pedro@agenciadigital.com",
    role: "analyst",
    agencyId: "agency-1",
    permissions: {
      dashboard: true,
      clients: false,
      crm: false,
      campaigns: true,
      projects: false,
      kanban: false,
      financial: false,
      goals: false,
      reports: true,
      support: false,
      documents: true,
      users: false,
      settings: false,
    },
    status: "active",
    createdAt: new Date("2024-06-10"),
    lastLogin: new Date("2026-01-04T16:45:00"),
  },
  {
    id: "tm4",
    name: "Ana Oliveira",
    email: "ana@agenciadigital.com",
    role: "designer",
    agencyId: "agency-1",
    permissions: {
      dashboard: true,
      clients: false,
      crm: false,
      campaigns: true,
      projects: true,
      kanban: true,
      financial: false,
      goals: false,
      reports: false,
      support: false,
      documents: true,
      users: false,
      settings: false,
    },
    status: "active",
    createdAt: new Date("2024-08-05"),
    lastLogin: new Date("2026-01-05T10:00:00"),
  },
  {
    id: "tm5",
    name: "Carlos Ferreira",
    email: "carlos@agenciadigital.com",
    role: "admin",
    agencyId: "agency-1",
    permissions: {
      dashboard: true,
      clients: true,
      crm: true,
      campaigns: true,
      projects: true,
      kanban: true,
      financial: true,
      goals: true,
      reports: true,
      support: true,
      documents: true,
      users: true,
      settings: true,
    },
    status: "active",
    createdAt: new Date("2024-02-01"),
    lastLogin: new Date("2026-01-05T07:20:00"),
  },
]

export const mockAgencyTeam = mockTeamMembers

export interface SmartInsight {
  id: string
  type: "metric" | "report" | "event" | "alert"
  title: string
  description: string
  link: string
  createdAt: Date
  clientId: string
}

export interface CampaignComment {
  id: string
  campaignId: string
  content: string
  userId: string
  userName: string
  userRole: "agency" | "client"
  createdAt: Date
}

export interface CampaignAdjustmentRequest {
  id: string
  campaignId: string
  requestType: "budget" | "targeting" | "creative" | "other"
  description: string
  status: "pending" | "in_progress" | "completed" | "rejected"
  createdAt: Date
  clientId: string
}

export interface ReportComment {
  id: string
  reportId: string
  content: string
  userId: string
  userName: string
  userRole: "agency" | "client"
  createdAt: Date
}

export interface ClientReport {
  id: string
  title: string
  period: string
  type: "monthly" | "weekly" | "quarterly"
  status: "pending" | "approved" | "needs_adjustment"
  createdAt: Date
  clientId: string
  agencySummary: {
    whatWorked: string
    whatDidntWork: string
    nextSteps: string
  }
  pdfUrl: string
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    roi: number
    spent: number
  }
}

export interface ClientEvent {
  id: string
  title: string
  type: "meeting" | "delivery" | "report" | "renewal" | "other"
  startDate: Date
  endDate: Date
  description: string
  status: "pending" | "confirmed" | "cancelled"
  clientId: string
  agencyId: string
  meetingLink?: string
  participants: Array<{
    name: string
    email: string
    role: "agency" | "client"
    confirmationStatus: "pending" | "confirmed" | "declined"
  }>
}

export interface ClientTicket {
  id: string
  title: string
  type: "campaign" | "report" | "financial" | "meeting" | "other"
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_progress" | "resolved" | "closed"
  sla: number // hours
  linkedEntityType?: "campaign" | "report"
  linkedEntityId?: string
  createdAt: Date
  updatedAt: Date
  clientId: string
  messages: Array<{
    id: string
    content: string
    authorName: string
    authorRole: "agency" | "client"
    createdAt: Date
  }>
}

export const mockSmartInsights: SmartInsight[] = [
  {
    id: "si1",
    type: "metric",
    title: "Taxa de conversão subiu 0.5%",
    description: "Sua taxa de conversão aumentou 0.5% neste mês comparado ao anterior",
    link: "/client/reports",
    createdAt: new Date("2026-01-05T10:00:00"),
    clientId: "c1",
  },
  {
    id: "si2",
    type: "report",
    title: "Novo relatório disponível",
    description: "Relatório mensal de Janeiro 2026 está pronto para visualização",
    link: "/client/reports",
    createdAt: new Date("2026-01-04T15:30:00"),
    clientId: "c1",
  },
  {
    id: "si3",
    type: "event",
    title: "Reunião estratégica em 3 dias",
    description: "Reunião de planejamento Q2 agendada para 09/01/2026",
    link: "/client/calendar",
    createdAt: new Date("2026-01-06T09:00:00"),
    clientId: "c1",
  },
  {
    id: "si4",
    type: "alert",
    title: "Orçamento da campanha atingiu 80%",
    description: "A campanha 'Lançamento Produto Q1' já utilizou 80% do orçamento",
    link: "/client/campaigns",
    createdAt: new Date("2026-01-03T14:00:00"),
    clientId: "c1",
  },
]

export const mockClientReports: ClientReport[] = [
  {
    id: "cr1",
    title: "Relatório Mensal - Janeiro 2026",
    period: "Janeiro 2026",
    type: "monthly",
    status: "pending",
    createdAt: new Date("2026-01-04T10:00:00"),
    clientId: "c1",
    agencySummary: {
      whatWorked:
        "As campanhas de Google Ads apresentaram excelente performance com aumento de 25% nas conversões. O novo criativo de vídeo teve engajamento acima da média.",
      whatDidntWork:
        "As campanhas de display tiveram CTR abaixo do esperado. Precisamos revisar o público-alvo e os criativos para próximo mês.",
      nextSteps:
        "1. Otimizar segmentação de display\n2. Testar novos formatos de anúncio\n3. Aumentar investimento em campanhas de busca\n4. Implementar remarketing mais agressivo",
    },
    pdfUrl: "/reports/janeiro-2026.pdf",
    metrics: {
      impressions: 187500,
      clicks: 7125,
      conversions: 428,
      roi: 285,
      spent: 8500,
    },
  },
  {
    id: "cr2",
    title: "Relatório Semanal - Semana 1",
    period: "01-07 Jan 2026",
    type: "weekly",
    status: "approved",
    createdAt: new Date("2026-01-02T16:00:00"),
    clientId: "c1",
    agencySummary: {
      whatWorked: "Excelente início de ano com performance acima das expectativas em todas as métricas principais.",
      whatDidntWork: "Nenhum ponto de atenção significativo nesta semana.",
      nextSteps: "Manter estratégia atual e monitorar de perto as métricas.",
    },
    pdfUrl: "/reports/semana-1-2026.pdf",
    metrics: {
      impressions: 45000,
      clicks: 1800,
      conversions: 98,
      roi: 312,
      spent: 2100,
    },
  },
]

export const mockClientEvents: ClientEvent[] = [
  {
    id: "ce1",
    title: "Reunião de Planejamento Q2",
    type: "meeting",
    startDate: new Date("2026-01-09T14:00:00"),
    endDate: new Date("2026-01-09T15:30:00"),
    description: "Revisar estratégias do primeiro trimestre e planejar ações para Q2",
    status: "pending",
    clientId: "c1",
    agencyId: "agency-1",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    participants: [
      { name: "João Silva", email: "joao@agency.com", role: "agency", confirmationStatus: "confirmed" },
      { name: "Maria Santos", email: "maria@agency.com", role: "agency", confirmationStatus: "confirmed" },
      { name: "TechStart Team", email: "contato@techstart.com", role: "client", confirmationStatus: "pending" },
    ],
  },
  {
    id: "ce2",
    title: "Entrega de Criativos",
    type: "delivery",
    startDate: new Date("2026-01-12T10:00:00"),
    endDate: new Date("2026-01-12T10:30:00"),
    description: "Apresentação dos novos criativos para campanha de Q1",
    status: "confirmed",
    clientId: "c1",
    agencyId: "agency-1",
    participants: [
      { name: "Ana Designer", email: "ana@agency.com", role: "agency", confirmationStatus: "confirmed" },
      { name: "TechStart Team", email: "contato@techstart.com", role: "client", confirmationStatus: "confirmed" },
    ],
  },
  {
    id: "ce3",
    title: "Renovação de Contrato",
    type: "renewal",
    startDate: new Date("2026-01-31T09:00:00"),
    endDate: new Date("2026-01-31T10:00:00"),
    description: "Discussão sobre renovação do contrato anual",
    status: "pending",
    clientId: "c1",
    agencyId: "agency-1",
    participants: [
      { name: "João Silva", email: "joao@agency.com", role: "agency", confirmationStatus: "pending" },
      { name: "TechStart Team", email: "contato@techstart.com", role: "client", confirmationStatus: "pending" },
    ],
  },
]

export const mockClientTickets: ClientTicket[] = [
  {
    id: "ct1",
    title: "Ajuste na segmentação da campanha",
    type: "campaign",
    description: "Gostaria de ajustar o público-alvo da campanha para incluir faixa etária 35-45",
    priority: "medium",
    status: "in_progress",
    sla: 24,
    linkedEntityType: "campaign",
    linkedEntityId: "cam1",
    createdAt: new Date("2026-01-04T09:00:00"),
    updatedAt: new Date("2026-01-04T15:30:00"),
    clientId: "c1",
    messages: [
      {
        id: "m1",
        content: "Gostaria de ajustar o público-alvo da campanha para incluir faixa etária 35-45",
        authorName: "TechStart Team",
        authorRole: "client",
        createdAt: new Date("2026-01-04T09:00:00"),
      },
      {
        id: "m2",
        content: "Recebido! Estamos fazendo a análise e implementaremos o ajuste ainda hoje.",
        authorName: "João Silva",
        authorRole: "agency",
        createdAt: new Date("2026-01-04T15:30:00"),
      },
    ],
  },
  {
    id: "ct2",
    title: "Dúvida sobre fatura",
    type: "financial",
    description: "Não recebi a fatura do mês de janeiro ainda",
    priority: "low",
    status: "resolved",
    sla: 48,
    createdAt: new Date("2026-01-03T10:00:00"),
    updatedAt: new Date("2026-01-03T16:00:00"),
    clientId: "c1",
    messages: [
      {
        id: "m3",
        content: "Não recebi a fatura do mês de janeiro ainda",
        authorName: "TechStart Team",
        authorRole: "client",
        createdAt: new Date("2026-01-03T10:00:00"),
      },
      {
        id: "m4",
        content: "A fatura foi enviada para o email financeiro@techstart.com. Pode verificar?",
        authorName: "Maria Santos",
        authorRole: "agency",
        createdAt: new Date("2026-01-03T16:00:00"),
      },
    ],
  },
]

export function getSmartInsightsByClient(clientId: string): SmartInsight[] {
  return mockSmartInsights.filter((si) => si.clientId === clientId)
}

export function getClientReportsByClient(clientId: string): ClientReport[] {
  return mockClientReports.filter((cr) => cr.clientId === clientId)
}

export function getClientEventsByClient(clientId: string): ClientEvent[] {
  return mockClientEvents.filter((ce) => ce.clientId === clientId)
}

export function getClientTicketsByClient(clientId: string): ClientTicket[] {
  return mockClientTickets.filter((ct) => ct.clientId === clientId)
}
