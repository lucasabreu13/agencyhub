"use client"
import { formatDate } from "@/lib/utils"

import { useState } from "react"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Plus, Search, Mail, Calendar, Clock, Shield, Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

type TeamMember = any

export default function UsersPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { data: usersData, refetch: refetchUsers } = useApi(() => agencyApi.getUsers())
  const teamMembers = usersData?.data || []

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "analyst" as string,
    customRole: "",
    permissions: {
      dashboard: true,
      clients: false,
      crm: false,
      campaigns: false,
      projects: false,
      kanban: false,
      financial: false,
      goals: false,
      reports: false,
      support: false,
      documents: false,
      users: false,
      settings: false,
    },
  })

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "agency_owner") {
    router.push("/unauthorized")
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    const newMember: TeamMember = {
      id: `tm${teamMembers.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.customRole || newUser.role,
      agencyId: "agency-1",
      permissions: newUser.permissions,
      status: "active",
      createdAt: new Date(),
    }
    refetchUsers()
    setIsAddDialogOpen(false)
    setNewUser({
      name: "",
      email: "",
      role: "analyst",
      customRole: "",
      permissions: {
        dashboard: true,
        clients: false,
        crm: false,
        campaigns: false,
        projects: false,
        kanban: false,
        financial: false,
        goals: false,
        reports: false,
        support: false,
        documents: false,
        users: false,
        settings: false,
      },
    })
  }

  const roleLabels = {
    owner: "Proprietário",
    admin: "Administrador",
    manager: "Gerente",
    analyst: "Analista",
    designer: "Designer",
  }

  const permissionLabels = {
    dashboard: "Dashboard",
    clients: "Clientes",
    crm: "CRM",
    campaigns: "Campanhas",
    projects: "Projetos",
    kanban: "Kanban",
    financial: "Financeiro",
    goals: "Metas",
    reports: "Relatórios",
    support: "Suporte",
    documents: "Documentos",
    users: "Usuários",
    settings: "Configurações",
  }

  const handlePermissionChange = (key: keyof typeof newUser.permissions) => {
    setNewUser({
      ...newUser,
      permissions: {
        ...newUser.permissions,
        [key]: !newUser.permissions[key],
      },
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AgencySidebar onLogout={handleLogout} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AgencyHeader user={user} title="Equipe" />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
                <p className="text-muted-foreground">Gerencie a equipe e permissões de acesso</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Cadastre um novo membro da equipe e defina suas permissões de acesso
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          placeholder="Digite o nome completo"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@exemplo.com"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customRole">Cargo</Label>
                        <Input
                          id="customRole"
                          placeholder="Ex: Gerente de Marketing, Analista de Dados, etc."
                          value={newUser.customRole}
                          onChange={(e) => setNewUser({ ...newUser, customRole: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Digite o cargo personalizado do colaborador</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Permissões de Acesso</Label>
                      <p className="text-sm text-muted-foreground">Selecione quais abas este usuário poderá acessar</p>
                      <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                        {Object.entries(permissionLabels).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={newUser.permissions[key as keyof typeof newUser.permissions]}
                              onCheckedChange={() => handlePermissionChange(key as keyof typeof newUser.permissions)}
                            />
                            <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email || !newUser.customRole}>
                        Cadastrar Usuário
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, email ou cargo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-lg font-semibold text-primary">
                                {member.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </span>
                            </div>
                            <div className="space-y-3 flex-1">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{member.name}</h3>
                                  <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                                    {roleLabels[member.role as keyof typeof roleLabels]}
                                  </Badge>
                                  {member.status === "active" && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      Ativo
                                    </Badge>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {member.email}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Desde {formatDate(member.createdAt)}
                                  </div>
                                  {member.lastLogin && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      Último acesso: {(member.lastLogin || 0).toLocaleString("pt-BR")}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Shield className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">Permissões:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(member.permissions)
                                    .filter(([_, hasPermission]) => hasPermission)
                                    .map(([permission]) => (
                                      <Badge key={permission} variant="outline" className="text-xs">
                                        {permissionLabels[permission as keyof typeof permissionLabels]}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {member.role !== "owner" && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:text-destructive bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredMembers.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
