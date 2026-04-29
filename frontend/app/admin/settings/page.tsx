"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Package, Check, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface PlanConfig {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  active: boolean
}

export default function AdminSettingsPage() {
  const { user, loading, logout } = useAuth("admin")
  const { toast } = useToast()

  const [platformName, setPlatformName] = useState("Spherum")
  const [supportEmail, setSupportEmail] = useState("support@agencyhub.com")
  const [platformUrl, setPlatformUrl] = useState("https://app.agencyhub.com")
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [allowTrial, setAllowTrial] = useState(true)
  const [trialDays, setTrialDays] = useState("14")
  const [require2fa, setRequire2fa] = useState(true)
  const [auditLogs, setAuditLogs] = useState(true)
  const [notifyNewAgency, setNotifyNewAgency] = useState(true)
  const [notifyPayment, setNotifyPayment] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [savingGeneral, setSavingGeneral] = useState(false)
  const [savingRegistration, setSavingRegistration] = useState(false)
  const [savingSecurity, setSavingSecurity] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [savingPlan, setSavingPlan] = useState<string | null>(null)

  const [plans, setPlans] = useState<PlanConfig[]>([
    {
      id: "starter",
      name: "Starter",
      price: 197,
      description: "Ideal para agências iniciantes",
      features: ["Até 5 clientes", "5 campanhas ativas", "Relatórios básicos", "Suporte por email"],
      active: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 397,
      description: "Para agências em crescimento",
      features: [
        "Até 20 clientes",
        "Campanhas ilimitadas",
        "Relatórios avançados",
        "Suporte prioritário",
        "API de integração",
      ],
      active: true,
    },
    {
      id: "scale",
      name: "Scale",
      price: 797,
      description: "Solução completa para grandes agências",
      features: [
        "Clientes ilimitados",
        "Campanhas ilimitadas",
        "Relatórios personalizados",
        "Suporte 24/7",
        "API completa",
        "White label",
      ],
      active: true,
    },
  ])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const updatePlanField = (id: string, field: keyof PlanConfig, value: any) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const handleSaveGeneral = async () => {
    setSavingGeneral(true)
    await new Promise((r) => setTimeout(r, 400))
    setSavingGeneral(false)
    toast({ title: "Configurações salvas", description: "Informações da plataforma atualizadas." })
  }

  const handleSaveRegistration = async () => {
    setSavingRegistration(true)
    await new Promise((r) => setTimeout(r, 400))
    setSavingRegistration(false)
    toast({ title: "Configurações salvas", description: "Configurações de registro atualizadas." })
  }

  const handleSaveSecurity = async () => {
    setSavingSecurity(true)
    await new Promise((r) => setTimeout(r, 400))
    setSavingSecurity(false)
    toast({ title: "Segurança salva", description: "Configurações de segurança atualizadas." })
  }

  const handleSaveNotifications = async () => {
    setSavingNotifications(true)
    await new Promise((r) => setTimeout(r, 400))
    setSavingNotifications(false)
    toast({ title: "Notificações salvas", description: "Preferências de notificação atualizadas." })
  }

  const handleSavePlan = async (planId: string) => {
    setSavingPlan(planId)
    await new Promise((r) => setTimeout(r, 400))
    setSavingPlan(null)
    toast({ title: "Plano atualizado", description: `Plano ${plans.find((p) => p.id === planId)?.name} salvo.` })
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Configurações" />

        <div className="p-6 space-y-6 max-w-6xl">
          <div>
            <h2 className="text-2xl font-bold">Configurações da Plataforma</h2>
            <p className="text-muted-foreground">Gerencie as configurações globais</p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="plans">Planos</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Plataforma</CardTitle>
                  <CardDescription>Configurações básicas do Spherum</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome da Plataforma</Label>
                    <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Email de Suporte</Label>
                    <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} type="email" />
                  </div>

                  <div className="space-y-2">
                    <Label>URL da Plataforma</Label>
                    <Input value={platformUrl} onChange={(e) => setPlatformUrl(e.target.value)} />
                  </div>

                  <Button onClick={handleSaveGeneral} disabled={savingGeneral}>
                    {savingGeneral && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Registro</CardTitle>
                  <CardDescription>Controle de novas agências</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Permitir Novos Registros</Label>
                      <p className="text-sm text-muted-foreground">Habilita ou desabilita registro de novas agências</p>
                    </div>
                    <Switch checked={allowRegistration} onCheckedChange={setAllowRegistration} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Período de Trial</Label>
                      <p className="text-sm text-muted-foreground">Permite período de teste gratuito</p>
                    </div>
                    <Switch checked={allowTrial} onCheckedChange={setAllowTrial} />
                  </div>

                  <div className="space-y-2">
                    <Label>Dias de Trial</Label>
                    <Input
                      type="number"
                      value={trialDays}
                      onChange={(e) => setTrialDays(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSaveRegistration} disabled={savingRegistration}>
                    {savingRegistration && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plans" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Gerenciar Planos de Serviço
                  </CardTitle>
                  <CardDescription>Configure os planos disponíveis para as agências</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {plans.map((plan) => (
                    <Card key={plan.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                              {plan.name}
                              {plan.active && <Badge variant="default">Ativo</Badge>}
                            </CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="flex items-start gap-1">
                              <span className="text-sm">R$</span>
                              <span className="text-3xl font-bold">{plan.price}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">/mês</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Nome do Plano</Label>
                          <Input
                            value={plan.name}
                            onChange={(e) => updatePlanField(plan.id, "name", e.target.value)}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Preço Mensal (R$)</Label>
                            <Input
                              type="number"
                              value={plan.price}
                              onChange={(e) => updatePlanField(plan.id, "price", Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <div className="flex items-center gap-2 h-10">
                              <Switch
                                checked={plan.active}
                                onCheckedChange={(v) => updatePlanField(plan.id, "active", v)}
                              />
                              <span className="text-sm">{plan.active ? "Ativo" : "Inativo"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <Input
                            value={plan.description}
                            onChange={(e) => updatePlanField(plan.id, "description", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Recursos Incluídos</Label>
                          <Textarea
                            placeholder="Um recurso por linha"
                            value={plan.features.join("\n")}
                            onChange={(e) =>
                              updatePlanField(plan.id, "features", e.target.value.split("\n").filter(Boolean))
                            }
                            rows={6}
                          />
                          <p className="text-xs text-muted-foreground">Insira um recurso por linha</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Pré-visualização dos Recursos</Label>
                          <div className="space-y-2 p-4 bg-muted rounded-lg">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => handleSavePlan(plan.id)}
                          disabled={savingPlan === plan.id}
                        >
                          {savingPlan === plan.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Salvar Alterações no Plano
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Configurações de segurança da plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-muted-foreground">Exigir 2FA para administradores</p>
                    </div>
                    <Switch checked={require2fa} onCheckedChange={setRequire2fa} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Logs de Auditoria</Label>
                      <p className="text-sm text-muted-foreground">Registrar todas as ações administrativas</p>
                    </div>
                    <Switch checked={auditLogs} onCheckedChange={setAuditLogs} />
                  </div>

                  <Button onClick={handleSaveSecurity} disabled={savingSecurity}>
                    {savingSecurity && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Salvar Segurança
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>Configure alertas do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Nova Agência</Label>
                      <p className="text-sm text-muted-foreground">Receber email quando nova agência se cadastrar</p>
                    </div>
                    <Switch checked={notifyNewAgency} onCheckedChange={setNotifyNewAgency} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Pagamento</Label>
                      <p className="text-sm text-muted-foreground">Notificações sobre pagamentos e renovações</p>
                    </div>
                    <Switch checked={notifyPayment} onCheckedChange={setNotifyPayment} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatório Semanal</Label>
                      <p className="text-sm text-muted-foreground">Resumo semanal de métricas da plataforma</p>
                    </div>
                    <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
                  </div>

                  <Button onClick={handleSaveNotifications} disabled={savingNotifications}>
                    {savingNotifications && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Salvar Notificações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
