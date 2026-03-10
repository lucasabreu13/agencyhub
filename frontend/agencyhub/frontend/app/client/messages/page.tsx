"use client"

import { useAuth } from "@/hooks/use-auth"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Paperclip } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ClientMessagesPage() {
  const { user, loading, logout } = useAuth("agency_client")

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const messages = [
    {
      id: 1,
      sender: "agency",
      name: "João Silva",
      message: "Olá! Seguem os relatórios da semana. As campanhas estão performando muito bem!",
      time: "10:30",
      date: "Hoje",
    },
    {
      id: 2,
      sender: "client",
      name: user.name,
      message: "Ótimo! Obrigado pelo update. Podemos agendar uma call para discutir os próximos passos?",
      time: "10:45",
      date: "Hoje",
    },
    {
      id: 3,
      sender: "agency",
      name: "João Silva",
      message: "Claro! Que tal amanhã às 14h?",
      time: "11:00",
      date: "Hoje",
    },
  ]

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />

      <div className="flex-1 overflow-auto">
        <ClientHeader user={user} title="Mensagens" />

        <div className="p-6 h-[calc(100vh-4rem)]">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Chat com sua Agência</CardTitle>
              <CardDescription>Converse diretamente com o time da Marketing Pro Agency</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[70%] ${msg.sender === "client" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {msg.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className={msg.sender === "client" ? "text-right" : ""}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-medium">{msg.name}</p>
                          <p className="text-xs text-muted-foreground">{msg.time}</p>
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.sender === "client" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input placeholder="Digite sua mensagem..." />
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
