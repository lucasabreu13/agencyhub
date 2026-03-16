"use client"
import { formatDate } from "@/lib/utils"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Clock, CheckCircle2, XCircle, AlertCircle, MessageSquare } from "lucide-react"

interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: Date
  responses: number
}

export default function AgencySupportPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock data de tickets da agência
  const [tickets] = useState<Ticket[]>([
    {
      id: "t1",
      title: "Problema com exportação de relatórios",
      description: "Não consigo exportar relatórios em PDF",
      status: "open",
      priority: "high",
      createdAt: new Date("2026-01-04T10:00:00"),
      responses: 0,
    },
    {
      id: "t2",
      title: "Dúvida sobre integração Google Ads",
      description: "Como integrar minha conta do Google Ads?",
      status: "in_progress",
      priority: "medium",
      createdAt: new Date("2026-01-03T14:30:00"),
      responses: 2,
    },
    {
      id: "t3",
      title: "Erro ao adicionar novo projeto",
      description: "Sistema retorna erro 500 ao criar projeto",
      status: "resolved",
      priority: "urgent",
      createdAt: new Date("2026-01-02T09:15:00"),
      responses: 4,
    },
  ])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>
  }

  if (!user || user.role !== "agency_owner") {
    return null
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      open: { label: "Aberto", className: "bg-blue-500" },
      in_progress: { label: "Em Progresso", className: "bg-yellow-500" },
      resolved: { label: "Resolvido", className: "bg-green-500" },
      closed: { label: "Fechado", className: "bg-gray-500" },
    }
    const variant = variants[status as keyof typeof variants]
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: { label: "Baixa", className: "bg-gray-500" },
      medium: { label: "Média", className: "bg-blue-500" },
      high: { label: "Alta", className: "bg-orange-500" },
      urgent: { label: "Urgente", className: "bg-red-500" },
    }
    const variant = variants[priority as keyof typeof variants]
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "in_progress":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "closed":
        return <XCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredTickets = filterStatus === "all" ? tickets : tickets.filter((t) => t.status === filterStatus)

  const stats = [
    { label: "Tickets Abertos", value: tickets.filter((t) => t.status === "open").length, icon: Clock },
    { label: "Em Progresso", value: tickets.filter((t) => t.status === "in_progress").length, icon: AlertCircle },
    { label: "Resolvidos", value: tickets.filter((t) => t.status === "resolved").length, icon: CheckCircle2 },
    { label: "Total de Tickets", value: tickets.length, icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyHeader user={user} title="Suporte" />

        <div className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Suporte</h1>
                <p className="text-muted-foreground">Abra chamados e acompanhe o atendimento</p>
              </div>

              <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Chamado
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Abrir Novo Chamado</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input id="title" placeholder="Descreva o problema brevemente" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva o problema em detalhes..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowNewTicket(false)}>
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault()
                          setShowNewTicket(false)
                        }}
                      >
                        Abrir Chamado
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Meus Chamados</CardTitle>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="open">Aberto</SelectItem>
                      <SelectItem value="in_progress">Em Progresso</SelectItem>
                      <SelectItem value="resolved">Resolvido</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTickets.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">Nenhum chamado encontrado</p>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <Dialog key={ticket.id}>
                        <DialogTrigger asChild>
                          <div className="flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                            <div className="mt-1">{getStatusIcon(ticket.status)}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">{ticket.title}</h3>
                                  <p className="text-sm text-muted-foreground">{ticket.description}</p>
                                </div>
                                <div className="flex gap-2">
                                  {getStatusBadge(ticket.status)}
                                  {getPriorityBadge(ticket.priority)}
                                </div>
                              </div>
                              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Criado em {ticket.formatDate(createdAt)}</span>
                                <span>{ticket.responses} respostas</span>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{ticket.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex gap-2">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                            </div>
                            <div>
                              <h4 className="mb-2 font-semibold">Descrição</h4>
                              <p className="text-sm text-muted-foreground">{ticket.description}</p>
                            </div>
                            <div>
                              <h4 className="mb-2 font-semibold">Histórico</h4>
                              <div className="space-y-2 rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                  Aguardando resposta da equipe de suporte...
                                </p>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="response">Adicionar Resposta</Label>
                              <Textarea id="response" placeholder="Digite sua mensagem..." rows={3} className="mt-2" />
                              <Button className="mt-2">Enviar Resposta</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
