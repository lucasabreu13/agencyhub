"use client"
import { formatDate } from "@/lib/utils"

import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { clientApi } from "@/lib/api"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, DollarSign, Calendar, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ClientFinancialPage() {
  const { user, loading, logout } = useAuth("agency_client")
  const { data: financialData } = useApi(() => clientApi.getFinancial())

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Carregando...</div>

  const invoices = financialData?.invoices || financialData?.data || []
  const summary = financialData?.summary || {}

  const pending = invoices.filter((i: any) => i.status === "pending")
  const paid = invoices.filter((i: any) => i.status === "paid")
  const totalPaid = paid.reduce((acc: number, i: any) => acc + (i.amount || 0), 0)
  const totalPending = pending.reduce((acc: number, i: any) => acc + (i.amount || 0), 0)

  const getStatusBadge = (status: string) => {
    const map: any = {
      paid: <Badge className="bg-green-500">Pago</Badge>,
      pending: <Badge className="bg-yellow-500">Pendente</Badge>,
      overdue: <Badge variant="destructive">Atrasado</Badge>,
      cancelled: <Badge variant="outline">Cancelado</Badge>,
    }
    return map[status] || <Badge>{status}</Badge>
  }

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <ClientHeader user={user} title="Financeiro" />
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Financeiro</h2>
            <p className="text-muted-foreground">Acompanhe suas faturas e pagamentos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {(totalPaid || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <p className="text-xs text-muted-foreground">{paid.length} faturas pagas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pendente</CardTitle>
                <CreditCard className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {(totalPending || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <p className="text-xs text-muted-foreground">{pending.length} faturas pendentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pending.length > 0 ? formatDate(pending[0].dueDate) : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {pending.length > 0
                    ? pending[0].amount?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                    : "Sem pendências"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>Todas as suas faturas</CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhuma fatura encontrada.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(invoices || []).map((invoice: any) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{invoice.description || invoice.title || `Fatura #${invoice.id}`}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell className="font-medium">
                          {(invoice.amount || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
