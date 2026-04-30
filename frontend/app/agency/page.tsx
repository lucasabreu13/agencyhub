"use client"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Users, Megaphone, FolderKanban, TrendingUp, DollarSign, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AgencyDashboard() {
  const { user, loading, logout } = useAuth("agency_owner")
  const { toast } = useToast()
  const [agencyName, setAgencyName] = useState("")

  useEffect(() => {
    if (user?.agencyId) {
      agencyApi.getProfile().then((res: any) => {
        if (res?.name) setAgencyName(res.name)
      }).catch(() => {
        toast({ title: "Erro ao carregar perfil da agência", description: "Algumas informações podem estar indisponíveis.", variant: "destructive" })
      })
    }
  }, [user])

  const { data: clientsData } = useApi(() => agencyApi.getClients())
  const { data: campaignsData } = useApi(() => agencyApi.getCampaigns())
  const { data: projectsData } = useApi(() => agencyApi.getProjects())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }


  const clients = clientsData?.data || []
  const campaigns = campaignsData?.data || []
  const projects = projectsData?.data || []

  const activeClients = (clients || []).filter((c: any) => c.status === "active").length
  const activeCampaigns = (campaigns || []).filter((c: any) => c.status === "active").length
  const activeProjects = (projects || []).filter((p: any) => p.status === "in_progress").length

  const totalBudget = (campaigns || []).reduce((acc: number, c: any) => acc + Number(c.budget), 0)
  const totalSpent = (campaigns || []).reduce((acc: number, c: any) => acc + Number(c.spent), 0)

  const campaignPerformanceData = campaigns
    .slice(0, 6)
    .map((c: any) => ({
      name: (c.name || "").length > 12 ? (c.name as string).slice(0, 12) + "…" : c.name,
      impressoes: Number(c.metrics?.impressions) || 0,
      conversoes: Number(c.metrics?.conversions) || 0,
    }))

  const roiByMonth: Record<string, { budget: number; spent: number }> = {}
  for (const c of campaigns) {
    const d = c.startDate ? new Date(c.startDate) : new Date(c.createdAt)
    const key = d.toLocaleString("pt-BR", { month: "short" }).replace(".", "")
    if (!roiByMonth[key]) roiByMonth[key] = { budget: 0, spent: 0 }
    roiByMonth[key].budget += Number(c.budget) || 0
    roiByMonth[key].spent += Number(c.spent) || 0
  }
  const roiData = Object.entries(roiByMonth)
    .slice(-6)
    .map(([mes, { budget, spent }]) => ({
      mes: mes.charAt(0).toUpperCase() + mes.slice(1),
      roi: spent > 0 ? Math.round((budget / spent) * 10) / 10 : 0,
    }))
  const currentRoi = roiData.length > 0 ? roiData[roiData.length - 1].roi : 0
  const prevRoi = roiData.length > 1 ? roiData[roiData.length - 2].roi : 0
  const roiChange = prevRoi > 0 ? Math.round(((currentRoi - prevRoi) / prevRoi) * 100) : 0

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Dashboard" />

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Bem-vindo, {user.name}!</h2>
            <p className="text-muted-foreground mt-1">{agencyName}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/agency/clients">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeClients}</div>
                  <p className="text-xs text-muted-foreground mt-1">{(clients || []).length} total</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/agency/campaigns">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeCampaigns}</div>
                  <p className="text-xs text-muted-foreground mt-1">{(campaigns || []).length} total</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/agency/projects">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Projetos em Andamento</CardTitle>
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeProjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">{(projects || []).length} total</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/agency/financial">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(totalSpent || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    de {(totalBudget || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campanhas Recentes</CardTitle>
                <CardDescription>Suas campanhas ativas mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => {
                    const client = clients.find((c) => c.id === campaign.clientId)
                    const percentage = (campaign.spent / campaign.budget) * 100

                    return (
                      <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">{client?.company}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                            {campaign.status === "active"
                              ? "Ativa"
                              : campaign.status === "paused"
                                ? "Pausada"
                                : "Concluída"}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% gasto</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projetos Pendentes</CardTitle>
                <CardDescription>Projetos que precisam de atenção</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(projects || []).filter((p) => p.status === "in_progress" || p.status === "planning")
                    .slice(0, 3)
                    .map((project) => {
                      const client = clients.find((c) => c.id === project.clientId)
                      const daysUntilDue = Math.ceil(
                        (new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )

                      return (
                        <div key={project.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{project.name}</p>
                            <p className="text-xs text-muted-foreground">{client?.company}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge
                              variant={
                                project.priority === "high"
                                  ? "destructive"
                                  : project.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {project.priority === "high" ? "Alta" : project.priority === "medium" ? "Média" : "Baixa"}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{daysUntilDue} dias</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance de Campanhas</CardTitle>
                <CardDescription>Impressões vs Conversões (últimas 6 semanas)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="impressoes" fill="hsl(var(--primary))" name="Impressões" />
                    <Bar yAxisId="right" dataKey="conversoes" fill="hsl(var(--chart-2))" name="Conversões" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Médio</CardTitle>
                <CardDescription>Retorno sobre investimento (últimos 6 meses)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}x`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="roi"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={3}
                      name="ROI"
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">ROI Médio Atual</p>
                  <p className="text-2xl font-bold text-green-600">{currentRoi}x</p>
                  {prevRoi > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {roiChange >= 0 ? `+${roiChange}%` : `${roiChange}%`} vs mês anterior
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Overview
              </CardTitle>
              <CardDescription>Resumo de performance das campanhas ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(campaigns || []).filter((c) => c.status === "active")
                  .map((campaign) => {
                    const client = clients.find((c) => c.id === campaign.clientId)
                    const percentage = (campaign.spent / campaign.budget) * 100
                    const isNearBudget = percentage > 80

                    return (
                      <div key={campaign.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{campaign.name}</p>
                            {isNearBudget && <AlertCircle className="h-4 w-4 text-orange-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {(campaign.spent || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} /{" "}
                            {(campaign.budget || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isNearBudget ? "bg-orange-500" : "bg-primary"}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
