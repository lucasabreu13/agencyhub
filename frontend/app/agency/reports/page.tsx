"use client"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { TrendingUp, DollarSign, Target, Users } from "lucide-react"

export default function ReportsPage() {
  const { user, loading, logout } = useAuth("agency_owner")

  const { data: campaignsData } = useApi(() => agencyApi.getCampaigns())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const campaigns = campaignsData?.data || []
  const { data: clientsData } = useApi(() => agencyApi.getClients())
  const clients = clientsData?.data || []

  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0)
  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0)
  const activeClients = clients.filter((c) => c.status === "active").length
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Relatórios" />

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
            <p className="text-muted-foreground">Visualize métricas e performance da agência</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <CardTitle className="text-sm font-medium">Taxa de Utilização</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((totalSpent / totalBudget) * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">do orçamento total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeClients}</div>
                <p className="text-xs text-muted-foreground mt-1">de {clients.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCampaigns}</div>
                <p className="text-xs text-muted-foreground mt-1">em andamento</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance por Campanha</CardTitle>
              <CardDescription>Detalhamento de investimento por campanha ativa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaigns
                  .filter((c) => c.status === "active")
                  .map((campaign) => {
                    const percentage = (campaign.spent / campaign.budget) * 100

                    return (
                      <div key={campaign.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {campaign.spent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {campaign.budget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </p>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${Math.min(percentage, 100)}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground text-right">{percentage.toFixed(1)}%</p>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance por Cliente</CardTitle>
              <CardDescription>Investimento mensal por cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients
                  .filter((c) => c.status === "active")
                  .map((client) => {
                    const clientCampaigns = campaigns.filter((c) => c.clientId === client.id)
                    const clientSpent = clientCampaigns.reduce((acc, c) => acc + c.spent, 0)

                    return (
                      <div key={client.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">{client.company}</p>
                          <p className="text-sm text-muted-foreground">{clientCampaigns.length} campanhas ativas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {clientSpent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Orçamento:{" "}
                            {client.monthlyBudget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
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
