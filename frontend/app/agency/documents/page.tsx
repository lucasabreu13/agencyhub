"use client"
import { formatDate } from "@/lib/utils"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { agencyApi } from "@/lib/api"
import { AgencyHeader } from "@/components/agency/header"
import { AgencySidebar } from "@/components/agency/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, ImageIcon, FileSpreadsheet, Film, File, Download, Trash2, Search, Grid3x3, List, Upload } from "lucide-react"

export default function AgencyDocumentsPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const { data: documentsData } = useApi(() => agencyApi.getDocuments())
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>
  if (!user) return null

  const documents = documentsData?.data || documentsData || []
  const filtered = (documents || []).filter((d: any) =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getIcon = (type: string) => {
    const map: any = {
      pdf: <FileText className="h-8 w-8 text-red-500" />,
      image: <ImageIcon className="h-8 w-8 text-blue-500" />,
      spreadsheet: <FileSpreadsheet className="h-8 w-8 text-green-500" />,
      video: <Film className="h-8 w-8 text-purple-500" />,
    }
    return map[type] || <File className="h-8 w-8 text-gray-500" />
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Documentos" />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Documentos</h2>
              <p className="text-muted-foreground">Gerencie os arquivos da agência</p>
            </div>
            <Button><Upload className="h-4 w-4 mr-2" />Upload</Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar documentos..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-1">
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}><Grid3x3 className="h-4 w-4" /></Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
            </div>
          </div>

          {(filtered || []).length === 0 ? (
            <Card><CardContent className="p-12 text-center text-muted-foreground">Nenhum documento encontrado.</CardContent></Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(filtered || []).map((doc: any) => (
                <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-2">
                      {getIcon(doc.type)}
                      <p className="text-sm font-medium truncate w-full">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {(filtered || []).map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        {getIcon(doc.type)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size} · {formatDate(doc.uploadedAt)} · Por: {doc.uploadedBy}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
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
