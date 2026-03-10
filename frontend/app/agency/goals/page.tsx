"use client"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Target, Users, Megaphone, UserIcon, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function GoalsPage() {
  const { user, loading, logout } = useAuth("agency_owner")

  const { data: goalsData } = useApi(() => agencyApi.getGoals())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const goals = goalsData?.data || []

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "revenue":
        return TrendingUp
      case "clients":
        return Users
      case "campaigns":
        return Megaphone
      case "team":
        return UserIcon
      default:
        return Target
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "revenue":
        return "text-green-600"
      case "clients":
        return "text-blue-600"
      case "campaigns":
        return "text-purple-600"
      case "team":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "revenue":
        return "Receita"
      case "clients":
        return "Clientes"
      case "campaigns":
        return "Campanhas"
      case "team":
        return "Equipe"
      default:
        return category
    }
  }

  const totalGoals = goals.length
  const completedGoals = goals.filter((g) => g.current >= g.target).length
  const inProgressGoals = goals.filter((g) => g.current < g.target && g.current > 0).length

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Metas" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gestão de Metas</h2>
              <p className="text-muted-foreground">Acompanhe e gerencie as metas da sua agência</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </div>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGoals}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(0) : 0}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{inProgressGoals}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalGoals > 0 ? ((inProgressGoals / totalGoals) * 100).toFixed(0) : 0}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Performance Geral</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {goals.length > 0
                    ? (goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / goals.length).toFixed(0)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-1">Média de conclusão</p>
              </CardContent>
            </Card>
          </div>

          {/* Goals List */}
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100
              const isCompleted = percentage >= 100
              const Icon = getCategoryIcon(goal.category)
              const daysRemaining = Math.ceil((goal.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

              return (
                <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-primary/10`}>
                          <Icon className={`h-5 w-5 ${getCategoryColor(goal.category)}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <CardDescription className="mt-1">{goal.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={isCompleted ? "default" : "secondary"}>{getCategoryLabel(goal.category)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progresso</span>
                        <span className={`text-sm font-bold ${isCompleted ? "text-green-600" : ""}`}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Atual</p>
                        <p className="text-lg font-bold">
                          {goal.unit === "R$"
                            ? goal.current.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                            : `${goal.current} ${goal.unit}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Meta</p>
                        <p className="text-lg font-bold">
                          {goal.unit === "R$"
                            ? goal.target.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                            : `${goal.target} ${goal.unit}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {goal.startDate.toLocaleDateString("pt-BR")} - {goal.endDate.toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <Badge variant={daysRemaining < 30 ? "destructive" : "outline"}>
                        {daysRemaining > 0 ? `${daysRemaining} dias` : "Vencido"}
                      </Badge>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {goals.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold mb-2">Nenhuma meta cadastrada</p>
                <p className="text-muted-foreground mb-4">
                  Comece definindo suas metas para acompanhar o crescimento da sua agência
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Meta
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
