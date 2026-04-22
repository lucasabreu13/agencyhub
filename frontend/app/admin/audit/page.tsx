"use client"

import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { adminApi } from "@/lib/api"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"
import { useState } from "react"
import { formatDate } from "@/lib/utils"

export default function AuditPage() {
  const { user, loading, logout } = useAuth("admin")
  const { data: auditData } = useApi(() => adminApi.getAudit())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Carregando...</div>

  const logs: any[] = auditData?.data || []
  const filtered = (logs || []).filter((log: any) => {
    const matchSearch = log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = filterType === "all" || log.type === filterType
    return matchSearch && matchType
  })

  const getIcon = (type: string) => {
    const map: any = {
      success: <CheckCircle className="h-4 w-4 text-green-500" />,
      error: <XCircle className="h-4 w-4 text-red-500" />,
      warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      info: <Info className="h-4 w-4 text-blue-500" />,
    }
    return map[type] || <Info className="h-4 w-4 text-blue-500" />
  }

  const getBadge = (type: string) => {
    const map: any = {
      success: <Badge className="bg-green-500">Sucesso</Badge>,
      error: <Badge variant="destructive">Erro</Badge>,
      warning: <Badge className="bg-yellow-500">Aviso</Badge>,
      info: <Badge className="bg-blue-500">Info</Badge>,
    }
    return map[type] || <Badge>{type}</Badge>
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Auditoria" />
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Log de Auditoria</h2>
            <p className="text-muted-foreground">Histórico de ações realizadas no sistema</p>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar logs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              {(filtered || []).length === 0 ? (
                <p className="p-6 text-center text-muted-foreground">Nenhum log encontrado.</p>
              ) : (
                <div className="divide-y">
                  {(filtered || []).map((log: any) => (
                    <div key={log.id} className="flex items-start gap-4 p-4">
                      <div className="mt-1">{getIcon(log.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{log.user}</span>
                          {getBadge(log.type)}
                        </div>
                        <p className="text-sm mt-0.5">{log.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        <p>{formatDate(log.timestamp)}</p>
                        {log.ip && <p>{log.ip}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
