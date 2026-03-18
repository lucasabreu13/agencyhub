"use client"
import { formatDate } from "@/lib/utils"

import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { agencyApi } from "@/lib/api"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, User, Lock } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// O backend retorna { backlog: [], todo: [], doing: [], review: [], done: [] }
// Convertemos para o formato de colunas que o frontend usa
const COLUMN_META: Record<string, { title: string; order: number }> = {
  backlog:    { title: "Backlog",       order: 0 },
  todo:       { title: "A Fazer",       order: 1 },
  doing:      { title: "Em Progresso",  order: 2 },
  review:     { title: "Em Revisão",    order: 3 },
  done:       { title: "Concluído",     order: 4 },
}

export default function KanbanPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const { data: kanbanData, refetch } = useApi(() => agencyApi.getKanbanBoard())
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", column: "todo", priority: "medium", assignedTo: "" })

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>
  if (!user) return null

  // Converter formato do backend para colunas
  const columns = Object.entries(COLUMN_META)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([colId, meta]) => ({
      id: colId,
      title: meta.title,
      cards: (kanbanData?.[colId] || []) as any[],
    }))

  const getPriorityColor = (priority: string) => {
    const map: any = { high: "destructive", medium: "outline", low: "secondary" }
    return map[priority] || "outline"
  }

  const getPriorityLabel = (priority: string) => {
    const map: any = { high: "Alta", medium: "Média", low: "Baixa" }
    return map[priority] || priority
  }

  const handleCreate = async () => {
    if (!form.title.trim()) return
    await agencyApi.createTask(form)
    setShowDialog(false)
    setForm({ title: "", description: "", column: "todo", priority: "medium", assignedTo: "" })
    refetch?.()
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
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Nova Tarefa</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nova Tarefa</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Coluna</Label>
                      <Select value={form.column} onValueChange={v => setForm({ ...form, column: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(COLUMN_META).map(([id, meta]) => (
                            <SelectItem key={id} value={id}>{meta.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Responsável</Label>
                    <Input value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} placeholder="Nome do responsável" />
                  </div>
                  <Button onClick={handleCreate} className="w-full">Criar Tarefa</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((col) => (
              <div key={col.id} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{col.title}</h3>
                  <Badge variant="secondary">{col.cards.length}</Badge>
                </div>
                <div className="space-y-3">
                  {col.cards.length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm text-muted-foreground">
                      Sem tarefas
                    </div>
                  ) : (
                    col.cards.map((card: any) => (
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
                              {getPriorityLabel(card.priority)}
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
