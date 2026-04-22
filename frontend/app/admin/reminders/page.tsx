"use client"
import { formatDate } from "@/lib/utils"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { adminApi } from "@/lib/api"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Plus, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function RemindersPage() {
  const { user, loading, logout } = useAuth("admin")
  const { data: remindersData, refetch } = useApi(() => adminApi.getReminders())
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", priority: "medium" })

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Carregando...</div>

  const reminders: any[] = remindersData?.data || []
  const pending = (reminders || []).filter((r: any) => !r.completed)
  const completed = (reminders || []).filter((r: any) => r.completed)

  const getPriorityBadge = (priority: string) => {
    const map: any = {
      high: <Badge variant="destructive">Alta</Badge>,
      medium: <Badge className="bg-yellow-500">Média</Badge>,
      low: <Badge variant="outline">Baixa</Badge>,
    }
    return map[priority] || <Badge variant="outline">{priority}</Badge>
  }

  const handleCreate = async () => {
    await adminApi.createReminder(form)
    setShowDialog(false)
    setForm({ title: "", description: "", date: "", time: "", priority: "medium" })
    refetch?.()
  }

  const handleToggle = async (id: string) => {
    await adminApi.toggleReminder(id)
    refetch?.()
  }

  const ReminderCard = ({ reminder }: { reminder: any }) => (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      <button onClick={() => handleToggle(reminder.id)} className="mt-0.5">
        {reminder.completed
          ? <CheckCircle2 className="h-5 w-5 text-green-500" />
          : <AlertCircle className="h-5 w-5 text-yellow-500" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium text-sm ${reminder.completed ? "line-through text-muted-foreground" : ""}`}>
            {reminder.title}
          </span>
          {getPriorityBadge(reminder.priority)}
        </div>
        {reminder.description && <p className="text-xs text-muted-foreground mt-0.5">{reminder.description}</p>}
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          {reminder.date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(reminder.date)}</span>}
          {reminder.time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{reminder.time}</span>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <AdminHeader user={user} title="Lembretes" />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Lembretes</h2>
              <p className="text-muted-foreground">Gerencie seus lembretes e tarefas</p>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Novo Lembrete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo Lembrete</DialogTitle></DialogHeader>
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
                      <Label>Data</Label>
                      <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Hora</Label>
                      <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                    </div>
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
                  <Button onClick={handleCreate} className="w-full">Criar Lembrete</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />Pendentes
                  <Badge variant="secondary">{(pending || []).length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(pending || []).length === 0
                  ? <p className="text-muted-foreground text-sm text-center py-4">Nenhum lembrete pendente.</p>
                  : pending.map((r: any) => <ReminderCard key={r.id} reminder={r} />)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />Concluídos
                  <Badge variant="secondary">{(completed || []).length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(completed || []).length === 0
                  ? <p className="text-muted-foreground text-sm text-center py-4">Nenhum lembrete concluído.</p>
                  : completed.map((r: any) => <ReminderCard key={r.id} reminder={r} />)}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
