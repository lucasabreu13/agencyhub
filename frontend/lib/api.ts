// Camada de integração com o backend AgencyHub
// Todas as chamadas de API passam por aqui

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

// ─── Token storage ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export function setToken(token: string): void {
  localStorage.setItem("access_token", token)
}

export function removeToken(): void {
  localStorage.removeItem("access_token")
}

// ─── HTTP client base ─────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    removeToken()
    window.location.href = "/login"
    throw new Error("Sessão expirada")
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message || `Erro ${res.status}`)
  }

  // 204 No Content
  if (res.status === 204) return {} as T

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}

// ─── Tipos de resposta paginada ───────────────────────────────────────────────

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string; user: ApiUser }>("/auth/login", { email, password }),

  me: () => api.get<ApiUser>("/auth/me"),

  logout: () => api.post<void>("/auth/logout", {}),
}

// ─── Tipos de usuário da API ──────────────────────────────────────────────────

export interface ApiUser {
  id: string
  email: string
  name: string
  role: "admin" | "agency_owner" | "agency_client"
  agencyId?: string
  isActive: boolean
  createdAt: string
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get("/admin/dashboard"),

  // Agências
  getAgencies: (params?: string) => api.get<Paginated<any>>(`/admin/agencies${params ? `?${params}` : ""}`),
  getAgency: (id: string) => api.get<any>(`/admin/agencies/${id}`),
  createAgency: (data: any) => api.post<any>("/admin/agencies", data),
  updateAgency: (id: string, data: any) => api.patch<any>(`/admin/agencies/${id}`, data),
  deleteAgency: (id: string) => api.delete(`/admin/agencies/${id}`),
  getAgencyStats: (id: string) => api.get<any>(`/admin/agencies/${id}/stats`),

  // Usuários
  getUsers: (params?: string) => api.get<Paginated<any>>(`/admin/users${params ? `?${params}` : ""}`),
  createUser: (data: any) => api.post<any>("/admin/users", data),
  updateUser: (id: string, data: any) => api.patch<any>(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  toggleUser: (id: string) => api.patch(`/admin/users/${id}/toggle-active`, {}),
  changeUserPassword: (id: string, data: any) => api.patch(`/admin/users/${id}/password`, data),

  // Tickets
  getTickets: (params?: string) => api.get<Paginated<any>>(`/admin/tickets${params ? `?${params}` : ""}`),
  getTicket: (id: string) => api.get<any>(`/admin/tickets/${id}`),
  createTicket: (data: any) => api.post<any>("/admin/tickets", data),
  updateTicket: (id: string, data: any) => api.patch<any>(`/admin/tickets/${id}`, data),
  addTicketMessage: (id: string, data: any) => api.post(`/admin/tickets/${id}/messages`, data),
  deleteTicket: (id: string) => api.delete(`/admin/tickets/${id}`),

  // Receita
  getRevenue: (params?: string) => api.get<any>(`/admin/revenue${params ? `?${params}` : ""}`),
  createRevenue: (data: any) => api.post<any>("/admin/revenue", data),
  updateRevenue: (id: string, data: any) => api.patch<any>(`/admin/revenue/${id}`, data),
  deleteRevenue: (id: string) => api.delete(`/admin/revenue/${id}`),

  // Metas
  getGoals: (params?: string) => api.get<Paginated<any>>(`/admin/goals${params ? `?${params}` : ""}`),
  createGoal: (data: any) => api.post<any>("/admin/goals", data),
  updateGoal: (id: string, data: any) => api.patch<any>(`/admin/goals/${id}`, data),
  updateGoalProgress: (id: string, data: any) => api.patch(`/admin/goals/${id}/progress`, data),
  deleteGoal: (id: string) => api.delete(`/admin/goals/${id}`),

  // Lembretes
  getReminders: () => api.get<Paginated<any>>("/admin/reminders"),
  createReminder: (data: any) => api.post<any>("/admin/reminders", data),
  updateReminder: (id: string, data: any) => api.patch<any>(`/admin/reminders/${id}`, data),
  toggleReminder: (id: string) => api.patch(`/admin/reminders/${id}/toggle`, {}),
  deleteReminder: (id: string) => api.delete(`/admin/reminders/${id}`),

  // Auditoria
  getAudit: (params?: string) => api.get<Paginated<any>>(`/admin/audit${params ? `?${params}` : ""}`),
}

// ─── Agency ───────────────────────────────────────────────────────────────────

export const agencyApi = {
  // Dashboard
  getDashboard: () => api.get("/agency/page"),

  // Clientes
  getClients: (params?: string) => api.get<Paginated<any>>(`/agency/clients${params ? `?${params}` : ""}`),
  getClient: (id: string) => api.get<any>(`/agency/clients/${id}`),
  createClient: (data: any) => api.post<any>("/agency/clients", data),
  updateClient: (id: string, data: any) => api.patch<any>(`/agency/clients/${id}`, data),
  deleteClient: (id: string) => api.delete(`/agency/clients/${id}`),

  // Campanhas
  getCampaigns: (params?: string) => api.get<Paginated<any>>(`/agency/campaigns${params ? `?${params}` : ""}`),
  getCampaign: (id: string) => api.get<any>(`/agency/campaigns/${id}`),
  createCampaign: (data: any) => api.post<any>("/agency/campaigns", data),
  updateCampaign: (id: string, data: any) => api.patch<any>(`/agency/campaigns/${id}`, data),
  updateCampaignMetrics: (id: string, data: any) => api.patch(`/agency/campaigns/${id}/metrics`, data),
  deleteCampaign: (id: string) => api.delete(`/agency/campaigns/${id}`),

  // CRM
  getCrm: (params?: string) => api.get<Paginated<any>>(`/agency/crm${params ? `?${params}` : ""}`),
  getCrmBoard: () => api.get<any>("/agency/crm/board"),
  createContact: (data: any) => api.post<any>("/agency/crm", data),
  updateContact: (id: string, data: any) => api.patch<any>(`/agency/crm/${id}`, data),
  moveContactStage: (id: string, data: any) => api.patch(`/agency/crm/${id}/stage`, data),
  deleteContact: (id: string) => api.delete(`/agency/crm/${id}`),

  // Projetos
  getProjects: (params?: string) => api.get<Paginated<any>>(`/agency/projects${params ? `?${params}` : ""}`),
  createProject: (data: any) => api.post<any>("/agency/projects", data),
  updateProject: (id: string, data: any) => api.patch<any>(`/agency/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/agency/projects/${id}`),

  // Kanban
  getKanbanBoard: () => api.get<any>("/agency/kanban/board"),
  getKanbanTasks: (params?: string) => api.get<any>(`/agency/kanban/tasks${params ? `?${params}` : ""}`),
  createTask: (data: any) => api.post<any>("/agency/kanban/tasks", data),
  updateTask: (id: string, data: any) => api.patch<any>(`/agency/kanban/tasks/${id}`, data),
  moveTask: (id: string, data: any) => api.patch(`/agency/kanban/tasks/${id}/move`, data),
  deleteTask: (id: string) => api.delete(`/agency/kanban/tasks/${id}`),

  // Calendário
  getEvents: (params?: string) => api.get<Paginated<any>>(`/agency/calendar${params ? `?${params}` : ""}`),
  createEvent: (data: any) => api.post<any>("/agency/calendar", data),
  updateEvent: (id: string, data: any) => api.patch<any>(`/agency/calendar/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/agency/calendar/${id}`),

  // Relatórios
  getReports: (params?: string) => api.get<Paginated<any>>(`/agency/reports${params ? `?${params}` : ""}`),
  getReport: (id: string) => api.get<any>(`/agency/reports/${id}`),
  createReport: (data: any) => api.post<any>("/agency/reports", data),
  updateReport: (id: string, data: any) => api.patch<any>(`/agency/reports/${id}`, data),
  approveReport: (id: string) => api.patch(`/agency/reports/${id}/approve`, {}),
  requestAdjustment: (id: string) => api.patch(`/agency/reports/${id}/request-adjustment`, {}),
  deleteReport: (id: string) => api.delete(`/agency/reports/${id}`),

  // Faturas
  getInvoices: (params?: string) => api.get<Paginated<any>>(`/agency/invoices${params ? `?${params}` : ""}`),
  getInvoice: (id: string) => api.get<any>(`/agency/invoices/${id}`),
  createInvoice: (data: any) => api.post<any>("/agency/invoices", data),
  updateInvoice: (id: string, data: any) => api.patch<any>(`/agency/invoices/${id}`, data),
  payInvoice: (id: string, data: any) => api.patch(`/agency/invoices/${id}/pay`, data),
  cancelInvoice: (id: string) => api.patch(`/agency/invoices/${id}/cancel`, {}),
  deleteInvoice: (id: string) => api.delete(`/agency/invoices/${id}`),

  // Documentos
  getDocuments: (params?: string) => api.get<Paginated<any>>(`/agency/documents${params ? `?${params}` : ""}`),
  createDocument: (data: any) => api.post<any>("/agency/documents", data),
  updateDocument: (id: string, data: any) => api.patch<any>(`/agency/documents/${id}`, data),
  deleteDocument: (id: string) => api.delete(`/agency/documents/${id}`),

  // Chat
  getConversations: () => api.get<any>("/agency/chat/conversations"),
  getMessages: (clientId: string) => api.get<any>(`/agency/chat/messages/${clientId}`),
  sendMessage: (data: any) => api.post<any>("/agency/chat/messages", data),
  markMessagesRead: (clientId: string) => api.patch(`/agency/chat/messages/${clientId}/read`, {}),

  // Suporte
  getSupportTickets: (params?: string) => api.get<Paginated<any>>(`/agency/support${params ? `?${params}` : ""}`),
  createSupportTicket: (data: any) => api.post<any>("/agency/support", data),
  updateSupportTicket: (id: string, data: any) => api.patch<any>(`/agency/support/${id}`, data),
  addSupportMessage: (id: string, data: any) => api.post(`/agency/support/${id}/messages`, data),

  // Metas
  getGoals: (params?: string) => api.get<Paginated<any>>(`/agency/goals${params ? `?${params}` : ""}`),
  createGoal: (data: any) => api.post<any>("/agency/goals", data),
  updateGoal: (id: string, data: any) => api.patch<any>(`/agency/goals/${id}`, data),
  updateGoalProgress: (id: string, data: any) => api.patch(`/agency/goals/${id}/progress`, data),
  deleteGoal: (id: string) => api.delete(`/agency/goals/${id}`),

  // Financeiro
  getFinancial: (params?: string) => api.get<any>(`/agency/financial${params ? `?${params}` : ""}`),
  createTransaction: (data: any) => api.post<any>("/agency/financial", data),
  updateTransaction: (id: string, data: any) => api.patch<any>(`/agency/financial/${id}`, data),
  deleteTransaction: (id: string) => api.delete(`/agency/financial/${id}`),

  // Usuários da agência
  getUsers: () => api.get<Paginated<any>>("/agency/users"),
  inviteUser: (data: any) => api.post<any>("/agency/users/invite", data),
  toggleUser: (id: string) => api.patch(`/agency/users/${id}/toggle-active`, {}),
  deleteUser: (id: string) => api.delete(`/agency/users/${id}`),

  // Configurações
  getProfile: () => api.get<any>("/agency/settings/agency"),
  updateProfile: (data: any) => api.patch<any>("/agency/settings/agency", data),
  getMyProfile: () => api.get<any>("/agency/settings/me"),
  updateMyProfile: (data: any) => api.patch<any>("/agency/settings/me", data),
  changePassword: (data: any) => api.patch("/agency/settings/me/password", data),
}

// ─── Client ───────────────────────────────────────────────────────────────────

export const clientApi = {
  getDashboard: () => api.get("/client"),
  getCampaigns: (params?: string) => api.get<Paginated<any>>(`/client/campaigns${params ? `?${params}` : ""}`),
  getReports: (params?: string) => api.get<Paginated<any>>(`/client/reports${params ? `?${params}` : ""}`),
  approveReport: (id: string) => api.patch(`/client/reports/${id}/approve`, {}),
  requestAdjustment: (id: string) => api.patch(`/client/reports/${id}/request-adjustment`, {}),
  getDocuments: (params?: string) => api.get<Paginated<any>>(`/client/documents${params ? `?${params}` : ""}`),
  getFinancial: (params?: string) => api.get<any>(`/client/financial${params ? `?${params}` : ""}`),
  getSupportTickets: (params?: string) => api.get<Paginated<any>>(`/client/support${params ? `?${params}` : ""}`),
  createSupportTicket: (data: any) => api.post<any>("/client/support", data),
  addSupportMessage: (id: string, data: any) => api.post(`/client/support/${id}/messages`, data),
  getMessages: () => api.get<any>("/client/messages"),
  sendMessage: (data: any) => api.post<any>("/client/messages", data),
  markMessagesRead: () => api.patch("/client/messages/read", {}),
}
