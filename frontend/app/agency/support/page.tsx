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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Clock, CheckCircle2, XCircle, AlertCircle, MessageSquare } from "lucide-react"

export default function AgencySupportPage() {
  const { user, loading, logout } = useAuth("agency_owner")
  const { data: ticketsData, refetch } = useApi(() => agencyApi.getSupportTickets())
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" })

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>
  if (!user) return null

  const tickets = ticketsData?.data || ticketsData || []
  const filtered = filterStatus === "all" ? tickets : (tickets || []).filter((t: any) => t.status === filterStatus)

  const getStatusBadge = (status: string) => {
    const map: any = {
      open: <Badge className="bg-blue-500">Aberto</Badge>,
      in_progress: <Badge className="bg-yellow-500">Em Progresso</Badge>,
      resolved: <Badge className="bg-green-500">Resolvido</Badge>,
      closed: <Badge className="bg-gray-500">Fechado</Badge>,
    }
    return map[status] || <Badge>{status}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const map: any = {
      low: <Badge variant="outline">Baixa</Badge>,
      medium: <Badge variant="outline" className="border-yellow-500 text-yellow-600">Média</Badge>,
      high: <Badge variant="outline" className="border-orange-500 text-orange-600">Alta</Badge>,
      urgent: <Badge variant="destructive">Urgente</Badge>,
    }
    return map[priority] || <Badge variant="outline">{priority}</Badge>
  }

  const handleCreate = async () => {
    await agencyApi.createSupportTicket(form)
    setShowNewTicket(false)
    setForm({ title: "", description: "", priority: "medium" })
    refetch?.()
  }

  return (
    <div className="flex h-screen">
      <AgencySidebar onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <AgencyHeader user={user} title="Suporte" />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Suporte</h2>
              <p className="text-muted-foreground">Gerencie seus tickets de suporte</p>
            </div>
            <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Novo Ticket</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo Ticket</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreate} className="w-full">Criar Ticket</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-2">
            {["all","open","in_progress","resolved","closed"].map(s => (
              <Button key={s} variant={filterStatus === s ? "default" : "outline"} size="sm" onClick={() => setFilterStatus(s)}>
                {s === "all" ? "Todos" : s === "open" ? "Abertos" : s === "in_progress" ? "Em Progresso" : s === "resolved" ? "Resolvidos" : "Fechados"}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {(filtered || []).length === 0 ? (
              <Card><CardContent className="p-6 text-center text-muted-foreground">Nenhum ticket encontrado.</CardContent></Card>
            ) : (
              (filtered || []).map((ticket: any) => (
                <Card key={ticket.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{ticket.title}</p>
                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                        <div className="flex gap-2 mt-2">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criado em {formatDate(ticket.createdAt)}
                        </p>
                      </div>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
