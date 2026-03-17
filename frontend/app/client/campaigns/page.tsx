"use client"
import { formatDate } from "@/lib/utils"

import { useAuth } from "@/hooks/use-auth"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Eye, MousePointer, Target } from "lucide-react"

export default function ClientCampaignsPage() {
  const { user, loading, logout } = useAuth("agency_client")

  const { data: campaignsData } = useApi(() => clientApi.getCampaigns())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const campaigns = campaignsData?.data || []

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <ClientHeader user={user} title="Campanhas" />

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Todas as Campanhas</h2>
            <p className="text-muted-foreground">Visualize o histórico completo de suas campanhas</p>
          </div>

          <div className="space-y-6">
            {(campaigns || []).map((campaign) => {
              const percentage = (campaign.spent / campaign.budget) * 100
              const isActive = campaign.status === "active"

              return (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{campaign.name}</CardTitle>
                        <CardDescription className="mt-1">Plataforma: {campaign.platform}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          campaign.status === "active"
                            ? "default"
                            : campaign.status === "paused"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {campaign.status === "active"
                          ? "Ativa"
                          : campaign.status === "paused"
                            ? "Pausada"
                            : "Concluída"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Período</p>
                        <p className="font-medium">
                          {campaign.formatDate(startDate)} -{" "}
                          {campaign.endDate ? (typeof campaign.endDate === "string" ? new Date(campaign.endDate) : campaign.endDate).toLocaleDateString("pt-BR") : "Em andamento"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Investimento</p>
                        <p className="font-medium">
                          {(campaign.spent || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} /{" "}
                          {(campaign.budget || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso do orçamento</span>
                        <span className="font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${percentage > 80 ? "bg-orange-500" : "bg-primary"}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {isActive && (
                      <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <Eye className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xl font-bold">12.5K</p>
                          <p className="text-xs text-muted-foreground">Impressões</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <MousePointer className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xl font-bold">486</p>
                          <p className="text-xs text-muted-foreground">Cliques</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <TrendingUp className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xl font-bold">3.9%</p>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <Target className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xl font-bold">143</p>
                          <p className="text-xs text-muted-foreground">Conversões</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
