"use client"

import { useAuth } from "@/hooks/use-auth"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Download, TrendingUp, DollarSign, Target, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ClientReportsPage() {
  const { user, loading, logout } = useAuth("agency_client")

  const { data: reportsData } = useApi(() => clientApi.getReports())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const reports = reportsData?.data || []

  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0)
  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0)

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <ClientHeader user={user} title="Relatórios" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
              <p className="text-muted-foreground">Acompanhe o desempenho das suas campanhas</p>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Impressões Totais</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187.5K</div>
                <p className="text-xs text-green-600 mt-1">+15.2% vs. mês anterior</p>
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
                <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">428</div>
                <p className="text-xs text-green-600 mt-1">+22.4% vs. mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Campanha</CardTitle>
              <CardDescription>Métricas detalhadas de cada campanha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(campaigns || []).map((campaign) => {
                  const percentage = (campaign.spent / campaign.budget) * 100

                  return (
                    <div key={campaign.id} className="space-y-3 border-b pb-6 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {(campaign.spent || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                          <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}% do orçamento</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold">62.5K</p>
                          <p className="text-xs text-muted-foreground">Impressões</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold">2.4K</p>
                          <p className="text-xs text-muted-foreground">Cliques</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold">3.8%</p>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold">214</p>
                          <p className="text-xs text-muted-foreground">Conversões</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ROI por Campanha</CardTitle>
              <CardDescription>Retorno sobre investimento detalhado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(campaigns || []).map((campaign) => {
                  const roi = Math.floor(Math.random() * 200) + 150 // Mock ROI

                  return (
                    <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Investimento: {(campaign.spent || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">+{roi}%</p>
                        <p className="text-xs text-muted-foreground">ROI</p>
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
