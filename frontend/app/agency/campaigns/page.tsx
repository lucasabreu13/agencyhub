"use client"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent } from "@/components/ui/card"
import { agencyApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CampaignsPage() {
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

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Campanhas" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gerenciar Campanhas</h2>
              <p className="text-muted-foreground">Acompanhe todas as campanhas ativas e concluídas</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => {
            // client removed - use campaign.clientName if available
              const percentage = (campaign.spent / campaign.budget) * 100

              return (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
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

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>Cliente: {client?.company}</span>
                          <span>Plataforma: {campaign.platform}</span>
                          <span>
                            {campaign.(typeof startDate === "string" ? new Date(startDate).toLocaleDateString("pt-BR") : startDate instanceof Date ? startDate.toLocaleDateString("pt-BR") : "")} -{" "}
                            {campaign.endDate?.toLocaleDateString("pt-BR") || "Em andamento"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Orçamento</span>
                            <span className="font-medium">
                              {campaign.spent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} /{" "}
                              {campaign.budget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${percentage > 80 ? "bg-orange-500" : "bg-primary"}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}% do orçamento utilizado
                          </p>
                        </div>
                      </div>

                      <Button variant="outline">Ver Detalhes</Button>
                    </div>
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
