"use client"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Download,
  ArrowUpDown,
  Eye,
  Edit,
  PiggyBank,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BankAccount {
  id: string
  name: string
  type: "corrente" | "poupanca" | "dinheiro" | "investimento"
  initialBalance: number
  currentBalance: number
  color: string
  icon: string
}

interface Transaction {
  id: string
  type: "income" | "expense" | "transfer"
  description: string
  amount: number
  category: string
  account?: string
  card?: string
  dueDate: Date
  paymentDate?: Date
  status: "paid" | "pending" | "overdue"
  installments?: number
  currentInstallment?: number
  notes?: string
}

// Added interface for client recurring payments
interface ClientRecurringPayment {
  id: string
  clientName: string
  clientEmail: string
  amount: number
  dueDate: Date
  status: "paid" | "pending" | "overdue"
  paymentDate?: Date
  plan: string
  reminderSent: boolean
  reminderDays: number
  daysOverdue?: number
}

export default function FinancialPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const [activeTab, setActiveTab] = useState("overview")
  const [showBankDialog, setShowBankDialog] = useState(false)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [showRecurrenceSettings, setShowRecurrenceSettings] = useState(false)
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [reminderDays, setReminderDays] = useState(3)

  const [bankAccounts, setBankAccounts] = useState([
    {
      id: "1",
      name: "Banco do Brasil",
      type: "corrente",
      initialBalance: 50000,
      currentBalance: 75420,
      color: "bg-yellow-500",
      icon: "🏦",
    },
    {
      id: "2",
      name: "Nubank",
      type: "corrente",
      initialBalance: 20000,
      currentBalance: 32150,
      color: "bg-purple-500",
      icon: "💳",
    },
    {
      id: "3",
      name: "Caixa Econômica",
      type: "poupanca",
      initialBalance: 15000,
      currentBalance: 18500,
      color: "bg-blue-500",
      icon: "🏛️",
    },
  ])

  const [financialTransactions, setFinancialTransactions] = useState([
    {
      id: "1",
      type: "income",
      description: "Pagamento Cliente XYZ",
      amount: 8500,
      category: "Serviços",
      account: "Banco do Brasil",
      dueDate: new Date("2026-01-15"),
      paymentDate: new Date("2026-01-15"),
      status: "paid",
    },
    {
      id: "2",
      type: "expense",
      description: "Aluguel Escritório",
      amount: 3500,
      category: "Operacional",
      account: "Nubank",
      dueDate: new Date("2026-01-10"),
      status: "paid",
      paymentDate: new Date("2026-01-10"),
    },
    {
      id: "3",
      type: "expense",
      description: "Assinatura Adobe",
      amount: 250,
      category: "Software",
      card: "Nubank Platinum",
      dueDate: new Date("2026-01-20"),
      status: "pending",
    },
    {
      id: "4",
      type: "income",
      description: "Projeto Marketing Digital",
      amount: 12000,
      category: "Serviços",
      account: "Banco do Brasil",
      dueDate: new Date("2026-01-25"),
      status: "pending",
    },
  ])

  const [clientRecurringPayments, setClientRecurringPayments] = useState<ClientRecurringPayment[]>([
    {
      id: "r1",
      clientName: "TechStart Solutions",
      clientEmail: "contato@techstart.com",
      amount: 15000,
      dueDate: new Date("2026-01-15"),
      status: "paid",
      paymentDate: new Date("2026-01-14"),
      plan: "Plano Premium",
      reminderSent: true,
      reminderDays: 3,
    },
    {
      id: "r2",
      clientName: "Fashion Boutique",
      clientEmail: "marketing@fashion.com",
      amount: 8000,
      dueDate: new Date("2026-01-20"),
      status: "pending",
      plan: "Plano Básico",
      reminderSent: true,
      reminderDays: 5,
    },
    {
      id: "r3",
      clientName: "Food Delivery Pro",
      clientEmail: "growth@foodpro.com",
      amount: 12000,
      dueDate: new Date("2026-01-05"),
      status: "overdue",
      plan: "Plano Profissional",
      reminderSent: true,
      reminderDays: 3,
      daysOverdue: 7,
    },
    {
      id: "r4",
      clientName: "E-commerce Plus",
      clientEmail: "admin@ecommerce.com",
      amount: 20000,
      dueDate: new Date("2026-01-25"),
      status: "pending",
      plan: "Plano Enterprise",
      reminderSent: false,
      reminderDays: 7,
    },
  ])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const totalBalance = bankAccounts.reduce((acc, account) => acc + account.currentBalance, 0)
  const totalIncome = financialTransactions
    .filter((t) => t.type === "income" && t.status === "paid")
    .reduce((acc, t) => acc + t.amount, 0)
  const totalExpense = financialTransactions
    .filter((t) => t.type === "expense" && t.status === "paid")
    .reduce((acc, t) => acc + t.amount, 0)
  const pendingIncome = financialTransactions
    .filter((t) => t.type === "income" && t.status === "pending")
    .reduce((acc, t) => acc + t.amount, 0)
  const pendingExpense = financialTransactions
    .filter((t) => t.type === "expense" && t.status === "pending")
    .reduce((acc, t) => acc + t.amount, 0)

  const revenueData = [
    { mes: "Ago", receita: 28000, despesas: 12000 },
    { mes: "Set", receita: 32000, despesas: 14000 },
    { mes: "Out", receita: 29000, despesas: 13000 },
    { mes: "Nov", receita: 35000, despesas: 15000 },
    { mes: "Dez", receita: 38000, despesas: 16000 },
    { mes: "Jan", receita: totalIncome, despesas: totalExpense },
  ]

  const categoryData = [
    { name: "Serviços", value: 20500, color: "hsl(var(--chart-1))" },
    { name: "Software", value: 1500, color: "hsl(var(--chart-2))" },
    { name: "Operacional", value: 3500, color: "hsl(var(--chart-3))" },
    { name: "Marketing", value: 2200, color: "hsl(var(--chart-4))" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Financeiro</h1>
              <p className="text-muted-foreground">Sistema completo de gestão financeira</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="transactions">Lançamentos</TabsTrigger>
                <TabsTrigger value="recurrence">Recorrência</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Nova Entrada
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Nova Entrada</DialogTitle>
                        <DialogDescription>Registre uma nova receita</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Input placeholder="Ex: Pagamento do cliente" />
                          </div>
                          <div className="space-y-2">
                            <Label>Valor</Label>
                            <Input type="number" placeholder="0,00" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="servicos">Serviços</SelectItem>
                                <SelectItem value="produtos">Produtos</SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Conta Bancária</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {bankAccounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Data de Vencimento</Label>
                            <Input type="date" />
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="paid">Pago</SelectItem>
                                <SelectItem value="pending">Pendente</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Observações</Label>
                          <Textarea placeholder="Informações adicionais (opcional)" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowTransactionDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => setShowTransactionDialog(false)}>Salvar Entrada</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Nova Saída
                  </Button>

                  <Button variant="outline">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Nova Transferência
                  </Button>
                </div>

                {/* Total Balance Card */}
                <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Saldo Total Consolidado</CardTitle>
                    <CardDescription className="text-blue-100">Todas as contas bancárias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-4">
                      {totalBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-100">Receitas Pendentes</p>
                        <p className="font-semibold text-lg">
                          {pendingIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-100">Despesas Pendentes</p>
                        <p className="font-semibold text-lg">
                          {pendingExpense.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-100">Saldo Projetado</p>
                        <p className="font-semibold text-lg">
                          {(totalBalance + pendingIncome - pendingExpense).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Accounts Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <PiggyBank className="h-6 w-6" />
                      Contas Bancárias
                    </h2>
                    <Dialog open={showBankDialog} onOpenChange={setShowBankDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Nova Conta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nova Conta Bancária</DialogTitle>
                          <DialogDescription>Adicione uma nova conta ao sistema</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label>Nome do Banco</Label>
                            <Input placeholder="Ex: Banco do Brasil" />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo de Conta</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="corrente">Conta Corrente</SelectItem>
                                <SelectItem value="poupanca">Poupança</SelectItem>
                                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                <SelectItem value="investimento">Investimento</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Saldo Inicial</Label>
                            <Input type="number" placeholder="0,00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Cor</Label>
                            <div className="flex gap-2">
                              {["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-red-500"].map(
                                (color) => (
                                  <div
                                    key={color}
                                    className={`w-8 h-8 rounded ${color} cursor-pointer hover:scale-110 transition`}
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowBankDialog(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={() => setShowBankDialog(false)}>Criar Conta</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {bankAccounts.map((account) => (
                      <Card key={account.id} className="hover:shadow-lg transition">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center text-2xl`}
                            >
                              {account.icon}
                            </div>
                            <div>
                              <CardTitle className="text-sm">{account.name}</CardTitle>
                              <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {account.currentBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Inicial:{" "}
                            {account.initialBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Pending Transactions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="h-5 w-5" />
                        Receitas Pendentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {financialTransactions
                          .filter((t) => t.type === "income" && t.status === "pending")
                          .map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  Vence em {transaction.(typeof dueDate === "string" ? new Date(dueDate).toLocaleDateString("pt-BR") : dueDate instanceof Date ? dueDate.toLocaleDateString("pt-BR") : "")}
                                </p>
                              </div>
                              <p className="font-bold text-green-600">
                                {transaction.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <TrendingDown className="h-5 w-5" />
                        Despesas Pendentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {financialTransactions
                          .filter((t) => t.type === "expense" && t.status === "pending")
                          .map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  Vence em {transaction.(typeof dueDate === "string" ? new Date(dueDate).toLocaleDateString("pt-BR") : dueDate instanceof Date ? dueDate.toLocaleDateString("pt-BR") : "")}
                                </p>
                              </div>
                              <p className="font-bold text-red-600">
                                {transaction.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {totalIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">+12% vs mês anterior</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {totalExpense.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">-5% vs mês anterior</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(totalIncome - totalExpense).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Margem: {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Receitas vs Despesas</CardTitle>
                      <CardDescription>Últimos 6 meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="receita"
                            stackId="1"
                            stroke="hsl(var(--chart-1))"
                            fill="hsl(var(--chart-1))"
                            name="Receita"
                          />
                          <Area
                            type="monotone"
                            dataKey="despesas"
                            stackId="2"
                            stroke="hsl(var(--chart-2))"
                            fill="hsl(var(--chart-2))"
                            name="Despesas"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição de Despesas</CardTitle>
                      <CardDescription>Por categoria</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Monthly Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fluxo de Caixa</CardTitle>
                    <CardDescription>Entradas vs Saídas por mês</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="receita"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          name="Receita"
                        />
                        <Line
                          type="monotone"
                          dataKey="despesas"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          name="Despesas"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Transactions Tab */}
              <TabsContent value="transactions" className="space-y-6">
                {/* Resumo do Período */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Entradas Pagas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {totalIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Saídas Pagas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {totalExpense.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Em Aberto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {(pendingIncome + pendingExpense).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Resultado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {(totalIncome - totalExpense).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Entrada
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Nova Entrada</DialogTitle>
                        <DialogDescription>Registre uma nova receita no sistema</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Valor *</Label>
                            <Input type="number" placeholder="0,00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Descrição *</Label>
                            <Input placeholder="Ex: Pagamento do cliente XYZ" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Categoria *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="servicos">Serviços</SelectItem>
                                <SelectItem value="produtos">Produtos</SelectItem>
                                <SelectItem value="consultoria">Consultoria</SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Subcategoria</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="marketing">Marketing Digital</SelectItem>
                                <SelectItem value="design">Design Gráfico</SelectItem>
                                <SelectItem value="dev">Desenvolvimento</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Conta Bancária *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {bankAccounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Data de Vencimento *</Label>
                            <Input type="date" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Status *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="paid">Pago</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Data de Pagamento</Label>
                            <Input type="date" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Forma de Pagamento</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="ted">TED/DOC</SelectItem>
                                <SelectItem value="boleto">Boleto</SelectItem>
                                <SelectItem value="cartao">Cartão</SelectItem>
                                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Cliente</Label>
                            <Input placeholder="Nome do cliente" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Centro de Custo / Projeto</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione (opcional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="projeto1">Projeto Marketing XYZ</SelectItem>
                              <SelectItem value="projeto2">Campanha Redes Sociais</SelectItem>
                              <SelectItem value="projeto3">Site Institucional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Tags</Label>
                          <Input placeholder="Ex: urgente, recorrente, importante" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="parcelado" className="rounded" />
                            <Label htmlFor="parcelado">Parcelado</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="recorrente" className="rounded" />
                            <Label htmlFor="recorrente">Recorrente</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Observações</Label>
                          <Textarea placeholder="Informações adicionais (opcional)" rows={3} />
                        </div>

                        <div className="space-y-2">
                          <Label>Anexo (Comprovante)</Label>
                          <Input type="file" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancelar</Button>
                        <Button className="bg-green-600 hover:bg-green-700">Salvar Entrada</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Saída
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Nova Saída</DialogTitle>
                        <DialogDescription>Registre uma nova despesa no sistema</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Valor *</Label>
                            <Input type="number" placeholder="0,00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Descrição *</Label>
                            <Input placeholder="Ex: Aluguel do escritório" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Categoria *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="operacional">Operacional</SelectItem>
                                <SelectItem value="software">Software</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="rh">Recursos Humanos</SelectItem>
                                <SelectItem value="impostos">Impostos</SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Subcategoria</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aluguel">Aluguel</SelectItem>
                                <SelectItem value="energia">Energia</SelectItem>
                                <SelectItem value="internet">Internet</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Conta/Cartão *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {bankAccounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                                <SelectItem value="cartao1">Cartão Corporativo</SelectItem>
                                <SelectItem value="cartao2">Nubank Platinum</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Data de Vencimento *</Label>
                            <Input type="date" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Status *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="paid">Pago</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Data de Pagamento</Label>
                            <Input type="date" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Forma de Pagamento</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="ted">TED/DOC</SelectItem>
                                <SelectItem value="boleto">Boleto</SelectItem>
                                <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                                <SelectItem value="debito">Débito Automático</SelectItem>
                                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Fornecedor</Label>
                            <Input placeholder="Nome do fornecedor" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Centro de Custo / Projeto</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione (opcional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="administrativo">Administrativo</SelectItem>
                              <SelectItem value="operacional">Operacional</SelectItem>
                              <SelectItem value="projeto1">Projeto Cliente XYZ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Tags</Label>
                          <Input placeholder="Ex: fixo, variável, impostos" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="parceladoSaida" className="rounded" />
                            <Label htmlFor="parceladoSaida">Parcelado</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="recorrenteSaida" className="rounded" />
                            <Label htmlFor="recorrenteSaida">Recorrente (Assinatura)</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Observações</Label>
                          <Textarea placeholder="Informações adicionais (opcional)" rows={3} />
                        </div>

                        <div className="space-y-2">
                          <Label>Anexo (Nota Fiscal/Comprovante)</Label>
                          <Input type="file" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancelar</Button>
                        <Button className="bg-red-600 hover:bg-red-700">Salvar Saída</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Transferência
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nova Transferência</DialogTitle>
                        <DialogDescription>Transfira valores entre contas</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Conta Origem *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {bankAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Conta Destino *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {bankAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Valor *</Label>
                          <Input type="number" placeholder="0,00" />
                        </div>

                        <div className="space-y-2">
                          <Label>Data *</Label>
                          <Input type="date" />
                        </div>

                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <Input placeholder="Ex: Aplicação em poupança" />
                        </div>

                        <div className="space-y-2">
                          <Label>Status *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="completed">Concluída</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancelar</Button>
                        <Button>Confirmar Transferência</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Importar CSV
                  </Button>

                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>

                {/* Tabs Internas */}
                <Tabs defaultValue="todos" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="areceber">A Receber</TabsTrigger>
                    <TabsTrigger value="apagar">A Pagar</TabsTrigger>
                    <TabsTrigger value="pagos">Pagos</TabsTrigger>
                    <TabsTrigger value="recorrentes">Recorrentes</TabsTrigger>
                    <TabsTrigger value="cartao">Cartão</TabsTrigger>
                    <TabsTrigger value="transferencias">Transferências</TabsTrigger>
                    <TabsTrigger value="futuros">Futuros</TabsTrigger>
                  </TabsList>

                  {/* Barra de Filtros Avançados */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Filtros Avançados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hoje">Hoje</SelectItem>
                            <SelectItem value="semana">Esta Semana</SelectItem>
                            <SelectItem value="mes">Este Mês</SelectItem>
                            <SelectItem value="ano">Este Ano</SelectItem>
                            <SelectItem value="personalizado">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entrada">Entrada</SelectItem>
                            <SelectItem value="saida">Saída</SelectItem>
                            <SelectItem value="transferencia">Transferência</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="pago">Pago</SelectItem>
                            <SelectItem value="atrasado">Atrasado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Conta/Cartão" />
                          </SelectTrigger>
                          <SelectContent>
                            {bankAccounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="servicos">Serviços</SelectItem>
                            <SelectItem value="operacional">Operacional</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Forma Pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pix">PIX</SelectItem>
                            <SelectItem value="boleto">Boleto</SelectItem>
                            <SelectItem value="cartao">Cartão</SelectItem>
                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input placeholder="Buscar por texto..." />

                        <Button variant="outline">Limpar Filtros</Button>
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="atrasados" className="rounded" />
                          <Label htmlFor="atrasados" className="text-sm">
                            Somente atrasados
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="parcelados" className="rounded" />
                          <Label htmlFor="parcelados" className="text-sm">
                            Somente parcelados
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <TabsContent value="todos" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Todos os Lançamentos</CardTitle>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Selecionar Todos
                            </Button>
                            <Button variant="outline" size="sm">
                              Ações em Lote
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                <input type="checkbox" className="rounded" />
                              </TableHead>
                              <TableHead>Data Competência</TableHead>
                              <TableHead>Data Pagamento</TableHead>
                              <TableHead>Descrição</TableHead>
                              <TableHead>Pessoa</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead>Conta/Cartão</TableHead>
                              <TableHead>Forma Pagto</TableHead>
                              <TableHead>Valor</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-12">Anexo</TableHead>
                              <TableHead className="w-12">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {financialTransactions.map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>
                                  <input type="checkbox" className="rounded" />
                                </TableCell>
                                <TableCell>{transaction.(typeof dueDate === "string" ? new Date(dueDate).toLocaleDateString("pt-BR") : dueDate instanceof Date ? dueDate.toLocaleDateString("pt-BR") : "")}</TableCell>
                                <TableCell>
                                  {transaction.paymentDate ? transaction.(typeof paymentDate === "string" ? new Date(paymentDate).toLocaleDateString("pt-BR") : paymentDate instanceof Date ? paymentDate.toLocaleDateString("pt-BR") : "") : "-"}
                                </TableCell>
                                <TableCell className="font-medium">{transaction.description}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">-</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{transaction.category}</Badge>
                                </TableCell>
                                <TableCell className="text-sm">{transaction.account || transaction.card}</TableCell>
                                <TableCell className="text-sm">-</TableCell>
                                <TableCell
                                  className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                                >
                                  {transaction.type === "income" ? "+" : "-"}
                                  {transaction.amount.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      transaction.status === "paid"
                                        ? "default"
                                        : transaction.status === "pending"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {transaction.status === "paid"
                                      ? "Pago"
                                      : transaction.status === "pending"
                                        ? "Pendente"
                                        : "Atrasado"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon">
                                    📎
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Detalhes do Lançamento</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <Label className="text-muted-foreground">Descrição</Label>
                                          <p className="font-medium">{transaction.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-muted-foreground">Valor</Label>
                                            <p className="font-bold text-lg">
                                              {transaction.amount.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                              })}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Status</Label>
                                            <p>
                                              <Badge variant="default">
                                                {transaction.status === "paid" ? "Pago" : "Pendente"}
                                              </Badge>
                                            </p>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-muted-foreground">Categoria</Label>
                                            <p>{transaction.category}</p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Conta</Label>
                                            <p>{transaction.account || transaction.card}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline">Editar</Button>
                                        <Button variant="destructive">Excluir</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="areceber">
                    <Card>
                      <CardHeader>
                        <CardTitle>Contas a Receber</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Filtro aplicado: Entradas pendentes</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="apagar">
                    <Card>
                      <CardHeader>
                        <CardTitle>Contas a Pagar</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Filtro aplicado: Saídas pendentes</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="pagos">
                    <Card>
                      <CardHeader>
                        <CardTitle>Lançamentos Pagos/Recebidos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Filtro aplicado: Status pago</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recorrentes">
                    <Card>
                      <CardHeader>
                        <CardTitle>Lançamentos Recorrentes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Assinaturas, aluguéis e outros lançamentos recorrentes</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="cartao">
                    <Card>
                      <CardHeader>
                        <CardTitle>Faturas de Cartão de Crédito</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Filtro aplicado: Pagamentos via cartão</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="transferencias">
                    <Card>
                      <CardHeader>
                        <CardTitle>Transferências entre Contas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Histórico de movimentações entre contas</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="futuros">
                    <Card>
                      <CardHeader>
                        <CardTitle>Lançamentos Futuros (Agendados)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Parcelas e lançamentos com data futura</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="recurrence" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {clientRecurringPayments.filter((c) => c.status !== "overdue").length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Contas em dia</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Inadimplentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {clientRecurringPayments.filter((c) => c.status === "overdue").length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Pagamentos atrasados</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Receita Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {clientRecurringPayments
                          .filter((c) => c.status === "paid")
                          .reduce((acc, c) => acc + c.amount, 0)
                          .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Pagamentos recebidos</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">A Receber</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {clientRecurringPayments
                          .filter((c) => c.status === "pending" || c.status === "overdue")
                          .reduce((acc, c) => acc + c.amount, 0)
                          .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Pendente + Atrasado</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Global Settings */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Configurações de Lembretes Automáticos
                        </CardTitle>
                        <CardDescription>Configure quando os clientes receberão avisos de vencimento</CardDescription>
                      </div>
                      <Dialog open={showRecurrenceSettings} onOpenChange={setShowRecurrenceSettings}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Configurações
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Configurações Globais de Lembretes</DialogTitle>
                            <DialogDescription>
                              Defina as regras padrão para envio de lembretes de pagamento
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Dias antes do vencimento</Label>
                              <Input
                                type="number"
                                value={reminderDays}
                                onChange={(e) => setReminderDays(Number(e.target.value))}
                                placeholder="3"
                              />
                              <p className="text-xs text-muted-foreground">
                                Clientes receberão email automático X dias antes da fatura vencer
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label>Mensagem do Email</Label>
                              <Textarea
                                placeholder="Olá {cliente}, sua fatura de {valor} vence em {dias} dias..."
                                rows={4}
                              />
                              <p className="text-xs text-muted-foreground">
                                Use variáveis: {"{cliente}"}, {"{valor}"}, {"{dias}"}, {"{plano}"}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label>Enviar lembrete após vencimento</Label>
                              <Select defaultValue="daily">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="daily">Diariamente</SelectItem>
                                  <SelectItem value="weekly">Semanalmente</SelectItem>
                                  <SelectItem value="never">Nunca</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowRecurrenceSettings(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={() => setShowRecurrenceSettings(false)}>Salvar Configurações</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>
                        Lembretes automáticos configurados para <strong>{reminderDays} dias</strong> antes do vencimento
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Payments Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Gestão de Recorrências dos Clientes</CardTitle>
                    <CardDescription>Acompanhe e gerencie pagamentos mensais dos seus clientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Lembretes</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientRecurringPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{payment.clientName}</p>
                                <p className="text-xs text-muted-foreground">{payment.clientEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell>{payment.plan}</TableCell>
                            <TableCell className="font-medium">
                              {payment.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p>{payment.(typeof dueDate === "string" ? new Date(dueDate).toLocaleDateString("pt-BR") : dueDate instanceof Date ? dueDate.toLocaleDateString("pt-BR") : "")}</p>
                                {payment.status === "overdue" && (
                                  <p className="text-xs text-red-600">Atrasado {payment.daysOverdue} dias</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {payment.status === "paid" && (
                                <Badge className="bg-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Pago
                                </Badge>
                              )}
                              {payment.status === "pending" && <Badge className="bg-orange-500">Pendente</Badge>}
                              {payment.status === "overdue" && (
                                <Badge variant="destructive">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Atrasado
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {payment.reminderSent ? (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    Enviado ({payment.reminderDays}d antes)
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">Aguardando</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    alert(`Email de cobrança enviado para ${payment.clientEmail}`)
                                  }}
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  Enviar Cobrança
                                </Button>
                                {payment.status !== "paid" && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const updated = clientRecurringPayments.map((p) =>
                                        p.id === payment.id
                                          ? { ...p, status: "paid" as const, paymentDate: new Date() }
                                          : p,
                                      )
                                      setClientRecurringPayments(updated)
                                    }}
                                  >
                                    Marcar como Pago
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
