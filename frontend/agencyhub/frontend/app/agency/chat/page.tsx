"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AgencySidebar } from "@/components/agency/sidebar"
import { AgencyHeader } from "@/components/agency/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Paperclip, Users, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [selectedChat, setSelectedChat] = useState<string | null>("team-1")
  const [message, setMessage] = useState("")

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "agency_owner") {
    router.push("/unauthorized")
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Mock data for team chats
  const teamChats = [
    {
      id: "team-1",
      name: "Equipe de Design",
      lastMessage: "Terminamos o mockup do cliente XYZ",
      time: "14:30",
      unread: 3,
      members: ["Maria Costa", "Pedro Santos", "Ana Lima"],
    },
    {
      id: "team-2",
      name: "Equipe de Marketing",
      lastMessage: "Vamos revisar a campanha amanhã?",
      time: "12:15",
      unread: 0,
      members: ["João Silva", "Carlos Mendes"],
    },
    {
      id: "team-3",
      name: "Desenvolvedores",
      lastMessage: "Deploy realizado com sucesso!",
      time: "Ontem",
      unread: 1,
      members: ["Lucas Ferreira", "Julia Rocha"],
    },
  ]

  // Mock data for client chats
  const clientChats = [
    {
      id: "client-1",
      name: "Tech Solutions LTDA",
      lastMessage: "Quando teremos o relatório mensal?",
      time: "15:20",
      unread: 2,
      status: "active",
    },
    {
      id: "client-2",
      name: "Startup Inovadora",
      lastMessage: "Obrigado pelo atendimento!",
      time: "Ontem",
      unread: 0,
      status: "active",
    },
    {
      id: "client-3",
      name: "E-commerce Brasil",
      lastMessage: "Precisamos ajustar a campanha de Black Friday",
      time: "2 dias atrás",
      unread: 5,
      status: "urgent",
    },
  ]

  // Mock messages
  const messages = [
    {
      id: 1,
      sender: "Maria Costa",
      senderId: "user-1",
      message: "Pessoal, terminamos o mockup do cliente XYZ. Podem dar uma olhada?",
      time: "14:25",
      isMe: false,
    },
    {
      id: 2,
      sender: "Pedro Santos",
      senderId: "user-2",
      message: "Ficou incrível! Só sugiro ajustar a paleta de cores.",
      time: "14:27",
      isMe: false,
    },
    {
      id: 3,
      sender: "Você",
      senderId: "me",
      message: "Concordo com o Pedro. Mas no geral está ótimo, parabéns!",
      time: "14:30",
      isMe: true,
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Logic to send message
      setMessage("")
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AgencySidebar onLogout={handleLogout} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AgencyHeader user={user} />
        <main className="flex-1 overflow-hidden bg-background p-6">
          <div className="h-full max-w-7xl mx-auto">
            <Tabs defaultValue="team" className="h-full flex flex-col">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Chat</h1>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="team" className="gap-2">
                    <Users className="h-4 w-4" />
                    Chat Interno
                  </TabsTrigger>
                  <TabsTrigger value="clients" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chat com Clientes
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="team" className="flex-1 mt-0">
                <div className="grid grid-cols-12 gap-4 h-full">
                  {/* Chat list */}
                  <Card className="col-span-4 flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">Conversas</CardTitle>
                      <Input placeholder="Buscar conversas..." className="mt-2" />
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                      <ScrollArea className="h-[calc(100vh-280px)]">
                        {teamChats.map((chat) => (
                          <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                              selectedChat === chat.id ? "bg-muted" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-sm">{chat.name}</h3>
                                  {chat.unread > 0 && (
                                    <Badge variant="default" className="h-5 min-w-5 px-1 text-xs">
                                      {chat.unread}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1">{chat.lastMessage}</p>
                                <p className="text-xs text-muted-foreground mt-1">{chat.members.length} membros</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{chat.time}</span>
                            </div>
                          </button>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Chat messages */}
                  <Card className="col-span-8 flex flex-col">
                    {selectedChat ? (
                      <>
                        <CardHeader className="border-b">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {teamChats.find((c) => c.id === selectedChat)?.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {teamChats.find((c) => c.id === selectedChat)?.members.join(", ")}
                              </CardDescription>
                            </div>
                            <Badge variant="outline">
                              {teamChats.find((c) => c.id === selectedChat)?.members.length} membros
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col p-4">
                          <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4">
                              {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}>
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {msg.sender
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className={`max-w-[70%] ${msg.isMe ? "text-right" : ""}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-xs font-medium">{msg.sender}</p>
                                      <p className="text-xs text-muted-foreground">{msg.time}</p>
                                    </div>
                                    <div
                                      className={`p-3 rounded-lg ${
                                        msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                                      }`}
                                    >
                                      <p className="text-sm">{msg.message}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>

                          <div className="flex gap-2 pt-4 border-t mt-4">
                            <Button variant="outline" size="icon">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <Input
                              placeholder="Digite sua mensagem..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <Button onClick={handleSendMessage}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground">Selecione uma conversa</p>
                      </div>
                    )}
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="clients" className="flex-1 mt-0">
                <div className="grid grid-cols-12 gap-4 h-full">
                  {/* Client chat list */}
                  <Card className="col-span-4 flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">Clientes</CardTitle>
                      <Input placeholder="Buscar clientes..." className="mt-2" />
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                      <ScrollArea className="h-[calc(100vh-280px)]">
                        {clientChats.map((chat) => (
                          <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                              selectedChat === chat.id ? "bg-muted" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-sm">{chat.name}</h3>
                                  {chat.unread > 0 && (
                                    <Badge variant="default" className="h-5 min-w-5 px-1 text-xs">
                                      {chat.unread}
                                    </Badge>
                                  )}
                                  {chat.status === "urgent" && (
                                    <Badge variant="destructive" className="h-5 px-2 text-xs">
                                      Urgente
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{chat.lastMessage}</p>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                            </div>
                          </button>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Client chat messages */}
                  <Card className="col-span-8 flex flex-col">
                    {selectedChat && clientChats.some((c) => c.id === selectedChat) ? (
                      <>
                        <CardHeader className="border-b">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {clientChats.find((c) => c.id === selectedChat)?.name}
                              </CardTitle>
                              <CardDescription className="mt-1">Cliente ativo</CardDescription>
                            </div>
                            <Badge
                              variant={
                                clientChats.find((c) => c.id === selectedChat)?.status === "urgent"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {clientChats.find((c) => c.id === selectedChat)?.status === "urgent"
                                ? "Urgente"
                                : "Ativo"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col p-4">
                          <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4">
                              <div className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>CL</AvatarFallback>
                                </Avatar>
                                <div className="max-w-[70%]">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-xs font-medium">
                                      {clientChats.find((c) => c.id === selectedChat)?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">15:20</p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-muted">
                                    <p className="text-sm">
                                      {clientChats.find((c) => c.id === selectedChat)?.lastMessage}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ScrollArea>

                          <div className="flex gap-2 pt-4 border-t mt-4">
                            <Button variant="outline" size="icon">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <Input
                              placeholder="Digite sua mensagem..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <Button onClick={handleSendMessage}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground">Selecione um cliente</p>
                      </div>
                    )}
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
