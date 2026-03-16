"use client"
import { formatDate } from "@/lib/utils"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { agencyApi } from "@/lib/api"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, User, Lock } from "lucide-react"
import { useState } from "react"

export default function KanbanPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const { data: kanbanData } = useApi(() => agencyApi.getKanbanBoard())

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>
  if (!user) return null

  const columns = kanbanData?.columns || [
    { id: "todo", title: "A Fazer", cards: [] },
    { id: "in_progress", title: "Em Progresso", cards: [] },
    { id: "review", title: "Em Revisão", cards: [] },
    { id: "done", title: "Concluído", cards: [] },
  ]

  const getPriorityColor = (priority: string) => {
    const map: any = { high: "destructive", medium: "outline", low: "secondary" }
    return map[priority] || "outline"
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Kanban" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Kanban</h2>
              <p className="text-muted-foreground">Gerencie as tarefas da sua equipe</p>
            </div>
            <Button><Plus className="h-4 w-4 mr-2" />Nova Tarefa</Button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((col: any) => (
              <div key={col.id} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{col.title}</h3>
                  <Badge variant="secondary">{(col.cards || []).length}</Badge>
                </div>
                <div className="space-y-3">
                  {(col.cards || []).length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm text-muted-foreground">
                      Sem tarefas
                    </div>
                  ) : (
                    (col.cards || []).map((card: any) => (
                      <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">{card.title}</p>
                            {card.blocked && <Lock className="h-3 w-3 text-red-500 flex-shrink-0" />}
                          </div>
                          {card.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{card.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <Badge variant={getPriorityColor(card.priority)} className="text-xs">
                              {card.priority === "high" ? "Alta" : card.priority === "medium" ? "Média" : "Baixa"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {card.assignedTo && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />{card.assignedTo}
                              </span>
                            )}
                            {card.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />{formatDate(card.dueDate)}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
