"use client"
import { formatDate } from "@/lib/utils"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AgencyHeader } from "@/components/agency/header"
import { AgencySidebar } from "@/components/agency/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  FolderPlus,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Film,
  File,
  Download,
  Trash2,
  Search,
  Grid3x3,
  List,
  Cloud,
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: "pdf" | "image" | "spreadsheet" | "video" | "other"
  size: string
  folder: string
  uploadedAt: Date
  uploadedBy: string
}

interface Folder {
  id: string
  name: string
  documentCount: number
  color: string
}

export default function AgencyDocumentsPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [folders] = useState<Folder[]>([
    { id: "contracts", name: "Contratos", documentCount: 12, color: "bg-blue-500" },
    { id: "proposals", name: "Propostas", documentCount: 8, color: "bg-green-500" },
    { id: "reports", name: "Relatórios", documentCount: 24, color: "bg-purple-500" },
    { id: "creative", name: "Criativos", documentCount: 45, color: "bg-orange-500" },
    { id: "client-docs", name: "Docs Clientes", documentCount: 18, color: "bg-pink-500" },
  ])

  const [documents] = useState<Document[]>([
    {
      id: "d1",
      name: "Contrato TechStart 2026.pdf",
      type: "pdf",
      size: "2.4 MB",
      folder: "contracts",
      uploadedAt: new Date("2026-01-03"),
      uploadedBy: "João Silva",
    },
    {
      id: "d2",
      name: "Proposta Fashion Boutique.pdf",
      type: "pdf",
      size: "1.8 MB",
      folder: "proposals",
      uploadedAt: new Date("2026-01-02"),
      uploadedBy: "Maria Santos",
    },
    {
      id: "d3",
      name: "Banner Campanha Verão.png",
      type: "image",
      size: "4.2 MB",
      folder: "creative",
      uploadedAt: new Date("2026-01-04"),
      uploadedBy: "Carlos Designer",
    },
    {
      id: "d4",
      name: "Relatório Mensal - Dezembro.xlsx",
      type: "spreadsheet",
      size: "890 KB",
      folder: "reports",
      uploadedAt: new Date("2026-01-01"),
      uploadedBy: "Ana Silva",
    },
    {
      id: "d5",
      name: "Video Apresentacao Cliente.mp4",
      type: "video",
      size: "25.6 MB",
      folder: "proposals",
      uploadedAt: new Date("2025-12-30"),
      uploadedBy: "João Silva",
    },
  ])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>
  }

  if (!user || user.role !== "agency_owner") {
    return null
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-blue-500" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case "video":
        return <Film className="h-8 w-8 text-purple-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesFolder = selectedFolder === "all" || doc.folder === selectedFolder
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })

  const totalSize = documents.reduce((acc, doc) => {
    const size = Number.parseFloat(doc.size)
    return acc + size
  }, 0)

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyHeader user={user} title="Documentos" />

        <div className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Documentos</h1>
                <p className="text-muted-foreground">Gerencie e organize seus arquivos</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Cloud className="mr-2 h-4 w-4" />
                  Conectar Google Drive
                </Button>
                <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Nova Pasta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Nova Pasta</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="folder-name">Nome da Pasta</Label>
                        <Input id="folder-name" placeholder="Ex: Campanhas 2026" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowNewFolder(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => setShowNewFolder(false)}>Criar Pasta</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showUpload} onOpenChange={setShowUpload}>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Fazer Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Fazer Upload de Arquivo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="folder-select">Pasta de Destino</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma pasta" />
                          </SelectTrigger>
                          <SelectContent>
                            {folders.map((folder) => (
                              <SelectItem key={folder.id} value={folder.id}>
                                {folder.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="file-upload">Arquivo</Label>
                        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 transition-colors hover:border-muted-foreground/50">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Clique para selecionar ou arraste arquivos aqui
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, imagens, vídeos até 100MB</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowUpload(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => setShowUpload(false)}>Fazer Upload</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              {folders.map((folder) => (
                <Card
                  key={folder.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${folder.color}`} />
                      <CardTitle className="text-sm">{folder.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{folder.documentCount}</p>
                    <p className="text-xs text-muted-foreground">documentos</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Arquivos</CardTitle>
                    <CardDescription>
                      {filteredDocuments.length} arquivos • {totalSize.toFixed(1)} MB total
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar arquivos..."
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Pastas</SelectItem>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    >
                      {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredDocuments.length === 0 ? (
                  <div className="py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Nenhum arquivo encontrado</p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid gap-4 md:grid-cols-4">
                    {filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="group cursor-pointer transition-colors hover:bg-muted/50">
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            {getFileIcon(doc.type)}
                            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <h4 className="mb-1 truncate text-sm font-semibold" title={doc.name}>
                            {doc.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {doc.formatDate(uploadedAt)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <h4 className="font-semibold">{doc.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} • Enviado por {doc.uploadedBy} em {doc.formatDate(uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Integração com Google Drive
                </CardTitle>
                <CardDescription>
                  Conecte sua conta do Google Drive para sincronizar arquivos automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm">Sincronize seus documentos com o Google Drive e acesse de qualquer lugar</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Sincronização automática</Badge>
                      <Badge variant="outline">Backup em nuvem</Badge>
                      <Badge variant="outline">Compartilhamento fácil</Badge>
                    </div>
                  </div>
                  <Button>Conectar Agora</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
