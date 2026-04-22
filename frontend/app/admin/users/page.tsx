"use client"
import { formatDate } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { adminApi } from "@/lib/api"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Plus, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const adminPermissions = [
  { id: "users", label: "Gerenciar Usuários" },
  { id: "agencies", label: "Gerenciar Agências" },
  { id: "financial", label: "Visualizar Financeiro" },
  { id: "tickets", label: "Suporte e Tickets" },
  { id: "settings", label: "Configurações" },
  { id: "audit", label: "Logs e Auditoria" },
]

export default function AdminUsersPage() {
  const { user, loading, logout } = useAuth("admin")
  const { data: usersData } = useApi(() => adminApi.getUsers())
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", permissions: [] as string[] })

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const filteredUsers = (usersData?.data || []).filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    console.log("Novo usuário admin:", newUser)
    setShowAddDialog(false)
    setNewUser({ name: "", email: "", role: "", permissions: [] })
  }

  const togglePermission = (permissionId: string) => {
    setNewUser((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Usuários Administrativos" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gerenciar Usuários Administrativos</h2>
              <p className="text-muted-foreground">Usuários com acesso ao portal administrativo da plataforma</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Admin
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4">
            {filteredUsers.map((u) => {
              const initials = u.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

              return (
                <Card key={u.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{u.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(u.permissions || []).map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {adminPermissions.find((p) => p.id === perm)?.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant={u.role === "Super Admin" ? "destructive" : "default"}>{u.role}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Desde {formatDate(u.createdAt)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Gerenciar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Administrador</DialogTitle>
            <DialogDescription>Cadastre um novo usuário com acesso ao portal administrativo</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Nome do administrador"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@agencyhub.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                placeholder="Ex: Admin, Suporte, Analista"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Permissões de Acesso</Label>
              <div className="border rounded-lg p-4 space-y-3">
                {adminPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={newUser.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selecione as áreas que este usuário poderá acessar no portal administrativo
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddUser} className="flex-1">
                Adicionar Administrador
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
