"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Video, Bell, X, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type EventType = "reuniao" | "compromisso" | "tarefa" | "financeiro" | "bloqueio"
type ViewMode = "mes" | "semana" | "dia" | "agenda"
type EventStatus = "convidado" | "aceito" | "recusado" | "talvez"
type RecurrenceType = "nenhuma" | "diaria" | "semanal" | "mensal" | "anual"

interface CalendarEvent {
  id: string
  title: string
  type: EventType
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  allDay: boolean
  location?: string
  meetingLink?: string
  organizer: string
  participants: Array<{ name: string; email: string; status: EventStatus }>
  reminders: number[]
  recurrence: RecurrenceType
  visibility: "publico" | "privado" | "participantes"
  calendar: string
  color: string
}

export default function AgencyCalendarPage() {
  const { user, logout } = useAuth("agency_owner")
  const [viewMode, setViewMode] = useState<ViewMode>("mes")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "meu-calendario",
    "equipe",
    "financeiro",
    "reunioes",
    "tarefas",
  ])

  // Mock events
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Reunião com Cliente - Campanha Q1",
      type: "reuniao",
      description: "Apresentar proposta de campanha para o primeiro trimestre",
      startDate: "2026-01-08",
      startTime: "10:00",
      endDate: "2026-01-08",
      endTime: "11:30",
      allDay: false,
      location: "Sala de Reuniões 1",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      organizer: "João Silva",
      participants: [
        { name: "Maria Santos", email: "maria@cliente.com", status: "aceito" },
        { name: "Pedro Costa", email: "pedro@agencia.com", status: "aceito" },
      ],
      reminders: [15, 60],
      recurrence: "nenhuma",
      visibility: "participantes",
      calendar: "comercial",
      color: "#3b82f6",
    },
    {
      id: "2",
      title: "Pagamento Fornecedor XYZ",
      type: "financeiro",
      description: "Vencimento da fatura #1234",
      startDate: "2026-01-10",
      startTime: "09:00",
      endDate: "2026-01-10",
      endTime: "09:00",
      allDay: true,
      organizer: "Sistema",
      participants: [],
      reminders: [1440],
      recurrence: "mensal",
      visibility: "privado",
      calendar: "financeiro",
      color: "#ef4444",
    },
    {
      id: "3",
      title: "Entrega de Relatório Mensal",
      type: "tarefa",
      description: "Finalizar e enviar relatório de performance",
      startDate: "2026-01-15",
      startTime: "17:00",
      endDate: "2026-01-15",
      endTime: "18:00",
      allDay: false,
      organizer: "João Silva",
      participants: [],
      reminders: [60, 1440],
      recurrence: "mensal",
      visibility: "publico",
      calendar: "operacional",
      color: "#10b981",
    },
  ])

  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: "reuniao",
    allDay: false,
    participants: [],
    reminders: [15],
    recurrence: "nenhuma",
    visibility: "participantes",
    calendar: "comercial",
    color: "#3b82f6",
  })

  if (!user) {
    return <div>Carregando...</div>
  }

  const handleLogout = () => {
    logout()
  }

  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Array<{ date: number; isCurrentMonth: boolean; fullDate: Date }> = []

    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthDays - i),
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i),
      })
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((event) => event.startDate === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.startDate || !newEvent.startTime) {
      return
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      type: newEvent.type || "reuniao",
      description: newEvent.description || "",
      startDate: newEvent.startDate!,
      startTime: newEvent.startTime!,
      endDate: newEvent.endDate || newEvent.startDate!,
      endTime: newEvent.endTime || newEvent.startTime!,
      allDay: newEvent.allDay || false,
      location: newEvent.location,
      meetingLink: newEvent.meetingLink,
      organizer: user.name,
      participants: newEvent.participants || [],
      reminders: newEvent.reminders || [15],
      recurrence: newEvent.recurrence || "nenhuma",
      visibility: newEvent.visibility || "participantes",
      calendar: newEvent.calendar || "comercial",
      color: newEvent.color || "#3b82f6",
    }

    setEvents([...events, event])
    setShowEventDialog(false)
    setNewEvent({
      type: "reuniao",
      allDay: false,
      participants: [],
      reminders: [15],
      recurrence: "nenhuma",
      visibility: "participantes",
      calendar: "comercial",
      color: "#3b82f6",
    })
  }

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case "reuniao":
        return "bg-blue-500"
      case "compromisso":
        return "bg-purple-500"
      case "tarefa":
        return "bg-green-500"
      case "financeiro":
        return "bg-red-500"
      case "bloqueio":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case "reuniao":
        return "Reunião"
      case "compromisso":
        return "Compromisso"
      case "tarefa":
        return "Tarefa"
      case "financeiro":
        return "Financeiro"
      case "bloqueio":
        return "Bloqueio"
      default:
        return "Evento"
    }
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={handleLogout} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AgencyHeader user={user} />

        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Calendário</h1>
              <p className="text-muted-foreground">Gerencie reuniões, eventos e compromissos</p>
            </div>
          </div>

          {/* Top Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button onClick={() => navigateMonth("prev")} variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button onClick={goToToday} variant="outline">
                    Hoje
                  </Button>
                  <Button onClick={() => navigateMonth("next")} variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <h2 className="ml-4 text-xl font-semibold">
                    {(typeof currentDate === "string" ? new Date(currentDate).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : currentDate instanceof Date ? currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : "")}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                    <TabsList>
                      <TabsTrigger value="dia">Dia</TabsTrigger>
                      <TabsTrigger value="semana">Semana</TabsTrigger>
                      <TabsTrigger value="mes">Mês</TabsTrigger>
                      <TabsTrigger value="agenda">Agenda</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <Button onClick={() => setShowEventDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Evento
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { id: "meu-calendario", label: "Meu calendário", color: "bg-blue-500" },
                  { id: "equipe", label: "Equipe", color: "bg-purple-500" },
                  { id: "financeiro", label: "Financeiro", color: "bg-red-500" },
                  { id: "reunioes", label: "Reuniões", color: "bg-green-500" },
                  { id: "tarefas", label: "Tarefas", color: "bg-orange-500" },
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveFilters((prev) =>
                        prev.includes(filter.id) ? prev.filter((f) => f !== filter.id) : [...prev, filter.id],
                      )
                    }}
                  >
                    <div className={cn("mr-2 h-3 w-3 rounded-full", filter.color)} />
                    {filter.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          {viewMode === "mes" && (
            <Card>
              <CardContent className="p-6">
                {/* Week days header */}
                <div className="mb-2 grid grid-cols-7 gap-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {getMonthDays().map((day, index) => {
                    const dayEvents = getEventsForDate(day.fullDate)
                    const isToday = day.fullDate.toDateString() === new Date().toDateString() && day.isCurrentMonth

                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-[120px] rounded-lg border p-2 hover:bg-muted/50 cursor-pointer transition-colors",
                          !day.isCurrentMonth && "bg-muted/20 text-muted-foreground",
                          isToday && "border-primary border-2",
                        )}
                        onClick={() => {
                          // Could open day view or create event
                        }}
                      >
                        <div className={cn("mb-1 text-sm font-medium", isToday && "text-primary")}>{day.date}</div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                "rounded px-2 py-1 text-xs text-white truncate cursor-pointer hover:opacity-80",
                                getEventTypeColor(event.type),
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedEvent(event)
                                setShowEventDialog(true)
                              }}
                            >
                              {!event.allDay && event.startTime} {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} mais</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agenda View */}
          {viewMode === "agenda" && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {events
                    .sort((a, b) => a.startDate.localeCompare(b.startDate))
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedEvent(event)
                          setShowEventDialog(true)
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-sm text-muted-foreground">
                            {new Date(event.startDate).toLocaleDateString("pt-BR", { day: "2-digit" })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.startDate).toLocaleDateString("pt-BR", { month: "short" })}
                          </div>
                        </div>

                        <div className={cn("mt-1 h-10 w-1 rounded-full", getEventTypeColor(event.type))} />

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            <Badge variant="outline">{getEventTypeLabel(event.type)}</Badge>
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.allDay ? "Dia inteiro" : `${event.startTime} - ${event.endTime}`}
                            </div>

                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            )}

                            {event.meetingLink && (
                              <div className="flex items-center gap-1">
                                <Video className="h-4 w-4" />
                                Online
                              </div>
                            )}

                            {event.participants.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {event.participants.length} participantes
                              </div>
                            )}
                          </div>

                          {event.description && (
                            <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Event Dialog */}
          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedEvent ? "Detalhes do Evento" : "Novo Evento"}</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="detalhes" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                  <TabsTrigger value="participantes">Participantes</TabsTrigger>
                  <TabsTrigger value="opcoes">Opções</TabsTrigger>
                </TabsList>

                <TabsContent value="detalhes" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do evento *</Label>
                    <Input
                      id="title"
                      value={selectedEvent?.title || newEvent.title || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Ex: Reunião com cliente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo do evento</Label>
                    <Select
                      value={selectedEvent?.type || newEvent.type}
                      onValueChange={(value: EventType) => setNewEvent({ ...newEvent, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reuniao">Reunião</SelectItem>
                        <SelectItem value="compromisso">Compromisso</SelectItem>
                        <SelectItem value="tarefa">Tarefa com prazo</SelectItem>
                        <SelectItem value="financeiro">Evento financeiro</SelectItem>
                        <SelectItem value="bloqueio">Bloqueio de agenda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição / Pauta</Label>
                    <Textarea
                      id="description"
                      value={selectedEvent?.description || newEvent.description || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Detalhes do evento..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data de início *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={selectedEvent?.startDate || newEvent.startDate || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startTime">Hora de início *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={selectedEvent?.startTime || newEvent.startTime || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        disabled={newEvent.allDay}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data de término</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={selectedEvent?.endDate || newEvent.endDate || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">Hora de término</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={selectedEvent?.endTime || newEvent.endTime || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        disabled={newEvent.allDay}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allDay"
                      checked={selectedEvent?.allDay || newEvent.allDay}
                      onCheckedChange={(checked) => setNewEvent({ ...newEvent, allDay: checked as boolean })}
                    />
                    <Label htmlFor="allDay" className="cursor-pointer">
                      Evento de dia inteiro
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <div className="flex gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
                      <Input
                        id="location"
                        value={selectedEvent?.location || newEvent.location || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="Ex: Sala de reuniões 1 ou endereço"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meetingLink">Link da reunião online</Label>
                    <div className="flex gap-2">
                      <Video className="h-5 w-5 text-muted-foreground mt-2" />
                      <Input
                        id="meetingLink"
                        value={selectedEvent?.meetingLink || newEvent.meetingLink || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                        placeholder="Ex: https://meet.google.com/..."
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="participantes" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Organizador</Label>
                    <div className="flex items-center gap-2 rounded-lg border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Adicionar participantes</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Nome ou e-mail" />
                      <Button>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {(selectedEvent?.participants || []).length > 0 && (
                    <div className="space-y-2">
                      <Label>Participantes ({selectedEvent?.participants.length})</Label>
                      <div className="space-y-2">
                        {selectedEvent?.participants.map((participant, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                {participant.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{participant.name}</div>
                                <div className="text-xs text-muted-foreground">{participant.email}</div>
                              </div>
                            </div>
                            <Badge
                              variant={
                                participant.status === "aceito"
                                  ? "default"
                                  : participant.status === "recusado"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {participant.status === "aceito" && <Check className="mr-1 h-3 w-3" />}
                              {participant.status === "recusado" && <X className="mr-1 h-3 w-3" />}
                              {participant.status === "talvez" && <AlertCircle className="mr-1 h-3 w-3" />}
                              {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="opcoes" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="recurrence">Recorrência</Label>
                    <Select
                      value={selectedEvent?.recurrence || newEvent.recurrence}
                      onValueChange={(value: RecurrenceType) => setNewEvent({ ...newEvent, recurrence: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nenhuma">Não se repete</SelectItem>
                        <SelectItem value="diaria">Diariamente</SelectItem>
                        <SelectItem value="semanal">Semanalmente</SelectItem>
                        <SelectItem value="mensal">Mensalmente</SelectItem>
                        <SelectItem value="anual">Anualmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibilidade</Label>
                    <Select
                      value={selectedEvent?.visibility || newEvent.visibility}
                      onValueChange={(value: any) => setNewEvent({ ...newEvent, visibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="publico">Público</SelectItem>
                        <SelectItem value="privado">Privado</SelectItem>
                        <SelectItem value="participantes">Apenas participantes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calendar">Calendário</Label>
                    <Select
                      value={selectedEvent?.calendar || newEvent.calendar}
                      onValueChange={(value) => setNewEvent({ ...newEvent, calendar: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pessoal">Pessoal</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="operacional">Operacional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lembretes</Label>
                    <div className="space-y-2">
                      {[
                        { value: 5, label: "5 minutos antes" },
                        { value: 15, label: "15 minutos antes" },
                        { value: 60, label: "1 hora antes" },
                        { value: 1440, label: "1 dia antes" },
                      ].map((reminder) => (
                        <div key={reminder.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`reminder-${reminder.value}`}
                            checked={(newEvent.reminders || []).includes(reminder.value)}
                            onCheckedChange={(checked) => {
                              const current = newEvent.reminders || []
                              setNewEvent({
                                ...newEvent,
                                reminders: checked
                                  ? [...current, reminder.value]
                                  : current.filter((r) => r !== reminder.value),
                              })
                            }}
                          />
                          <Label htmlFor={`reminder-${reminder.value}`} className="cursor-pointer">
                            <Bell className="mr-2 inline h-4 w-4" />
                            {reminder.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEventDialog(false)
                    setSelectedEvent(null)
                  }}
                >
                  Cancelar
                </Button>
                {selectedEvent ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setEvents(events.filter((e) => e.id !== selectedEvent.id))
                      setShowEventDialog(false)
                      setSelectedEvent(null)
                    }}
                  >
                    Excluir Evento
                  </Button>
                ) : (
                  <Button onClick={handleCreateEvent}>Criar Evento</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
