"use client"
import { formatDate } from "@/lib/utils"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { agencyApi } from "@/lib/api"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, Plus, ArrowUpDown } from "lucide-react"

export default function FinancialPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const { data: financialData, refetch } = useApi(() => agencyApi.getFinancial())
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState({ type: "income", description: "", amount: "", category: "", status: "pending" })

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>
  if (!user) return null

  const transactions = financialData?.transactions || financialData?.data || []
  const summary = financialData?.summary || {}

  const totalIncome = summary.totalIncome ?? transactions.filter((t: any) => t.type === "income").reduce((acc: number, t: any) => acc + (t.amount || 0), 0)
  const totalExpense = summary.totalExpense ?? transactions.filter((t: any) => t.type === "expense").reduce((acc: number, t: any) => acc + (t.amount || 0), 0)
  const balance = totalIncome - totalExpense

  const getStatusBadge = (status: string) => {
    const map: any = {
      paid: <Badge className="bg-green-500">Pago</Badge>,
      pending: <Badge className="bg-yellow-500">Pendente</Badge>,
      overdue: <Badge variant="destructive">Atrasado</Badge>,
    }
    return map[status] || <Badge>{status}</Badge>
  }

  const handleCreate = async () => {
    await agencyApi.createTransaction({ ...form, amount: parseFloat(form.amount) })
    setShowDialog(false)
    setForm({ type: "income", description: "", amount: "", category: "", status: "pending" })
    refetch?.()
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Financeiro" />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Financeiro</h2>
              <p className="text-muted-foreground">Controle financeiro da agência</p>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Nova Transação</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nova Transação</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                  </div>
                  <Button onClick={handleCreate} className="w-full">Salvar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {(totalIncome || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {(totalExpense || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {(balance || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
              <CardDescription>Histórico de movimentações financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">Nenhuma transação encontrada.</p>
              ) : (
                <div className="divide-y">
                  {(transactions || []).map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{t.category} · {formatDate(t.dueDate)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(t.status)}
                        <span className={`font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {t.type === "income" ? "+" : "-"}{(t.amount || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
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
