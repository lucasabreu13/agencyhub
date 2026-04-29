"use client"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApi } from "@/hooks/use-api"
import { agencyApi } from "@/lib/api"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

function getPlanLabel(plan: string) {
  if (plan === "starter" || plan === "basic") return "Starter"
  if (plan === "pro") return "Pro"
  return "Scale"
}

export default function SettingsPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const { data: agencyData } = useApi(() => agencyApi.getProfile())
  const { toast } = useToast()

  const [agencyName, setAgencyName] = useState("")
  const [userName, setUserName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingAgency, setSavingAgency] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (agencyData?.name) setAgencyName(agencyData.name)
  }, [agencyData])

  useEffect(() => {
    if (user?.name) setUserName(user.name)
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const handleSaveAgency = async () => {
    setSavingAgency(true)
    try {
      await agencyApi.updateProfile({ name: agencyName })
      toast({ title: "Agência atualizada", description: "Dados da agência salvos com sucesso." })
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Não foi possível salvar.", variant: "destructive" })
    } finally {
      setSavingAgency(false)
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      await agencyApi.updateMyProfile({ name: userName })
      toast({ title: "Perfil atualizado", description: "Seus dados foram salvos com sucesso." })
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Não foi possível salvar.", variant: "destructive" })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Erro", description: "A nova senha e a confirmação não coincidem.", variant: "destructive" })
      return
    }
    if (newPassword.length < 6) {
      toast({ title: "Erro", description: "A nova senha deve ter ao menos 6 caracteres.", variant: "destructive" })
      return
    }
    setSavingPassword(true)
    try {
      await agencyApi.changePassword({ currentPassword, newPassword })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast({ title: "Senha alterada", description: "Sua senha foi atualizada com sucesso." })
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Não foi possível alterar a senha.", variant: "destructive" })
    } finally {
      setSavingPassword(false)
    }
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
                <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Plano Atual</Label>
                <div>
                  <Badge variant="default" className="text-sm">
                    {getPlanLabel(agencyData?.plan || "")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Data de Criação</Label>
                <Input
                  value={agencyData?.createdAt ? new Date(agencyData.createdAt).toLocaleDateString("pt-BR") : ""}
                  disabled
                />
              </div>

              <Button onClick={handleSaveAgency} disabled={savingAgency}>
                {savingAgency && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
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
                <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} type="email" disabled />
              </div>

              <Button onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Atualizar Perfil
              </Button>
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
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Confirmar Nova Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button onClick={handleChangePassword} disabled={savingPassword}>
                {savingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
