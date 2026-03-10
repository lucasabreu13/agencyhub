"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Target, Plus, TrendingUp, Users, DollarSign, Building2, CheckCircle2, Clock } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  type: "revenue" | "agencies" | "users" | "custom"
  target: number
  current: number
  deadline: Date
  status: "on-track" | "at-risk" | "completed"
  responsible: string
}

export default function AdminGoalsPage() {
  const { user, loading, logout } = useAuth("admin")
  const [showDialog, setShowDialog] = useState(false)

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "MRR de R$ 500k",
      description: "Atingir receita recorrente mensal de R$ 500.000",
      type: "revenue",
      target: 500000,
      current: 207050,
      deadline: new Date("2026-06-30"),
      status: "on-track",
      responsible: "Time Comercial",
    },
    {
      id: "2",
      title: "100 Agências Ativas",
      description: "Alcançar 100 agências utilizando a plataforma",
      type: "agencies",
      target: 100,
      current: 45,
      deadline: new Date("2026-12-31"),
      status: "on-track",
      responsible: "Marketing",
    },
    {
      id: "3",
      title: "5000 Usuários Ativos",
      description: "Ter 5000 usuários ativos na plataforma",
      type: "users",
      target: 5000,
      current: 1250,
      deadline: new Date("2026-09-30"),
      status: "at-risk",
      responsible: "Growth",
    },
    {
      id: "4",
      title: "Reduzir Churn para 2%",
      description: "Reduzir taxa de cancelamento para 2% ao mês",
      type: "custom",
      target: 2,
      current: 3.2,
      deadline: new Date("2026-03-31"),
      status: "at-risk",
      responsible: "Customer Success",
    },
  ])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "revenue":
        return <DollarSign className="h-5 w-5" />
      case "agencies":
        return <Building2 className="h-5 w-5" />
      case "users":
        return <Users className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      "on-track": "bg-green-100 text-green-700",
      "at-risk": "bg-yellow-100 text-yellow-700",
      completed: "bg-blue-100 text-blue-700",
    }
    return styles[status] || ""
  }

  const completedGoals = goals.filter((g) => g.status === "completed").length
  const onTrackGoals = goals.filter((g) => g.status === "on-track").length
  const atRiskGoals = goals.filter((g) => g.status === "at-risk").length

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Metas" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Metas da Plataforma</h2>
              <p className="text-muted-foreground">Acompanhe os objetivos estratégicos</p>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Meta</DialogTitle>
                  <DialogDescription>Defina um novo objetivo estratégico</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Título da Meta</Label>
                    <Input placeholder="Ex: MRR de R$ 1M" />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea placeholder="Descreva o objetivo..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Receita</SelectItem>
                          <SelectItem value="agencies">Agências</SelectItem>
                          <SelectItem value="users">Usuários</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Valor Alvo</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prazo</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Responsável</Label>
                      <Input placeholder="Nome do time/pessoa" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setShowDialog(false)}>Criar Meta</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goals.length}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">No Prazo</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{onTrackGoals}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Em Risco</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{atRiskGoals}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{completedGoals}</div>
              </CardContent>
            </Card>
          </div>

          {/* Goals List */}
          <div className="grid gap-4">
            {goals.map((goal) => {
              const progress =
                goal.type === "custom" ? 100 - (goal.current / goal.target) * 100 : (goal.current / goal.target) * 100
              const daysUntilDeadline = Math.ceil(
                (goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <Card key={goal.id} className="hover:shadow-md transition">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">{getIcon(goal.type)}</div>
                        <div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <CardDescription>{goal.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(goal.status)}>
                        {goal.status === "on-track" ? "No Prazo" : goal.status === "at-risk" ? "Em Risco" : "Concluída"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">
                          {goal.type === "revenue"
                            ? `${goal.current.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} / ${goal.target.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
                            : goal.type === "custom"
                              ? `${goal.current}% / ${goal.target}%`
                              : `${goal.current} / ${goal.target}`}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(1)}% alcançado</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-muted-foreground">Prazo</p>
                          <p className="font-medium">{goal.deadline.toLocaleDateString("pt-BR")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Faltam</p>
                          <p className="font-medium">{daysUntilDeadline} dias</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Responsável</p>
                        <p className="font-medium">{goal.responsible}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
