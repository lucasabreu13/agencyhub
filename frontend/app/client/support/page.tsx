"use client"
import { formatDate } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { clientApi } from "@/lib/api"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HeadphonesIcon, Plus, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type TicketStatus = "open" | "in_progress" | "resolved"
type TicketPriority = "low" | "medium" | "high"

type Ticket = {
  id: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: Date
  updatedAt: Date
  responses: {
    id: string
    message: string
    author: string
    createdAt: Date
    isAdmin: boolean
  }[]
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    subject: "Dúvida sobre relatório de performance",
    description: "Gostaria de entender melhor as métricas apresentadas no último relatório",
    status: "resolved",
    priority: "low",
    createdAt: new Date(2025, 0, 2),
    updatedAt: new Date(2025, 0, 3),
    responses: [
      {
        id: "r1",
        message: "Olá! Claro, ficarei feliz em explicar. Quais métricas específicas você tem dúvida?",
        author: "Suporte AgencyHub",
        createdAt: new Date(2025, 0, 2, 14, 30),
        isAdmin: true,
      },
      {
        id: "r2",
        message: "Principalmente sobre CTR e taxa de conversão.",
        author: "Você",
        createdAt: new Date(2025, 0, 2, 15, 0),
        isAdmin: false,
      },
      {
        id: "r3",
        message:
          "CTR (Click-Through Rate) é a porcentagem de pessoas que clicaram no seu anúncio. Taxa de conversão é quantas dessas pessoas realizaram a ação desejada. Preparei um documento explicativo que será enviado por email.",
        author: "Suporte AgencyHub",
        createdAt: new Date(2025, 0, 3, 10, 0),
        isAdmin: true,
      },
    ],
  },
  {
    id: "2",
    subject: "Solicitação de ajuste na campanha",
    description: "Preciso ajustar o orçamento da campanha de Google Ads",
    status: "in_progress",
    priority: "medium",
    createdAt: new Date(2025, 0, 4),
    updatedAt: new Date(2025, 0, 4),
    responses: [
      {
        id: "r4",
        message: "Recebemos sua solicitação. Para qual valor você gostaria de ajustar?",
        author: "Suporte AgencyHub",
        createdAt: new Date(2025, 0, 4, 11, 0),
        isAdmin: true,
      },
    ],
  },
]

export default function ClientSupportPage() {
  const { user, loading, logout } = useAuth("agency_client")
  const { data: ticketsData, refetch: refetchTickets } = useApi(() => clientApi.getSupportTickets())
  const tickets = ticketsData?.data || []
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium" as TicketPriority,
  })

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await clientApi.createSupportTicket({
        title: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority,
        type: "support",
      })
      refetchTickets()
      setNewTicket({ subject: "", description: "", priority: "medium" })
      setIsDialogOpen(false)
    } catch (err: any) {
      alert(err?.message || "Erro ao criar ticket")
    }
  }

  const getStatusBadge = (status: TicketStatus) => {
    const variants = {
      open: { label: "Aberto", icon: AlertCircle, className: "bg-blue-100 text-blue-700" },
      in_progress: { label: "Em Progresso", icon: Clock, className: "bg-yellow-100 text-yellow-700" },
      resolved: { label: "Resolvido", icon: CheckCircle2, className: "bg-green-100 text-green-700" },
    }
    const variant = variants[status]
    const Icon = variant.icon

    return (
      <Badge className={variant.className} variant="secondary">
        <Icon className="h-3 w-3 mr-1" />
        {variant.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: TicketPriority) => {
    const variants = {
      low: { label: "Baixa", className: "bg-gray-100 text-gray-700" },
      medium: { label: "Média", className: "bg-orange-100 text-orange-700" },
      high: { label: "Alta", className: "bg-red-100 text-red-700" },
    }
    return (
      <Badge className={variants[priority].className} variant="secondary">
        {variants[priority].label}
      </Badge>
    )
  }

  const openTickets = tickets.filter((t) => t.status === "open").length
  const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <ClientHeader user={user} title="Suporte" />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Central de Suporte</h2>
              <p className="text-muted-foreground mt-1">Abra chamados e acompanhe suas solicitações</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Chamado
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Abrir Novo Chamado</DialogTitle>
                  <DialogDescription>
                    Descreva sua solicitação ou problema e nossa equipe entrará em contato
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      placeholder="Descreva brevemente sua solicitação"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Forneça mais detalhes sobre sua solicitação"
                      rows={5}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value: TicketPriority) => setNewTicket({ ...newTicket, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Criar Chamado</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tickets.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Abertos</CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{openTickets}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{inProgressTickets}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{resolvedTickets}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle>Seus Chamados</CardTitle>
              <CardDescription>Acompanhe o status das suas solicitações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <HeadphonesIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum chamado aberto</p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Abrir Primeiro Chamado
                    </Button>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{ticket.subject}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{ticket.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                          <span className="text-xs text-muted-foreground">
                            Criado em {ticket.formatDate(createdAt)}
                          </span>
                          {ticket.responses.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              {ticket.responses.length} {ticket.responses.length === 1 ? "resposta" : "respostas"}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Detail Dialog */}
          <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              {selectedTicket && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedTicket.subject}</DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(selectedTicket.status)}
                      {getPriorityBadge(selectedTicket.priority)}
                    </div>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Descrição</h4>
                      <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Criado em {selectedTicket.formatDate(createdAt)} às{" "}
                        {selectedTicket.createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {selectedTicket.responses.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Histórico de Respostas</h4>
                        <div className="space-y-4">
                          {selectedTicket.responses.map((response) => (
                            <div
                              key={response.id}
                              className={`p-4 rounded-lg ${
                                response.isAdmin ? "bg-blue-50 border border-blue-200" : "bg-muted"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">{response.author}</span>
                                <span className="text-xs text-muted-foreground">
                                  {response.formatDate(createdAt)} às{" "}
                                  {response.createdAt.toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm">{response.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTicket.status !== "resolved" && (
                      <div className="space-y-2 pt-4 border-t">
                        <Label htmlFor="new-response">Adicionar Resposta</Label>
                        <Textarea id="new-response" placeholder="Digite sua mensagem..." rows={3} />
                        <div className="flex justify-end">
                          <Button>Enviar Resposta</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
