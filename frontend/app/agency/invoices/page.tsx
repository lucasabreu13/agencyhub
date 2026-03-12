"use client"
import { useApi } from "@/hooks/use-api"
import { agencyApi } from "@/lib/api"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Download, Search, Calendar, DollarSign } from "lucide-react"

export default function InvoicesPage() {
  const { user, loading } = useAuth("agency_owner")
  const [searchInvoice, setSearchInvoice] = useState("")
  const [isEmitDialogOpen, setIsEmitDialogOpen] = useState(false)

  const [newInvoice, setNewInvoice] = useState({
    client: "",
    value: "",
    description: "",
    dueDate: "",
    items: "",
  })

  const { data: invoicesData, refetch: refetchInvoices } = useApi(() => agencyApi.getInvoices())

  const allInvoices = invoicesData?.data || []
  const filteredInvoices = allInvoices.filter(
    (inv: any) =>
      (inv.number || "").toLowerCase().includes(searchInvoice.toLowerCase()) ||
      (inv.clientId || "").toLowerCase().includes(searchInvoice.toLowerCase()),
  )

  const handleEmitInvoice = () => {
    console.log("Emitindo nota fiscal:", newInvoice)
    setIsEmitDialogOpen(false)
    setNewInvoice({ client: "", value: "", description: "", dueDate: "", items: "" })
  }

  if (loading) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Notas Fiscais</h1>
                <p className="text-muted-foreground">Gerencie e emita notas fiscais para seus clientes</p>
              </div>
              <Dialog open={isEmitDialogOpen} onOpenChange={setIsEmitDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Emitir Nota Fiscal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Emitir Nova Nota Fiscal</DialogTitle>
                    <DialogDescription>Preencha os dados para emitir uma nova nota fiscal</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Cliente</Label>
                      <Select
                        value={newInvoice.client}
                        onValueChange={(value) => setNewInvoice({ ...newInvoice, client: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Tech Solutions</SelectItem>
                          <SelectItem value="marketing">Marketing Pro</SelectItem>
                          <SelectItem value="ecommerce">E-commerce Plus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="value">Valor (R$)</Label>
                        <Input
                          id="value"
                          type="number"
                          placeholder="0.00"
                          value={newInvoice.value}
                          onChange={(e) => setNewInvoice({ ...newInvoice, value: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Data de Vencimento</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newInvoice.dueDate}
                          onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="items">Itens/Serviços</Label>
                      <Textarea
                        id="items"
                        placeholder="Descreva os itens ou serviços..."
                        value={newInvoice.items}
                        onChange={(e) => setNewInvoice({ ...newInvoice, items: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Observações</Label>
                      <Textarea
                        id="description"
                        placeholder="Observações adicionais..."
                        value={newInvoice.description}
                        onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEmitDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleEmitInvoice}>Emitir Nota Fiscal</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Emitido</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 19.000</div>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">NFs Emitidas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Requer atenção</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Notas Fiscais Emitidas</CardTitle>
                    <CardDescription>Histórico completo de notas fiscais</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Buscar nota fiscal..."
                        value={searchInvoice}
                        onChange={(e) => setSearchInvoice(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-muted-foreground">{invoice.client}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-medium">R$ {invoice.value.toLocaleString("pt-BR")}</div>
                          <div className="text-sm text-muted-foreground">{invoice.items} itens</div>
                        </div>
                        <div className="text-sm text-muted-foreground w-24">
                          {new Date(invoice.date).toLocaleDateString("pt-BR")}
                        </div>
                        <Badge
                          variant={
                            invoice.status === "Paga"
                              ? "default"
                              : invoice.status === "Pendente"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
