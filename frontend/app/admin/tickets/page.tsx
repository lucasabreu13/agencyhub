"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Search, Filter, Clock, CheckCircle2, AlertCircle, XCircle, MessageSquare, Send } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AdminTicketsPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth("admin")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [userTypeFilter, setUserTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [responseMessage, setResponseMessage] = useState("")

  const { data: ticketsData } = useApi(() => adminApi.getTickets())

  if (loading || !user) {
    return null
  }

  const handleLogout = () => {
    router.push("/")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Aberto"
      case "in_progress":
        return "Em Andamento"
      case "resolved":
        return "Resolvido"
      case "closed":
        return "Fechado"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return ""
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return "Baixa"
      case "medium":
        return "Média"
      case "high":
        return "Alta"
      case "urgent":
        return "Urgente"
      default:
        return priority
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  const getUserTypeLabel = (userType: string) => {
    return userType === "agency_owner" ? "Dono de Agência" : "Cliente"
  }

  const allTickets = ticketsData?.data || []

  const filteredTickets = allTickets.filter((ticket: any) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.agencyName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesUserType = userTypeFilter === "all" || ticket.userType === userTypeFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesUserType && matchesPriority
  })

  const stats = {
    total: allTickets.length,
    open: allTickets.filter((t: any) => t.status === "open").length,
    inProgress: allTickets.filter((t: any) => t.status === "in_progress").length,
    resolved: allTickets.filter((t: any) => t.status === "resolved").length,
  }

  const handleSendResponse = () => {
    if (responseMessage.trim() && selectedTicket) {
      console.log("[v0] Enviando resposta para ticket:", selectedTicket.id, responseMessage)
      // Aqui você adicionaria a lógica para salvar a resposta
      setResponseMessage("")
      alert("Resposta enviada com sucesso!")
    }
  }

  const handleChangeStatus = (ticketId: string, newStatus: string) => {
    console.log("[v0] Alterando status do ticket:", ticketId, "para:", newStatus)
    // Aqui você adicionaria a lógica para atualizar o status
    alert(`Status alterado para: ${getStatusLabel(newStatus)}`)
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={user} title="Chamados de Suporte" />

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Chamados de Suporte</h1>
            <p className="text-muted-foreground">Gerencie todos os tickets de suporte da plataforma</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abertos</CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar chamados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="agency_owner">Dono de Agência</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as prioridades</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Chamados ({filteredTickets.length})</CardTitle>
              <CardDescription>Visualize e gerencie todos os tickets de suporte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum chamado encontrado com os filtros aplicados.</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <Dialog key={ticket.id}>
                      <DialogTrigger asChild>
                        <Card
                          className="cursor-pointer hover:border-primary transition-colors"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg">{ticket.title}</h3>
                                  <Badge className={getPriorityColor(ticket.priority)}>
                                    {getPriorityLabel(ticket.priority)}
                                  </Badge>
                                  <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(ticket.status)}
                                      {getStatusLabel(ticket.status)}
                                    </span>
                                  </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <strong>Usuário:</strong> {ticket.userName}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <strong>Tipo:</strong> {getUserTypeLabel(ticket.userType)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <strong>Agência:</strong> {ticket.agencyName}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <strong>Criado:</strong>{" "}
                                    {format(ticket.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                  </span>
                                  {ticket.assignedTo && (
                                    <span className="flex items-center gap-1">
                                      <strong>Atribuído a:</strong> {ticket.assignedTo}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {ticket.responses.length} resposta(s)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>

                      {/* Ticket Detail Dialog */}
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{ticket.title}</DialogTitle>
                          <DialogDescription className="flex flex-wrap gap-2 pt-2">
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {getPriorityLabel(ticket.priority)}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                              {getStatusLabel(ticket.status)}
                            </Badge>
                            <Badge variant="secondary">{getUserTypeLabel(ticket.userType)}</Badge>
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Ticket Info */}
                          <div className="space-y-2">
                            <h4 className="font-semibold">Informações do Ticket</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Usuário:</span>
                                <p className="font-medium">{ticket.userName}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Email:</span>
                                <p className="font-medium">{ticket.userEmail}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Agência:</span>
                                <p className="font-medium">{ticket.agencyName}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Criado em:</span>
                                <p className="font-medium">
                                  {format(ticket.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                              </div>
                              {ticket.assignedTo && (
                                <div>
                                  <span className="text-muted-foreground">Atribuído a:</span>
                                  <p className="font-medium">{ticket.assignedTo}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <h4 className="font-semibold">Descrição</h4>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                              {ticket.description}
                            </p>
                          </div>

                          {/* Responses */}
                          <div className="space-y-2">
                            <h4 className="font-semibold">Histórico de Respostas ({ticket.responses.length})</h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {ticket.responses.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                  Nenhuma resposta ainda.
                                </p>
                              ) : (
                                ticket.responses.map((response) => (
                                  <div
                                    key={response.id}
                                    className={`p-3 rounded-lg ${
                                      response.authorType === "admin" ? "bg-blue-50 border border-blue-100" : "bg-muted"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-medium text-sm">{response.authorName}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {format(response.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                      </span>
                                    </div>
                                    <p className="text-sm">{response.message}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Alterar Status</Label>
                              <Select
                                defaultValue={ticket.status}
                                onValueChange={(value) => handleChangeStatus(ticket.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Aberto</SelectItem>
                                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                                  <SelectItem value="resolved">Resolvido</SelectItem>
                                  <SelectItem value="closed">Fechado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Adicionar Resposta</Label>
                              <Textarea
                                placeholder="Digite sua resposta..."
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                                rows={4}
                              />
                              <Button onClick={handleSendResponse} className="w-full gap-2">
                                <Send className="h-4 w-4" />
                                Enviar Resposta
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
