"use client"

import { useAuth } from "@/hooks/use-auth"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, DollarSign, Calendar, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function ClientFinancialPage() {
  const { user, loading, logout } = useAuth("agency_client")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  // Mock invoices from agency
  const invoices = [
    {
      id: "1",
      invoiceNumber: "NF-2025-001",
      description: "Serviços de Marketing - Janeiro 2025",
      issueDate: new Date(2025, 0, 5),
      dueDate: new Date(2025, 0, 15),
      amount: 5000,
      status: "pending" as const,
    },
    {
      id: "2",
      invoiceNumber: "NF-2024-012",
      description: "Serviços de Marketing - Dezembro 2024",
      issueDate: new Date(2024, 11, 5),
      dueDate: new Date(2024, 11, 15),
      amount: 5000,
      status: "paid" as const,
    },
    {
      id: "3",
      invoiceNumber: "NF-2024-011",
      description: "Serviços de Marketing - Novembro 2024",
      issueDate: new Date(2024, 10, 5),
      dueDate: new Date(2024, 10, 15),
      amount: 5000,
      status: "paid" as const,
    },
  ]

  const pendingInvoices = invoices.filter((i) => i.status === "pending")
  const totalPending = pendingInvoices.reduce((acc, i) => acc + i.amount, 0)
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((acc, i) => acc + i.amount, 0)

  const handlePayment = () => {
    alert("Redirecionando para pagamento seguro...")
    // Here would integrate with payment gateway
  }

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <ClientHeader user={user} title="Financeiro" />

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Pagamentos</h2>
            <p className="text-muted-foreground">Gerencie os pagamentos da sua agência</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingInvoices.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPending.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {totalPaid.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Últimos 12 meses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pendingInvoices.length > 0
                    ? pendingInvoices[0].(typeof dueDate === "string" ? new Date(dueDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : dueDate instanceof Date ? dueDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "")
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingInvoices.length > 0 ? pendingInvoices[0].invoiceNumber : "Nenhuma fatura pendente"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
              <CardDescription>Histórico de pagamentos à agência</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>{invoice.(typeof issueDate === "string" ? new Date(issueDate).toLocaleDateString("pt-BR") : issueDate instanceof Date ? issueDate.toLocaleDateString("pt-BR") : "")}</TableCell>
                      <TableCell>{invoice.(typeof dueDate === "string" ? new Date(dueDate).toLocaleDateString("pt-BR") : dueDate instanceof Date ? dueDate.toLocaleDateString("pt-BR") : "")}</TableCell>
                      <TableCell className="font-semibold">
                        {invoice.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                          {invoice.status === "paid" ? "Pago" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status === "pending" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedInvoice(invoice.id)}>
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Pagar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Realizar Pagamento</DialogTitle>
                                  <DialogDescription>Pagamento da fatura {invoice.invoiceNumber}</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Valor</Label>
                                    <div className="text-2xl font-bold">
                                      {invoice.amount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      })}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Vencimento</Label>
                                    <div className="text-lg">{invoice.(typeof dueDate === "string" ? new Date(dueDate).toLocaleDateString("pt-BR") : dueDate instanceof Date ? dueDate.toLocaleDateString("pt-BR") : "")}</div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="payment-method">Forma de Pagamento</Label>
                                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                      <SelectTrigger id="payment-method">
                                        <SelectValue placeholder="Selecione..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="credit">Cartão de Crédito</SelectItem>
                                        <SelectItem value="debit">Cartão de Débito</SelectItem>
                                        <SelectItem value="pix">PIX</SelectItem>
                                        <SelectItem value="boleto">Boleto Bancário</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <Button className="w-full" onClick={handlePayment} disabled={!paymentMethod}>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Confirmar Pagamento
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
