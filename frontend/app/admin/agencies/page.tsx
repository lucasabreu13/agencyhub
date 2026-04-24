"use client"

import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default function AdminAgenciesPage() {
  const { user, loading, logout } = useAuth("admin")

  const { data: agenciesPageData } = useApi(() => adminApi.getAgencies())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }


  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Agências" />

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Gerenciar Agências</h2>
            <p className="text-muted-foreground">Visualize e administre todas as agências da plataforma</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(agenciesPageData?.data || []).map((agency: any) => {
              const agencyClientsCount = agency.clientsCount || 0
              const agencyActiveClientsCount = agency.activeClientsCount || 0
              const planPrice =
                agency.plan === "basic" ? 197 : agency.plan === "pro" ? 397 : agency.plan === "enterprise" ? 797 : 0

              return (
                <Card key={agency.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agency.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{agencyClientsCount} clientes</p>
                        </div>
                      </div>
                      <Badge variant="default">
                        {agency.plan === "basic" ? "Starter" : agency.plan === "pro" ? "Pro" : "Scale"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Desde {agency.createdAt ? new Date(agency.createdAt).toLocaleDateString("pt-BR") : "N/A"}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {agencyActiveClientsCount} clientes ativos
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Receita Mensal</p>
                      <p className="text-lg font-bold">
                        {(planPrice || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    </div>

                    <Link href={`/admin/agencies/${agency.id}`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Ver Detalhes
                      </Button>
                    </Link>
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
