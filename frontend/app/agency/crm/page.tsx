"use client"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Mail, Phone, DollarSign, TrendingUp, Users, Target } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CRMPage() {
  const { user, loading, logout } = useAuth("agency_owner")

  const { data: crmData } = useApi(() => agencyApi.getCrm())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const leads = crmData?.data?.filter((c: any) => c.stage === "lead") || []
  const opportunities = crmData?.data?.filter((c: any) => ["qualified","proposal","negotiation"].includes(c.stage)) || []

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      new: "default",
      contacted: "secondary",
      qualified: "default",
      unqualified: "destructive",
      prospecting: "secondary",
      proposal: "default",
      negotiation: "default",
      won: "default",
      lost: "destructive",
    }
    return variants[status] || "outline"
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: "Novo",
      contacted: "Contatado",
      qualified: "Qualificado",
      unqualified: "Desqualificado",
      prospecting: "Prospecção",
      proposal: "Proposta",
      negotiation: "Negociação",
      won: "Ganho",
      lost: "Perdido",
    }
    return labels[status] || status
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="CRM" />

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Gestão de Vendas</h2>
            <p className="text-muted-foreground">Gerencie seus leads e oportunidades</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leads.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Leads Qualificados</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leads.filter((l) => l.status === "qualified").length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Oportunidades Ativas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {opportunities.filter((o) => ["prospecting", "proposal", "negotiation"].includes(o.status)).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Valor em Negociação</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {opportunities
                    .filter((o) => ["prospecting", "proposal", "negotiation"].includes(o.status))
                    .reduce((acc, o) => acc + o.value, 0)
                    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="leads" className="space-y-4">
            <TabsList>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">{leads.length} leads cadastrados</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Lead
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Lead</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" placeholder="Nome completo" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="email@exemplo.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" placeholder="(00) 00000-0000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" placeholder="Nome da empresa" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue="new">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Novo</SelectItem>
                            <SelectItem value="contacted">Contatado</SelectItem>
                            <SelectItem value="qualified">Qualificado</SelectItem>
                            <SelectItem value="unqualified">Desqualificado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">Salvar Lead</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(leads || []).map((lead) => (
                  <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{lead.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{lead.company}</p>
                        </div>
                        <Badge variant={getStatusBadge(lead.status)}>{getStatusLabel(lead.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {lead.phone}
                      </div>
                      <div className="pt-3 border-t">
                        <p className="text-xs font-semibold mb-2">Histórico de Atividades</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {(lead.logs || []).map((log) => (
                            <div key={log.id} className="text-xs text-muted-foreground">
                              <p>
                                <span className="font-medium">{log.user}</span> - {log.action}
                              </p>
                              <p className="text-[10px]">{(log.timestamp ? new Date(log.timestamp).toLocaleDateString("pt-BR") : "")}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-2 bg-transparent">
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">{opportunities.length} oportunidades cadastradas</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Oportunidade
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cadastrar Nova Oportunidade</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" placeholder="Título da oportunidade" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client">Nome do Cliente</Label>
                        <Input id="client" placeholder="Nome do cliente" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="value">Valor</Label>
                        <Input id="value" type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="opp-status">Status</Label>
                        <Select defaultValue="prospecting">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prospecting">Prospecção</SelectItem>
                            <SelectItem value="proposal">Proposta</SelectItem>
                            <SelectItem value="negotiation">Negociação</SelectItem>
                            <SelectItem value="won">Ganho</SelectItem>
                            <SelectItem value="lost">Perdido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="probability">Probabilidade (%)</Label>
                        <Input id="probability" type="number" min="0" max="100" placeholder="0-100" />
                      </div>
                      <Button className="w-full">Salvar Oportunidade</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunities.map((opp) => (
                  <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{opp.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{opp.clientName}</p>
                        </div>
                        <Badge variant={getStatusBadge(opp.status)}>{getStatusLabel(opp.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Valor</p>
                          <p className="text-xl font-bold">
                            {(opp.value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Probabilidade</p>
                          <p className="text-xl font-bold text-green-600">{opp.probability}%</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <p className="text-xs font-semibold mb-2">Histórico de Atividades</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {(opp.logs || []).map((log) => (
                            <div key={log.id} className="text-xs text-muted-foreground">
                              <p>
                                <span className="font-medium">{log.user}</span> - {log.action}
                              </p>
                              <p className="text-[10px]">{(log.timestamp ? new Date(log.timestamp).toLocaleDateString("pt-BR") : "")}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-2 bg-transparent">
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
