"use client"
import { formatDate } from "@/lib/utils"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { agencyApi, adminApi, clientApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Calendar, User } from "lucide-react"

export default function ProjectsPage() {
  const { user, loading, logout } = useAuth("agency_owner")

  const { data: projectsData } = useApi(() => agencyApi.getProjects())

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const projects = projectsData?.data || []

  const getStatusLabel = (status: string) => {
    const labels = {
      planning: "Planejamento",
      in_progress: "Em Andamento",
      review: "Revisão",
      completed: "Concluído",
    }
    return labels[status as keyof typeof labels]
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Projetos" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gerenciar Projetos</h2>
              <p className="text-muted-foreground">Acompanhe todos os projetos em andamento</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(projects || []).map((project) => {
              const client = getClientById(project.clientId)
              const daysUntilDue = Math.ceil((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <Badge
                          variant={
                            project.status === "completed"
                              ? "outline"
                              : project.status === "in_progress"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {getStatusLabel(project.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{client?.company}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {project.status === "completed"
                            ? `Concluído em ${formatDate(project.dueDate)}`
                            : `${daysUntilDue} dias restantes`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{project.assignedTo}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Badge
                        variant={
                          project.priority === "high"
                            ? "destructive"
                            : project.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        Prioridade:{" "}
                        {project.priority === "high" ? "Alta" : project.priority === "medium" ? "Média" : "Baixa"}
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
        </div>
      </div>
    </div>
  )
}
