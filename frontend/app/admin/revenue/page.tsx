"use client"
import { useApi } from "@/hooks/use-api"
import { adminApi } from "@/lib/api"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Wallet,
  TrendingDown,
  Plus,
  Download,
  Upload,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminRevenuePage() {
  const { user, loading, logout } = useAuth("admin")

  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income")

  const { data: revenueData } = useApi(() => adminApi.getRevenue())
  const { data: agenciesRevData } = useApi(() => adminApi.getAgencies())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }


  const monthlyRevenue = revenueData?.summary?.income || 0
  const monthlyExpenses = revenueData?.summary?.expense || 0
  const netProfit = monthlyRevenue - monthlyExpenses
  const profitMargin = ((netProfit / monthlyRevenue) * 100).toFixed(1)

  const revenueByMonth = [
    { month: "Jan", receita: 98500, despesa: 72000, lucro: 26500, newContracts: 2, churn: 1, ltv: 5900 },
    { month: "Fev", receita: 108350, despesa: 78000, lucro: 30350, newContracts: 3, churn: 1, ltv: 6200 },
    { month: "Mar", receita: 128050, despesa: 82000, lucro: 46050, newContracts: 4, churn: 0, ltv: 6800 },
    { month: "Abr", receita: 147750, despesa: 85000, lucro: 62750, newContracts: 4, churn: 1, ltv: 7100 },
    { month: "Mai", receita: 177400, despesa: 89000, lucro: 88400, newContracts: 6, churn: 0, ltv: 7900 },
    { month: "Jun", receita: 207050, despesa: 85000, lucro: 122050, newContracts: 6, churn: 1, ltv: 8400 },
  ]

  const expensesByCategory = [
    { name: "Infraestrutura", value: 28000, color: "hsl(var(--chart-1))" },
    { name: "Pessoal", value: 35000, color: "hsl(var(--chart-2))" },
    { name: "Marketing", value: 12000, color: "hsl(var(--chart-3))" },
    { name: "Suporte", value: 6000, color: "hsl(var(--chart-4))" },
    { name: "Outros", value: 4000, color: "hsl(var(--chart-5))" },
  ]

  const cashFlowData = [
    { month: "Jan", entrada: 98500, saida: 72000, saldo: 26500 },
    { month: "Fev", entrada: 108350, saida: 78000, saldo: 56850 },
    { month: "Mar", entrada: 128050, saida: 82000, saldo: 102900 },
    { month: "Abr", entrada: 147750, saida: 85000, saldo: 165650 },
    { month: "Mai", entrada: 177400, saida: 89000, saldo: 254050 },
    { month: "Jun", entrada: 207050, saida: 85000, saldo: 376100 },
  ]

  const avgLTV = revenueByMonth.reduce((acc, item) => acc + item.ltv, 0) / revenueByMonth.length
  const totalNewContracts = revenueByMonth.reduce((acc, item) => acc + item.newContracts, 0)
  const totalChurn = revenueByMonth.reduce((acc, item) => acc + item.churn, 0)
  const churnRate = totalChurn > 0 ? ((totalChurn / (agenciesRevData?.total || 1)) * 100).toFixed(1) : "0.0"

  const totalMarketingSpend = 45000
  const estimatedCAC = totalMarketingSpend / totalNewContracts

  const transactions = [
    {
      id: 1,
      date: "2026-01-05",
      type: "income" as const,
      category: "Assinatura",
      description: "Renovação - Digital Pro Marketing",
      amount: 497,
      status: "confirmed",
    },
    {
      id: 2,
      date: "2026-01-04",
      type: "expense" as const,
      category: "Infraestrutura",
      description: "AWS - Hospedagem mensal",
      amount: 8500,
      status: "confirmed",
    },
    {
      id: 3,
      date: "2026-01-03",
      type: "income" as const,
      category: "Assinatura",
      description: "Novo cliente - Marketing Solutions",
      amount: 997,
      status: "confirmed",
    },
    {
      id: 4,
      date: "2026-01-03",
      type: "expense" as const,
      category: "Marketing",
      description: "Google Ads - Campanha Janeiro",
      amount: 3500,
      status: "confirmed",
    },
    {
      id: 5,
      date: "2026-01-02",
      type: "expense" as const,
      category: "Pessoal",
      description: "Salários - Equipe de desenvolvimento",
      amount: 28000,
      status: "confirmed",
    },
    {
      id: 6,
      date: "2026-01-01",
      type: "income" as const,
      category: "Assinatura",
      description: "Renovação - Creative Agency",
      amount: 197,
      status: "pending",
    },
  ]

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Financeiro" />

        <div className="p-6 space-y-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Gestão Financeira</h2>
                <p className="text-muted-foreground">Controle completo das finanças da plataforma</p>
              </div>
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard Executivo</TabsTrigger>
                <TabsTrigger value="transactions">Lançamentos</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Executive KPIs */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(monthlyRevenue || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                      <p className="text-xs text-green-600 font-medium">+18.2% vs. mês anterior</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Despesas Mensais</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(monthlyExpenses || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowDownRight className="h-3 w-3 text-green-600" />
                      <p className="text-xs text-green-600 font-medium">-4.1% vs. mês anterior</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                    <PiggyBank className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(netProfit || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Margem: {profitMargin}%</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Saldo em Caixa</CardTitle>
                    <Wallet className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(376100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Acumulado nos últimos 6 meses</p>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary KPIs */}
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">MRR</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {(monthlyRevenue || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">ARR</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{(yearlyRevenue / 1000).toFixed(0)}k</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">LTV Médio</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {(avgLTV * 1000).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">CAC</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {(estimatedCAC || 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{churnRate}%</div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Charts Row */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Receita vs Despesa</CardTitle>
                    <CardDescription>Comparativo mensal de entradas e saídas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        receita: {
                          label: "Receita",
                          color: "hsl(var(--chart-1))",
                        },
                        despesa: {
                          label: "Despesa",
                          color: "hsl(var(--chart-2))",
                        },
                        lucro: {
                          label: "Lucro",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[350px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByMonth}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-sm" />
                          <YAxis className="text-sm" tickFormatter={(value) => (value / 1000).toFixed(0) + "k"} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                formatter={(value) =>
                                  Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                }
                              />
                            }
                          />
                          <Bar dataKey="receita" fill="var(--color-receita)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="despesa" fill="var(--color-despesa)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="lucro" fill="var(--color-lucro)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Despesas por Categoria</CardTitle>
                    <CardDescription>Distribuição de custos operacionais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        value: {
                          label: "Valor",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[350px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expensesByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${((entry.value / monthlyExpenses) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {expensesByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                formatter={(value) =>
                                  Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                }
                              />
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Cash Flow Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Caixa</CardTitle>
                  <CardDescription>Movimentação financeira e saldo acumulado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      entrada: {
                        label: "Entrada",
                        color: "hsl(var(--chart-1))",
                      },
                      saida: {
                        label: "Saída",
                        color: "hsl(var(--chart-2))",
                      },
                      saldo: {
                        label: "Saldo",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-sm" />
                        <YAxis className="text-sm" tickFormatter={(value) => (value / 1000).toFixed(0) + "k"} />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) =>
                                Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                              }
                            />
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="entrada"
                          stroke="var(--color-entrada)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="saida"
                          stroke="var(--color-saida)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="saldo"
                          stroke="var(--color-saldo)"
                          strokeWidth={3}
                          dot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Bottom Cards Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo de Despesas</CardTitle>
                    <CardDescription>Detalhamento por categoria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expensesByCategory.map((category) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {(category.value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {((category.value / monthlyExpenses) * 100).toFixed(1)}% do total
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between font-bold">
                          <span>Total</span>
                          <span>{(monthlyExpenses || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Projeção Anual</CardTitle>
                    <CardDescription>Estimativa baseada nos últimos 6 meses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Receita Projetada</span>
                          <span className="font-bold text-lg">
                            {(yearlyRevenue || 0).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              minimumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "100%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Despesas Projetadas</span>
                          <span className="font-bold text-lg">
                            {(monthlyExpenses * 12).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              minimumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: "100%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Lucro Projetado</span>
                          <span className="font-bold text-lg text-blue-600">
                            {(netProfit * 12).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              minimumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: "100%" }} />
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Margem de Lucro Projetada</span>
                          <Badge variant="default" className="text-base">
                            {profitMargin}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Lançamentos Financeiros</h3>
                  <p className="text-sm text-muted-foreground">Registro de todas as movimentações financeiras</p>
                </div>
                <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Lançamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Novo Lançamento</DialogTitle>
                      <DialogDescription>
                        Adicione uma nova movimentação financeira (receita ou despesa)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Tipo de Lançamento</Label>
                        <Select value={transactionType} onValueChange={(value: any) => setTransactionType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                                Receita
                              </div>
                            </SelectItem>
                            <SelectItem value="expense">
                              <div className="flex items-center gap-2">
                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                                Despesa
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Data</Label>
                          <Input id="date" type="date" defaultValue="2026-01-05" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Valor (R$)</Label>
                          <Input id="amount" type="number" placeholder="0,00" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select defaultValue="">
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {transactionType === "income" ? (
                              <>
                                <SelectItem value="subscription">Assinatura</SelectItem>
                                <SelectItem value="upgrade">Upgrade de Plano</SelectItem>
                                <SelectItem value="other">Outros</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="infrastructure">Infraestrutura</SelectItem>
                                <SelectItem value="personnel">Pessoal</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="support">Suporte</SelectItem>
                                <SelectItem value="other">Outros</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" placeholder="Descreva o lançamento..." rows={3} />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button className="flex-1" onClick={() => setShowTransactionDialog(false)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Lançamento
                        </Button>
                        <Button variant="outline" onClick={() => setShowTransactionDialog(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Upload className="h-4 w-4 text-green-600" />
                      Entradas do Mês
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {(monthlyRevenue || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {transactions.filter((t) => t.type === "income").length} lançamentos
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Download className="h-4 w-4 text-red-600" />
                      Saídas do Mês
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {(monthlyExpenses || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {transactions.filter((t) => t.type === "expense").length} lançamentos
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-blue-600" />
                      Saldo do Mês
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {(netProfit || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Receita - Despesas</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Lançamentos</CardTitle>
                  <CardDescription>Todas as movimentações registradas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(transactions || []).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {(transaction.amount || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                          <Badge
                            variant={transaction.status === "confirmed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {transaction.status === "confirmed" ? "Confirmado" : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
