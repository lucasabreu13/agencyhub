"use client"
import { formatDate } from "@/lib/utils"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { agencyApi } from "@/lib/api"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react"

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
const DAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]

export default function CalendarPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const { data: eventsData, refetch } = useApi(() => agencyApi.getEvents())
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [form, setForm] = useState({ title: "", date: "", time: "", type: "meeting", description: "" })

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>
  if (!user) return null

  const events = eventsData?.data || eventsData || []

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getEventsForDay = (day: number) => {
    return (events || []).filter((e: any) => {
      const d = new Date(e.date || e.startDate)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  const typeColor: any = {
    meeting: "bg-blue-500",
    deadline: "bg-red-500",
    reminder: "bg-yellow-500",
    other: "bg-gray-500",
  }

  const handleCreate = async () => {
    await agencyApi.createEvent({ ...form })
    setShowNewEvent(false)
    setForm({ title: "", date: "", time: "", type: "meeting", description: "" })
    refetch?.()
  }

  const days: Array<{ day: number | null }> = []
  for (let i = 0; i < firstDay; i++) days.push({ day: null })
  for (let i = 1; i <= daysInMonth; i++) days.push({ day: i })

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Calendário" />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Calendário</h2>
              <p className="text-muted-foreground">Gerencie eventos e compromissos</p>
            </div>
            <Dialog open={showNewEvent} onOpenChange={setShowNewEvent}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Novo Evento</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo Evento</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Hora</Label>
                      <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Reunião</SelectItem>
                        <SelectItem value="deadline">Prazo</SelectItem>
                        <SelectItem value="reminder">Lembrete</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreate} className="w-full">Criar Evento</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <h3 className="text-lg font-semibold">{MONTHS[month]} {year}</h3>
                <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(d => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((item, i) => {
                  if (!item.day) return <div key={i} />
                  const dayEvents = getEventsForDay(item.day)
                  const isToday = new Date().getDate() === item.day && new Date().getMonth() === month && new Date().getFullYear() === year
                  return (
                    <div key={i} className={`min-h-[60px] p-1 rounded border text-xs ${isToday ? "border-primary bg-primary/5" : "border-transparent hover:border-border"}`}>
                      <span className={`font-medium ${isToday ? "text-primary" : ""}`}>{item.day}</span>
                      <div className="space-y-0.5 mt-0.5">
                        {dayEvents.slice(0, 2).map((e: any) => (
                          <div key={e.id} className={`${typeColor[e.type] || "bg-gray-500"} text-white rounded px-1 truncate`}>
                            {e.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && <div className="text-muted-foreground">+{dayEvents.length - 2}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
