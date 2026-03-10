"use client"

import { useAuth } from "@/hooks/use-auth"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import {
  Megaphone,
  TrendingUp,
  DollarSign,
  Calendar,
  Lightbulb,
  FileText,
  CalendarDays,
  AlertTriangle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ClientDashboard() {
  const { user, loading, logout } = useAuth("agency_client")

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  // Get client data
  const { data: dashboardData } = useApi(() => clientApi.getDashboard())
  const campaigns = dashboardData?.recentCampaigns || []
  const smartInsights = getSmartInsightsByClient(clientData?.id || "")

  const activeCampaigns = campaigns.filter((c) => c.status === "active")
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0)
  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0)

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "metric":
        return <TrendingUp className="h-4 w-4" />
      case "report":
        return <FileText className="h-4 w-4" />
      case "event":
        return <CalendarDays className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <ClientHeader user={user} title="Dashboard" />

        <div className="p-6 space-y-6">
          {/* Welcome */}
          <div>
            <h2 className="text-3xl font-bold">Bem-vindo, {user.name}!</h2>
            <p className="text-muted-foreground mt-1">{clientData?.company}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCampaigns.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{campaigns.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalSpent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  de {totalBudget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.8%</div>
                <p className="text-xs text-green-600 mt-1">+0.5% vs. mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Orçamento Mensal</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clientData?.monthlyBudget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Renovação em 25 dias</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Atualizações Inteligentes</CardTitle>
              </div>
              <CardDescription>Insights automáticos sobre suas campanhas e métricas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {smartInsights.map((insight) => (
                  <Link key={insight.id} href={insight.link}>
                    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="mt-0.5 text-primary">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{insight.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(insight.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </Link>
                ))}
                {smartInsights.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atualização no momento</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Destaques da Semana</CardTitle>
              <CardDescription>Principais métricas dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-muted-foreground">Alcance Total</span>
                <span className="font-bold">45.2K</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-muted-foreground">Engajamento</span>
                <span className="font-bold">2.8K</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-muted-foreground">Conversões</span>
                <span className="font-bold">143</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ROI</span>
                <span className="font-bold text-green-600">+285%</span>
              </div>
            </CardContent>
          </Card>

          {/* Próximas Entregas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Entregas</CardTitle>
              <CardDescription>Projetos e relatórios programados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-sm">Relatório Mensal</p>
                  <p className="text-xs text-muted-foreground">Performance de Janeiro</p>
                </div>
                <Badge variant="secondary">5 dias</Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-sm">Criação de Conteúdo</p>
                  <p className="text-xs text-muted-foreground">Posts para redes sociais</p>
                </div>
                <Badge variant="secondary">8 dias</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Reunião Estratégica</p>
                  <p className="text-xs text-muted-foreground">Planejamento Q2</p>
                </div>
                <Badge variant="secondary">12 dias</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
