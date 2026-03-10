"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"

const mockAuditLogs = [
  {
    id: "1",
    timestamp: new Date(2025, 0, 5, 14, 32),
    user: "João Silva (Admin)",
    action: "Criou nova agência",
    details: "Agência 'Marketing Pro' foi criada com plano Pro",
    type: "success",
    ip: "192.168.1.10",
  },
  {
    id: "2",
    timestamp: new Date(2025, 0, 5, 13, 15),
    user: "Maria Santos (Marketing Pro)",
    action: "Login realizado",
    details: "Login bem-sucedido no portal da agência",
    type: "info",
    ip: "192.168.1.45",
  },
  {
    id: "3",
    timestamp: new Date(2025, 0, 5, 11, 20),
    user: "Carlos Oliveira (Digital Agency)",
    action: "Tentativa de acesso negada",
    details: "Usuário tentou acessar área sem permissão",
    type: "warning",
    ip: "192.168.1.89",
  },
  {
    id: "4",
    timestamp: new Date(2025, 0, 5, 10, 5),
    user: "Admin Principal",
    action: "Alterou plano de agência",
    details: "Agência 'Digital Agency' upgrade de Basic para Pro",
    type: "success",
    ip: "192.168.1.10",
  },
  {
    id: "5",
    timestamp: new Date(2025, 0, 5, 9, 47),
    user: "Sistema",
    action: "Falha no pagamento",
    details: "Pagamento da agência 'Marketing Solutions' foi recusado",
    type: "error",
    ip: "Sistema",
  },
  {
    id: "6",
    timestamp: new Date(2025, 0, 4, 16, 30),
    user: "Ana Costa (Digital Agency)",
    action: "Criou novo cliente",
    details: "Cliente 'Empresa XYZ' foi adicionado",
    type: "success",
    ip: "192.168.1.67",
  },
  {
    id: "7",
    timestamp: new Date(2025, 0, 4, 15, 12),
    user: "Pedro Santos (Marketing Pro)",
    action: "Exportou relatório",
    details: "Relatório financeiro de Dezembro/2024",
    type: "info",
    ip: "192.168.1.45",
  },
  {
    id: "8",
    timestamp: new Date(2025, 0, 4, 14, 8),
    user: "Sistema",
    action: "Backup automático",
    details: "Backup diário do banco de dados concluído",
    type: "success",
    ip: "Sistema",
  },
]

export default function AdminAuditPage() {
  const { user, loading, logout } = useAuth("admin")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || log.type === filterType

    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-600">Sucesso</Badge>
      case "error":
        return <Badge variant="destructive">Erro</Badge>
      case "warning":
        return <Badge className="bg-yellow-600">Aviso</Badge>
      default:
        return <Badge variant="secondary">Info</Badge>
    }
  }

  const stats = {
    total: mockAuditLogs.length,
    success: mockAuditLogs.filter((l) => l.type === "success").length,
    errors: mockAuditLogs.filter((l) => l.type === "error").length,
    warnings: mockAuditLogs.filter((l) => l.type === "warning").length,
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Logs e Auditoria" />

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Logs e Auditoria</h2>
            <p className="text-muted-foreground">Acompanhe todas as atividades e eventos da plataforma</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">Últimas 48 horas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Sucessos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                <p className="text-xs text-muted-foreground mt-1">Operações concluídas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Erros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                <p className="text-xs text-muted-foreground mt-1">Requer atenção</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avisos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                <p className="text-xs text-muted-foreground mt-1">Para revisão</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário, ação ou detalhes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="success">Sucessos</SelectItem>
                <SelectItem value="error">Erros</SelectItem>
                <SelectItem value="warning">Avisos</SelectItem>
                <SelectItem value="info">Informativos</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getTypeIcon(log.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{log.action}</h4>
                              {getTypeBadge(log.type)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-nowrap">
                            {log.timestamp.toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>👤 {log.user}</span>
                          <span>🌐 IP: {log.ip}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
