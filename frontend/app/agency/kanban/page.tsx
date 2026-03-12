"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, User, Lock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface DraggedCard {
  id: string
  sourceColumnId: string
  cardData: any
}

export default function KanbanPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const { toast } = useToast()
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [draggedCard, setDraggedCard] = useState<DraggedCard | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null)
  const [cards, setCards] = useState<any[]>([
    {
      id: "1",
      title: "Redesign do Website",
      description: "Atualizar o design do site principal do cliente com novo layout moderno",
      status: "todo",
      priority: "high",
      assignedTo: "Maria Silva",
      dueDate: new Date(2026, 0, 15),
      blocked: false,
      logs: [
        {
          id: "log1",
          user: "João Santos",
          action: "criou o card",
          timestamp: new Date(2026, 0, 5, 10, 30),
        },
      ],
    },
    {
      id: "2",
      title: "Campanha Meta Ads Q1",
      description: "Configurar e lançar campanhas de Meta Ads para o primeiro trimestre",
      status: "in_progress",
      priority: "high",
      assignedTo: "Carlos Oliveira",
      dueDate: new Date(2026, 0, 10),
      blocked: false,
      logs: [
        {
          id: "log2",
          user: "Maria Silva",
          action: "moveu de 'A Fazer' para 'Em Progresso'",
          timestamp: new Date(2026, 0, 6, 14, 20),
        },
        {
          id: "log3",
          user: "João Santos",
          action: "criou o card",
          timestamp: new Date(2026, 0, 5, 9, 15),
        },
      ],
    },
    {
      id: "3",
      title: "Relatório Mensal Dezembro",
      description: "Compilar métricas e criar relatório de performance de dezembro",
      status: "review",
      priority: "medium",
      assignedTo: "Ana Costa",
      dueDate: new Date(2026, 0, 8),
      blocked: false,
      logs: [
        {
          id: "log4",
          user: "Ana Costa",
          action: "moveu de 'Em Progresso' para 'Em Revisão'",
          timestamp: new Date(2026, 0, 7, 16, 45),
        },
      ],
    },
    {
      id: "4",
      title: "Otimização SEO Blog",
      description: "Revisar e otimizar posts do blog para melhor ranqueamento",
      status: "done",
      priority: "low",
      assignedTo: "Pedro Lima",
      dueDate: new Date(2026, 0, 5),
      blocked: false,
      logs: [
        {
          id: "log5",
          user: "Maria Silva",
          action: "moveu de 'Em Revisão' para 'Concluído'",
          timestamp: new Date(2026, 0, 6, 11, 30),
        },
      ],
    },
    {
      id: "5",
      title: "Contrato Cliente XYZ",
      description: "Aguardando assinatura do cliente antes de iniciar o projeto",
      status: "todo",
      priority: "high",
      assignedTo: "João Santos",
      dueDate: new Date(2026, 0, 20),
      blocked: true,
      blockReason: "Aguardando assinatura do contrato pelo cliente",
      logs: [
        {
          id: "log6",
          user: "João Santos",
          action: "bloqueou o card",
          timestamp: new Date(2026, 0, 6, 9, 0),
        },
      ],
    },
  ])
  const [showNewCardDialog, setShowNewCardDialog] = useState(false)
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
  })

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const hasKanbanPermission = true // In real app, check user.permissions.includes('kanban')

  const columns = [
    { id: "todo", title: "A Fazer", cards: cards.filter((c) => c.status === "todo") },
    { id: "in_progress", title: "Em Progresso", cards: cards.filter((c) => c.status === "in_progress") },
    { id: "review", title: "Em Revisão", cards: cards.filter((c) => c.status === "review") },
    { id: "done", title: "Concluído", cards: cards.filter((c) => c.status === "done") },
  ]

  const handleDragStart = (e: React.DragEvent, card: any, columnId: string) => {
    if (!hasKanbanPermission) {
      e.preventDefault()
      toast({
        title: "Sem permissão",
        description: "Você não tem permissão para mover cards no Kanban",
        variant: "destructive",
      })
      return
    }

    if (card.blocked) {
      e.preventDefault()
      toast({
        title: "Card bloqueado",
        description: card.blockReason || "Este card está bloqueado e não pode ser movido",
        variant: "destructive",
      })
      return
    }

    setDraggedCard({
      id: card.id,
      sourceColumnId: columnId,
      cardData: card,
    })
    e.dataTransfer.effectAllowed = "move"
    // Add visual feedback
    e.currentTarget.classList.add("opacity-50")
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50")
    setDraggedCard(null)
    setDragOverColumnId(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumnId(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumnId(null)
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    setDragOverColumnId(null)

    if (!draggedCard) return

    const { id, sourceColumnId, cardData } = draggedCard

    // If dropped in the same column, do nothing
    if (sourceColumnId === targetColumnId) {
      setDraggedCard(null)
      return
    }

    // Update card status
    const updatedCards = cards.map((card) => {
      if (card.id === id) {
        return { ...card, status: targetColumnId }
      }
      return card
    })

    // Add log entry
    const columnNames: Record<string, string> = {
      todo: "A Fazer",
      in_progress: "Em Progresso",
      review: "Em Revisão",
      done: "Concluído",
    }

    const updatedCardsWithLog = updatedCards.map((card) => {
      if (card.id === id) {
        return {
          ...card,
          logs: [
            {
              id: Date.now().toString(),
              user: user.name,
              action: `moveu de "${columnNames[sourceColumnId]}" para "${columnNames[targetColumnId]}"`,
              timestamp: new Date(),
            },
            ...card.logs,
          ],
        }
      }
      return card
    })

    setCards(updatedCardsWithLog)
    setDraggedCard(null)

    toast({
      title: "Card movido",
      description: `"${cardData.title}" foi movido para ${columnNames[targetColumnId]}`,
    })
  }

  const getPriorityColor = (priority: string) => {
    return priority === "high" ? "destructive" : priority === "medium" ? "default" : "secondary"
  }

  const getPriorityLabel = (priority: string) => {
    return priority === "high" ? "Alta" : priority === "medium" ? "Média" : "Baixa"
  }

  const handleCreateCard = () => {
    if (!newCard.title || !newCard.assignedTo || !newCard.dueDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, responsável e prazo",
        variant: "destructive",
      })
      return
    }

    const card = {
      id: Date.now().toString(),
      title: newCard.title,
      description: newCard.description,
      status: "todo",
      priority: newCard.priority,
      assignedTo: newCard.assignedTo,
      dueDate: new Date(newCard.dueDate),
      blocked: false,
      logs: [
        {
          id: Date.now().toString(),
          user: user.name,
          action: "criou o card",
          timestamp: new Date(),
        },
      ],
    }

    setCards([...cards, card])
    setShowNewCardDialog(false)
    setNewCard({ title: "", description: "", priority: "medium", assignedTo: "", dueDate: "" })

    toast({
      title: "Card criado",
      description: `"${card.title}" foi adicionado ao Kanban`,
    })
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Kanban" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Quadro Kanban</h2>
              <p className="text-muted-foreground">
                Gerencie suas tarefas e projetos - Arraste os cards para mudar o status
              </p>
            </div>
            <Button onClick={() => setShowNewCardDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Card
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{column.title}</h3>
                  <Badge variant="outline">{column.cards.length}</Badge>
                </div>

                <div
                  className={`space-y-3 min-h-[400px] rounded-lg p-3 transition-all ${
                    dragOverColumnId === column.id
                      ? "bg-primary/10 border-2 border-primary border-dashed"
                      : "bg-muted/30 border-2 border-transparent"
                  }`}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {column.cards.map((card) => {
                    const daysUntilDue = Math.ceil(
                      (card.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )
                    const isOverdue = daysUntilDue < 0
                    const isBlocked = card.blocked || false

                    return (
                      <Card
                        key={card.id}
                        draggable={hasKanbanPermission && !isBlocked}
                        onDragStart={(e) => handleDragStart(e, card, column.id)}
                        onDragEnd={handleDragEnd}
                        className={`transition-all ${
                          hasKanbanPermission && !isBlocked
                            ? "cursor-move hover:shadow-lg hover:scale-[1.02]"
                            : "cursor-not-allowed opacity-60"
                        } ${draggedCard?.id === card.id ? "opacity-50 scale-95" : ""}`}
                        onClick={() => setSelectedCard(card)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              {isBlocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                              {card.title}
                            </CardTitle>
                            <Badge variant={getPriorityColor(card.priority)} className="shrink-0">
                              {getPriorityLabel(card.priority)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-xs text-muted-foreground line-clamp-2">{card.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {card.assignedTo}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
                              {card.(typeof dueDate === "string" ? new Date(dueDate).toLocaleDateString("pt-BR") : dueDate instanceof Date ? dueDate.toLocaleDateString("pt-BR") : "")}
                            </span>
                          </div>
                          {isBlocked && (
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                              <Lock className="h-3 w-3 inline mr-1" />
                              {card.blockReason}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}

                  {column.cards.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      {dragOverColumnId === column.id ? "Solte o card aqui" : "Nenhum card nesta coluna"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog para criar novo card */}
      <Dialog open={showNewCardDialog} onOpenChange={setShowNewCardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={newCard.title}
                onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                placeholder="Ex: Redesign do Website"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newCard.description}
                onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                placeholder="Descreva a tarefa..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={newCard.priority} onValueChange={(value) => setNewCard({ ...newCard, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedTo">Responsável *</Label>
              <Input
                id="assignedTo"
                value={newCard.assignedTo}
                onChange={(e) => setNewCard({ ...newCard, assignedTo: e.target.value })}
                placeholder="Nome do responsável"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Prazo *</Label>
              <Input
                id="dueDate"
                type="date"
                value={newCard.dueDate}
                onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateCard} className="flex-1">
                Criar Card
              </Button>
              <Button variant="outline" onClick={() => setShowNewCardDialog(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Details Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCard?.title}</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Descrição</p>
                <p className="text-sm text-muted-foreground">{selectedCard.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Prioridade</p>
                  <Badge variant={getPriorityColor(selectedCard.priority)}>
                    {getPriorityLabel(selectedCard.priority)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Responsável</p>
                  <p className="text-sm text-muted-foreground">{selectedCard.assignedTo}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Prazo</p>
                <p className="text-sm text-muted-foreground">{selectedCard.(typeof dueDate === "string" ? new Date(dueDate).toLocaleDateString("pt-BR") : dueDate instanceof Date ? dueDate.toLocaleDateString("pt-BR") : "")}</p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Histórico de Atividades</p>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                  {selectedCard.logs.map((log: any) => (
                    <div key={log.id} className="text-sm border-l-2 border-primary pl-3">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">{log.user}</span> {log.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.timestamp.toLocaleString("pt-BR")}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Editar Card</Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedCard(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
