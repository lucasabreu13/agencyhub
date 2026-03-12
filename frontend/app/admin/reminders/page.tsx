"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Bell, Plus, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Reminder {
  id: string
  title: string
  description: string
  type: "meeting" | "task" | "payment" | "review" | "other"
  priority: "high" | "medium" | "low"
  date: Date
  time: string
  status: "pending" | "completed"
  relatedTo?: string
}

export default function AdminRemindersPage() {
  const { user, loading, logout } = useAuth("admin")
  const [showDialog, setShowDialog] = useState(false)

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Reunião com Investidores",
      description: "Apresentação dos resultados Q4 e projeções 2026",
      type: "meeting",
      priority: "high",
      date: new Date("2026-01-10"),
      time: "14:00",
      status: "pending",
      relatedTo: "Financeiro",
    },
    {
      id: "2",
      title: "Revisar Contratos de Agências Premium",
      description: "Análise de renovações e upgrade de planos",
      type: "review",
      priority: "high",
      date: new Date("2026-01-08"),
      time: "10:00",
      status: "pending",
      relatedTo: "Vendas",
    },
    {
      id: "3",
      title: "Pagamento Fornecedores AWS",
      description: "Fatura mensal de infraestrutura",
      type: "payment",
      priority: "medium",
      date: new Date("2026-01-15"),
      time: "09:00",
      status: "pending",
      relatedTo: "Financeiro",
    },
    {
      id: "4",
      title: "Atualização do Roadmap",
      description: "Definir features para Q1 2026",
      type: "task",
      priority: "medium",
      date: new Date("2026-01-12"),
      time: "16:00",
      status: "pending",
      relatedTo: "Produto",
    },
    {
      id: "5",
      title: "Análise de Churn do Mês",
      description: "Revisar motivos de cancelamento",
      type: "review",
      priority: "low",
      date: new Date("2026-01-05"),
      time: "11:00",
      status: "completed",
      relatedTo: "Customer Success",
    },
  ])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200",
    }
    return colors[priority] || ""
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return "📅"
      case "task":
        return "✅"
      case "payment":
        return "💰"
      case "review":
        return "📋"
      default:
        return "🔔"
    }
  }

  const pendingReminders = reminders.filter((r) => r.status === "pending")
  const completedReminders = reminders.filter((r) => r.status === "completed")
  const highPriorityCount = pendingReminders.filter((r) => r.priority === "high").length
  const todayReminders = pendingReminders.filter((r) => r.date.toDateString() === new Date().toDateString()).length

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Lembretes" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Lembretes e Notificações</h2>
              <p className="text-muted-foreground">Gerencie seus compromissos e tarefas</p>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Lembrete
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Lembrete</DialogTitle>
                  <DialogDescription>Configure um novo lembrete ou notificação</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input placeholder="Ex: Reunião com equipe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea placeholder="Detalhes do lembrete..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Reunião</SelectItem>
                          <SelectItem value="task">Tarefa</SelectItem>
                          <SelectItem value="payment">Pagamento</SelectItem>
                          <SelectItem value="review">Revisão</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="low">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Relacionado a</Label>
                    <Input placeholder="Ex: Financeiro, Vendas..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setShowDialog(false)}>Criar Lembrete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Bell className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingReminders.length}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Hoje</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{todayReminders}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedReminders.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Reminders Tabs */}
          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending">Pendentes ({pendingReminders.length})</TabsTrigger>
              <TabsTrigger value="completed">Concluídos ({completedReminders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingReminders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum lembrete pendente</p>
                  </CardContent>
                </Card>
              ) : (
                pendingReminders.map((reminder) => (
                  <Card key={reminder.id} className="hover:shadow-md transition">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{getTypeIcon(reminder.type)}</div>
                          <div>
                            <CardTitle className="text-lg">{reminder.title}</CardTitle>
                            <CardDescription>{reminder.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {reminder.priority === "high" ? "Alta" : reminder.priority === "medium" ? "Média" : "Baixa"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{reminder.(typeof date === "string" ? new Date(date).toLocaleDateString("pt-BR") : date instanceof Date ? date.toLocaleDateString("pt-BR") : "")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{reminder.time}</span>
                          </div>
                          {reminder.relatedTo && (
                            <Badge variant="outline" className="font-normal">
                              {reminder.relatedTo}
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setReminders(
                              reminders.map((r) => (r.id === reminder.id ? { ...r, status: "completed" } : r)),
                            )
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Concluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedReminders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum lembrete concluído ainda</p>
                  </CardContent>
                </Card>
              ) : (
                completedReminders.map((reminder) => (
                  <Card key={reminder.id} className="opacity-60">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{getTypeIcon(reminder.type)}</div>
                          <div>
                            <CardTitle className="text-lg line-through">{reminder.title}</CardTitle>
                            <CardDescription>{reminder.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Concluído</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{reminder.(typeof date === "string" ? new Date(date).toLocaleDateString("pt-BR") : date instanceof Date ? date.toLocaleDateString("pt-BR") : "")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{reminder.time}</span>
                        </div>
                        {reminder.relatedTo && <Badge variant="outline">{reminder.relatedTo}</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
