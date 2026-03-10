"use client"

import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Building2, Users, DollarSign, TrendingUp, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth("admin")
  const { data: dashboard } = useApi(() => adminApi.getDashboard())
  const { data: agenciesData } = useApi(() => adminApi.getAgencies())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const totalAgencies = agenciesData?.total || dashboard?.activeAgencies || 0
  const totalClients = dashboard?.totalClients || 0
  const totalCampaigns = dashboard?.totalCampaigns || 0

  const monthlyRevenue = dashboard?.mrr || 0

  const revenueData = [
    { month: "Ago", revenue: 19700, growth: 0 },
    { month: "Set", revenue: 39400, growth: 100 },
    { month: "Out", revenue: 59100, growth: 50 },
    { month: "Nov", revenue: 78800, growth: 33 },
    { month: "Dez", revenue: 98500, growth: 25 },
    { month: "Jan", revenue: 118200, growth: 20 },
  ]

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Dashboard Administrativo" />

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Visão Geral da Plataforma</h2>
            <p className="text-muted-foreground mt-1">Estatísticas e métricas globais</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Agências Ativas</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAgencies}</div>
                <p className="text-xs text-green-600 mt-1">+2 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClients}</div>
                <p className="text-xs text-green-600 mt-1">+5 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {monthlyRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <p className="text-xs text-green-600 mt-1">+18% vs. mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCampaigns}</div>
                <p className="text-xs text-muted-foreground mt-1">Na plataforma</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agências Recentes</CardTitle>
                <CardDescription>Últimas agências cadastradas na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(agenciesData?.data || []).map((agency: any) => (
                    <div key={agency.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{agency.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Desde {agency.createdAt.toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Badge variant="default">
                        {agency.plan === "basic" ? "Básico" : agency.plan === "pro" ? "Pro" : "Enterprise"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Planos</CardTitle>
                <CardDescription>Agências por tipo de plano contratado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Plano Básico</span>
                      <span className="font-medium">0 agências</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "0%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Plano Profissional</span>
                      <span className="font-medium">
                        {(agenciesData?.data || []).filter((a: any) => a.plan === "pro").length} agências
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${((agenciesData?.data || []).filter((a: any) => a.plan === "pro").length / totalAgencies) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Plano Enterprise</span>
                      <span className="font-medium">
                        {(agenciesData?.data || []).filter((a: any) => a.plan === "enterprise").length} agências
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${((agenciesData?.data || []).filter((a: any) => a.plan === "enterprise").length / totalAgencies) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Crescimento de Receita
              </CardTitle>
              <CardDescription>Receita mensal recorrente (MRR) nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Receita",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-sm" />
                    <YAxis
                      className="text-sm"
                      tickFormatter={(value) =>
                        value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 })
                      }
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) =>
                            Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                          }
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
              <CardDescription>Saúde e performance da plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">99.9%</div>
                  <p className="text-sm text-muted-foreground mt-1">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">142ms</div>
                  <p className="text-sm text-muted-foreground mt-1">Tempo de Resposta</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">Operacional</div>
                  <p className="text-sm text-muted-foreground mt-1">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
