"use client"
import { formatDate } from "@/lib/utils"

import { use } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Mail,
  Phone,
  Clock,
  Shield,
  Eye,
  Ban,
  RotateCcw,
  History,
  CheckCircle2,
  XCircle,
  ChevronLeft,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function AgencyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, loading, logout } = useAuth("admin")
  const [logFilter, setLogFilter] = useState("all")
  const [logSearch, setLogSearch] = useState("")

  const { data: agency, loading: agencyLoading } = useApi(() => adminApi.getAgency(id))
  const { data: agencyStats } = useApi(() => adminApi.getAgencyStats(id))

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }


  if (agencyLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!agency) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Agência não encontrada</h2>
          <Link href="/admin/agencies">
            <Button>Voltar para Agências</Button>
          </Link>
        </div>
      </div>
    )
  }

  const agencyClients = agencyStats?.clients || []
  const agencyUsers = agencyStats?.users || []

  // Mock data for subscription history
  const subscriptionHistory = [
    {
      id: "1",
      previousPlan: "Pro",
      newPlan: "Enterprise",
      type: "upgrade" as const,
      date: new Date("2024-12-15"),
      responsibleUser: "Admin Sistema",
    },
    {
      id: "2",
      previousPlan: "Básico",
      newPlan: "Pro",
      type: "upgrade" as const,
      date: new Date("2024-08-01"),
      responsibleUser: "Admin Sistema",
    },
  ]

  // Mock data for audit logs
  const auditLogs = [
    {
      id: "log1",
      timestamp: new Date("2026-01-06T10:30:00"),
      user: "João Silva",
      action: "Login realizado",
      module: "Autenticação",
      entity: "Sistema",
      origin: "Agência",
    },
    {
      id: "log2",
      timestamp: new Date("2026-01-06T09:15:00"),
      user: "Maria Santos",
      action: "Cliente criado",
      module: "Clientes",
      entity: "TechStart Solutions",
      origin: "Agência",
    },
    {
      id: "log3",
      timestamp: new Date("2026-01-05T16:45:00"),
      user: "Admin Sistema",
      action: "Visualização de dados",
      module: "Financeiro",
      entity: "Relatório Mensal",
      origin: "Admin",
    },
    {
      id: "log4",
      timestamp: new Date("2026-01-05T14:20:00"),
      user: "Carlos Santos",
      action: "Campanha editada",
      module: "Campanhas",
      entity: "Lançamento Produto Q1",
      origin: "Agência",
    },
    {
      id: "log5",
      timestamp: new Date("2026-01-05T11:00:00"),
      user: "Cliente TechStart",
      action: "Relatório visualizado",
      module: "Relatórios",
      entity: "Performance Dezembro",
      origin: "Cliente",
    },
  ]

  const filteredLogs = auditLogs.filter((log) => {
    const matchesFilter = logFilter === "all" || log.origin.toLowerCase() === logFilter
    const matchesSearch =
      logSearch === "" ||
      log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.module.toLowerCase().includes(logSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Detalhes da Agência" />

        <div className="p-6 space-y-6">
          {/* Header com breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/admin/agencies" className="hover:text-foreground flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Agências
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{agency.name}</span>
          </div>

          {/* Title and Preview Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                {agency.name}
              </h2>
              <p className="text-muted-foreground mt-1">Gestão completa da agência</p>
            </div>
            <Button className="gap-2" size="lg">
              <Eye className="h-4 w-4" />
              Preview do Portal
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>

          <Tabs defaultValue="subscription" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="audit">Logs & Auditoria</TabsTrigger>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            </TabsList>

            {/* TAB 1: GESTÃO DE ASSINATURAS */}
            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assinatura da Agência</CardTitle>
                  <CardDescription>Informações sobre o plano e histórico completo de mudanças</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status e Informações Principais */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Status da Assinatura</p>
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Ativa
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Plano Atual</p>
                      <p className="font-semibold text-lg">
                        {agency.plan === "basic" ? "Básico" : agency.plan === "pro" ? "Pro" : "Enterprise"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Data de Início</p>
                      <p className="font-medium">
                        {agency.createdAt ? new Date(agency.createdAt).toLocaleDateString("pt-BR") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Data de Renovação</p>
                      <p className="font-medium">15/02/2026</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Valor do Plano</p>
                      <p className="text-2xl font-bold">
                        {(agency.plan === "basic" ? 197 : agency.plan === "pro" ? 497 : 997).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                        <span className="text-sm font-normal text-muted-foreground">/mês</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Método de Pagamento</p>
                      <p className="font-medium">Cartão de Crédito •••• 4532</p>
                      <p className="text-xs text-muted-foreground mt-1">Faturamento Mensal</p>
                    </div>
                  </div>

                  {/* Histórico de Mudanças */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Histórico Completo de Mudanças
                    </h4>
                    <div className="space-y-3">
                      {subscriptionHistory.map((history) => (
                        <div key={history.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          {history.type === "upgrade" ? (
                            <ArrowUpRight className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 text-orange-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">
                                {history.type === "upgrade" ? "Upgrade" : "Downgrade"}: {history.previousPlan} →{" "}
                                {history.newPlan}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {history.formatDate(date)}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Responsável: {history.responsibleUser}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Informações de Cancelamento (se aplicável) */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                      <XCircle className="h-5 w-5" />
                      Informações de Cancelamento
                    </h4>
                    <p className="text-sm text-muted-foreground">Nenhum cancelamento registrado</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: USUÁRIOS DA AGÊNCIA */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Usuários da Agência</CardTitle>
                  <CardDescription>
                    {agencyUsers.length} membros cadastrados com permissões e histórico de acesso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agencyUsers.map((user) => {
                      const initials = user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()

                      return (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-lg">{user.name}</h4>
                                <Badge variant={user.role === "owner" ? "default" : "secondary"}>
                                  {user.role === "owner" ? "Proprietário" : user.role}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </div>
                                {user.phone && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    {user.phone}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3" />
                                Último acesso: {user.formatDate(lastAccess)} às{" "}
                                {user.lastAccess.toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Shield className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Permissões: Dashboard, Clientes, Campanhas, Relatórios
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                              <Eye className="h-3 w-3" />
                              Ver
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                              <Ban className="h-3 w-3" />
                              Suspender
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                              <RotateCcw className="h-3 w-3" />
                              Resetar
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: CLIENTES DA AGÊNCIA */}
            <TabsContent value="clients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Clientes da Agência</CardTitle>
                  <CardDescription>
                    {agencyClients.length} clientes cadastrados com campanhas e receita associada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {agencyClients.length > 0 ? (
                    <div className="space-y-4">
                      {agencyClients.map((client) => (
                        <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-lg">{client.name}</h4>
                              <Badge variant={client.status === "active" ? "default" : "secondary"}>
                                {client.status === "active"
                                  ? "Ativo"
                                  : client.status === "paused"
                                    ? "Pausado"
                                    : "Inativo"}
                              </Badge>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium">{client.email}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Data de Início</p>
                                <p className="text-sm font-medium">{client.formatDate(startDate)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Receita Mensal</p>
                                <p className="text-sm font-semibold text-green-600">
                                  {client.monthlyBudget.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                              <span>2 campanhas ativas</span>
                              <span>•</span>
                              <span>3 projetos ativos</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                              <Eye className="h-3 w-3" />
                              Ver Timeline
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum cliente cadastrado ainda</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: LOGS E AUDITORIA */}
            <TabsContent value="audit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Logs e Auditoria da Agência</CardTitle>
                  <CardDescription>Histórico completo de ações e eventos da agência</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filtros */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Buscar por usuário, ação ou módulo..."
                        value={logSearch}
                        onChange={(e) => setLogSearch(e.target.value)}
                      />
                    </div>
                    <Select value={logFilter} onValueChange={setLogFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filtrar origem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Origens</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="agência">Agência</SelectItem>
                        <SelectItem value="cliente">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Logs Table */}
                  <div className="border rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 text-sm font-semibold">Data/Hora</th>
                            <th className="text-left p-3 text-sm font-semibold">Usuário</th>
                            <th className="text-left p-3 text-sm font-semibold">Ação</th>
                            <th className="text-left p-3 text-sm font-semibold">Módulo</th>
                            <th className="text-left p-3 text-sm font-semibold">Entidade</th>
                            <th className="text-left p-3 text-sm font-semibold">Origem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLogs.map((log) => (
                            <tr key={log.id} className="border-t hover:bg-muted/30">
                              <td className="p-3 text-sm">
                                <div>{log.formatDate(timestamp)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {log.timestamp.toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </td>
                              <td className="p-3 text-sm font-medium">{log.user}</td>
                              <td className="p-3 text-sm">{log.action}</td>
                              <td className="p-3 text-sm">
                                <Badge variant="outline">{log.module}</Badge>
                              </td>
                              <td className="p-3 text-sm text-muted-foreground">{log.entity}</td>
                              <td className="p-3 text-sm">
                                <Badge
                                  variant={
                                    log.origin === "Admin"
                                      ? "destructive"
                                      : log.origin === "Agência"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {log.origin}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Mostrando {filteredLogs.length} de {auditLogs.length} registros
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5: VISÃO GERAL */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumo Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total de Clientes:</span>
                      <span className="font-semibold">{agencyClients.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Clientes Ativos:</span>
                      <span className="font-semibold">{agencyClients.filter((c) => c.status === "active").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Membros da Equipe:</span>
                      <span className="font-semibold">{agencyUsers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Plano Atual:</span>
                      <span className="font-semibold">
                        {agency.plan === "basic" ? "Básico" : agency.plan === "pro" ? "Pro" : "Enterprise"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financeiro</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Receita Total:</span>
                      <span className="font-semibold text-green-600">
                        {agencyClients
                          .reduce((acc, c) => acc + c.monthlyBudget, 0)
                          .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Plano Mensal:</span>
                      <span className="font-semibold">
                        {(agency.plan === "basic" ? 197 : agency.plan === "pro" ? 497 : 997).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status Pagamento:</span>
                      <Badge variant="default" className="bg-green-600">
                        Em Dia
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recursos Disponíveis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Dashboard Completo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>CRM e Gestão de Leads</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Financeiro Completo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Kanban e Metas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Calendário Integrado</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Alertas e Notificações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Tudo funcionando perfeitamente</p>
                      <p className="text-sm text-green-700 mt-1">
                        Não há alertas ou problemas identificados para esta agência
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
