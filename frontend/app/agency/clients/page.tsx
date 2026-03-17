"use client"
import { formatDate } from "@/lib/utils"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { agencyApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Mail, Building2, Search, FileText, Upload, Calendar, DollarSign } from "lucide-react"
import { useState } from "react"

export default function ClientsPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showNewClientDialog, setShowNewClientDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const [newClient, setNewClient] = useState({
    companyName: "",
    email: "",
    phone: "",
    cnpj: "",
    contract: null as File | null,
  })

  const { data: clientsData, refetch } = useApi(() => agencyApi.getClients())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const clients = clientsData?.data || []

  const filteredClients = (clients || []).filter((client) => {
    const search = searchTerm.toLowerCase()
    return (
      client.company.toLowerCase().includes(search) ||
      client.name.toLowerCase().includes(search) ||
      client.email.toLowerCase().includes(search) ||
      (client.id && client.id.toLowerCase().includes(search))
    )
  })

  const handleCreateClient = async () => {
    try {
      await agencyApi.createClient({
        name: newClient.companyName,
        email: newClient.email,
        phone: newClient.phone,
        company: newClient.companyName,
      })
      refetch()
      setShowNewClientDialog(false)
      setNewClient({ companyName: "", email: "", phone: "", cnpj: "", contract: null })
    } catch (e: any) {
      alert(e?.message || "Erro ao criar cliente")
    }
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Clientes" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gerenciar Clientes</h2>
              <p className="text-muted-foreground">Visualize e gerencie todos os seus clientes</p>
            </div>
            <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                  <DialogDescription>Preencha os dados do cliente para cadastrá-lo no sistema</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      placeholder="Ex: TechCorp Marketing Ltda"
                      value={newClient.companyName}
                      onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contato@empresa.com"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={newClient.cnpj}
                      onChange={(e) => setNewClient({ ...newClient, cnpj: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract">Anexar Contrato</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="contract"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setNewClient({ ...newClient, contract: e.target.files?.[0] || null })}
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Formatos aceitos: PDF, DOC, DOCX</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateClient}>Cadastrar Cliente</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Pesquisar por nome, empresa, e-mail ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {(filteredClients || []).length} {(filteredClients || []).length === 1 ? "cliente encontrado" : "clientes encontrados"}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredClients || []).map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{client.company}</CardTitle>
                        <p className="text-sm text-muted-foreground">{client.name}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        client.status === "active" ? "default" : client.status === "paused" ? "secondary" : "outline"
                      }
                    >
                      {client.status === "active" ? "Ativo" : client.status === "paused" ? "Pausado" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Orçamento Mensal</p>
                    <p className="text-lg font-bold">
                      {(client.monthlyBudget || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cliente desde</p>
                    <p className="text-sm">{client.formatDate(startDate)}</p>
                  </div>
                  <Dialog
                    open={showDetailsDialog && selectedClient?.id === client.id}
                    onOpenChange={(open) => {
                      setShowDetailsDialog(open)
                      if (!open) setSelectedClient(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-2 bg-transparent"
                        onClick={() => setSelectedClient(client)}
                      >
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <Building2 className="h-6 w-6 text-primary" />
                          {client.company}
                        </DialogTitle>
                        <DialogDescription>Informações detalhadas do cliente</DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="info" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="info">Informações</TabsTrigger>
                          <TabsTrigger value="contracts">Gestão de Contratos</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info" className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Nome do Contato</p>
                              <p className="text-base">{client.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                              <p className="text-base">{client.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                              <p className="text-base">(11) 98765-4321</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                              <p className="text-base">12.345.678/0001-90</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Status</p>
                              <Badge
                                variant={
                                  client.status === "active"
                                    ? "default"
                                    : client.status === "paused"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {client.status === "active"
                                  ? "Ativo"
                                  : client.status === "paused"
                                    ? "Pausado"
                                    : "Inativo"}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Cliente desde</p>
                              <p className="text-base">{client.formatDate(startDate)}</p>
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Orçamento Mensal</p>
                            <p className="text-2xl font-bold">
                              {(client.monthlyBudget || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </p>
                          </div>
                        </TabsContent>
                        <TabsContent value="contracts" className="space-y-4 mt-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">Contrato Atual</h3>
                              <Button size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Novo Upload
                              </Button>
                            </div>
                            <Card>
                              <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-8 w-8 text-primary" />
                                  <div className="flex-1">
                                    <p className="font-medium">Contrato_Prestacao_Servicos.pdf</p>
                                    <p className="text-sm text-muted-foreground">Assinado em 15/01/2025</p>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Download
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Data de Renovação</p>
                                      <p className="text-sm font-medium">15/01/2026</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Valor Mensal</p>
                                      <p className="text-sm font-medium">
                                        {(client.monthlyBudget || 0).toLocaleString("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Status do Contrato</p>
                                    <Badge variant="default" className="mt-1">
                                      Ativo
                                    </Badge>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Editar Contrato
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                            <div>
                              <h4 className="text-sm font-medium mb-3">Histórico de Contratos</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Contrato_2024.pdf</p>
                                      <p className="text-xs text-muted-foreground">15/01/2024 - 14/01/2025</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">Encerrado</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>

          {(filteredClients || []).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum cliente encontrado com os critérios de pesquisa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
