"use client"
import { formatDate } from "@/lib/utils"

import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { clientApi } from "@/lib/api"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Search, File, FileSpreadsheet, FileImage, Calendar } from "lucide-react"
import { useState } from "react"

export default function ClientDocumentsPage() {
  const { user, loading, logout } = useAuth("agency_client")
  const { data: documentsData } = useApi(() => clientApi.getDocuments())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Carregando...</div>

  const documents = documentsData?.data || documentsData || []
  const filtered = (documents || []).filter((doc: any) => {
    const matchSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = filterType === "all" || doc.type === filterType
    return matchSearch && matchType
  })

  const getIcon = (type: string) => {
    const map: any = {
      contract: <FileText className="h-5 w-5 text-blue-500" />,
      report: <FileText className="h-5 w-5 text-purple-500" />,
      invoice: <FileText className="h-5 w-5 text-green-500" />,
      presentation: <FileSpreadsheet className="h-5 w-5 text-orange-500" />,
      image: <FileImage className="h-5 w-5 text-pink-500" />,
    }
    return map[type] || <File className="h-5 w-5 text-gray-500" />
  }

  const getTypeBadge = (type: string) => {
    const map: any = {
      contract: "Contrato",
      report: "Relatório",
      invoice: "Fatura",
      presentation: "Apresentação",
      other: "Outro",
    }
    return map[type] || type
  }

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <ClientHeader user={user} title="Documentos" />
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Documentos</h2>
            <p className="text-muted-foreground">Acesse seus contratos, relatórios e arquivos</p>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar documentos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="contract">Contratos</SelectItem>
                <SelectItem value="report">Relatórios</SelectItem>
                <SelectItem value="invoice">Faturas</SelectItem>
                <SelectItem value="presentation">Apresentações</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(filtered || []).length === 0 ? (
            <Card><CardContent className="p-12 text-center text-muted-foreground">Nenhum documento encontrado.</CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {(filtered || []).map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        {getIcon(doc.type)}
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">{getTypeBadge(doc.type)}</Badge>
                            {doc.size && <span>{doc.size}</span>}
                            {doc.uploadedAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />{formatDate(doc.uploadedAt)}
                              </span>
                            )}
                          </div>
                          {doc.description && <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
