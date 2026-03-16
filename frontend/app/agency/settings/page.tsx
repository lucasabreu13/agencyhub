"use client"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getUser } from "@/lib/auth"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const [agencyData, setAgencyData] = useState<any>(null)

  useEffect(() => {
    if (user?.agencyId) {
      getAgency(user.agencyId).then((agency) => {
        if (agency) setAgencyData(agency)
      })
    }
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Configurações" />

        <div className="p-6 space-y-6 max-w-4xl">
          <div>
            <h2 className="text-2xl font-bold">Configurações da Agência</h2>
            <p className="text-muted-foreground">Gerencie as informações da sua agência</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Agência</CardTitle>
              <CardDescription>Dados básicos da sua agência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Agência</Label>
                <Input defaultValue={agencyData?.name || ""} />
              </div>

              <div className="space-y-2">
                <Label>Plano Atual</Label>
                <div>
                  <Badge variant="default" className="text-sm">
                    {agencyData?.plan === "basic"
                      ? "Básico"
                      : agencyData?.plan === "pro"
                        ? "Profissional"
                        : "Enterprise"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Data de Criação</Label>
                <Input value={agencyData?.createdAt?.toLocaleDateString("pt-BR") || ""} disabled />
              </div>

              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Seus dados de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input defaultValue={user.name} />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user.email} type="email" />
              </div>

              <Button>Atualizar Perfil</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Altere sua senha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Senha Atual</Label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <div className="space-y-2">
                <Label>Confirmar Nova Senha</Label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <Button>Alterar Senha</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
