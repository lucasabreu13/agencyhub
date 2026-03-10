"use client"

import { useAuth } from "@/hooks/use-auth"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Search, File, FileSpreadsheet, FileImage, Calendar, Filter } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Document = {
  id: string
  name: string
  type: "contract" | "report" | "invoice" | "presentation" | "other"
  size: string
  uploadedAt: Date
  uploadedBy: string
  description: string
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Contrato de Prestação de Serviços.pdf",
    type: "contract",
    size: "2.4 MB",
    uploadedAt: new Date(2025, 0, 3),
    uploadedBy: "Marketing Pro Agency",
    description: "Contrato de serviços de marketing digital",
  },
  {
    id: "2",
    name: "Relatório de Performance - Dezembro 2024.pdf",
    type: "report",
    size: "1.8 MB",
    uploadedAt: new Date(2025, 0, 1),
    uploadedBy: "Marketing Pro Agency",
    description: "Análise completa de performance das campanhas",
  },
  {
    id: "3",
    name: "Fatura Janeiro 2025.pdf",
    type: "invoice",
    size: "245 KB",
    uploadedAt: new Date(2024, 11, 28),
    uploadedBy: "Marketing Pro Agency",
    description: "Fatura de serviços do mês de janeiro",
  },
  {
    id: "4",
    name: "Estratégia de Conteúdo Q1 2025.pptx",
    type: "presentation",
    size: "5.2 MB",
    uploadedAt: new Date(2024, 11, 20),
    uploadedBy: "Marketing Pro Agency",
    description: "Planejamento estratégico para o primeiro trimestre",
  },
  {
    id: "5",
    name: "Relatório de Performance - Novembro 2024.pdf",
    type: "report",
    size: "1.6 MB",
    uploadedAt: new Date(2024, 11, 1),
    uploadedBy: "Marketing Pro Agency",
    description: "Análise completa de performance das campanhas",
  },
  {
    id: "6",
    name: "Guia de Marca e Identidade Visual.pdf",
    type: "other",
    size: "8.3 MB",
    uploadedAt: new Date(2024, 10, 15),
    uploadedBy: "Marketing Pro Agency",
    description: "Manual de aplicação da identidade visual",
  },
]

export default function ClientDocumentsPage() {
  const { user, loading, logout } = useAuth("agency_client")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || doc.type === filterType
    return matchesSearch && matchesType
  })

  const getDocumentIcon = (type: Document["type"]) => {
    switch (type) {
      case "contract":
        return <FileText className="h-8 w-8 text-blue-500" />
      case "report":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case "invoice":
        return <File className="h-8 w-8 text-orange-500" />
      case "presentation":
        return <FileImage className="h-8 w-8 text-purple-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const getDocumentTypeLabel = (type: Document["type"]) => {
    const labels = {
      contract: "Contrato",
      report: "Relatório",
      invoice: "Fatura",
      presentation: "Apresentação",
      other: "Outro",
    }
    return labels[type]
  }

  const getDocumentTypeColor = (type: Document["type"]) => {
    const colors = {
      contract: "bg-blue-100 text-blue-700",
      report: "bg-green-100 text-green-700",
      invoice: "bg-orange-100 text-orange-700",
      presentation: "bg-purple-100 text-purple-700",
      other: "bg-gray-100 text-gray-700",
    }
    return colors[type]
  }

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <ClientHeader user={user} title="Documentos" />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold">Documentos</h2>
            <p className="text-muted-foreground mt-1">
              Acesse contratos, relatórios e documentos compartilhados pela sua agência
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDocuments.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Contratos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDocuments.filter((d) => d.type === "contract").length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDocuments.filter((d) => d.type === "report").length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Faturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDocuments.filter((d) => d.type === "invoice").length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="contract">Contratos</SelectItem>
                      <SelectItem value="report">Relatórios</SelectItem>
                      <SelectItem value="invoice">Faturas</SelectItem>
                      <SelectItem value="presentation">Apresentações</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>Seus Documentos</CardTitle>
              <CardDescription>
                {filteredDocuments.length}{" "}
                {filteredDocuments.length === 1 ? "documento encontrado" : "documentos encontrados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum documento encontrado</p>
                  </div>
                ) : (
                  filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">{getDocumentIcon(doc.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{doc.name}</h3>
                          <Badge className={getDocumentTypeColor(doc.type)} variant="secondary">
                            {getDocumentTypeLabel(doc.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {doc.uploadedAt.toLocaleDateString("pt-BR")}
                          </span>
                          <span>{doc.size}</span>
                          <span>Por: {doc.uploadedBy}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
