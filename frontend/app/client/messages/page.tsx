"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useApi } from "@/hooks/use-api"
import { clientApi } from "@/lib/api"
import { ClientSidebar } from "@/components/client/sidebar"
import { ClientHeader } from "@/components/client/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function ClientMessagesPage() {
  const { user, loading, logout } = useAuth("agency_client")
  const { data: conversationsData } = useApi(() => clientApi.getMessages())
  const [selectedConv, setSelectedConv] = useState<string | null>(null)
  const [messagesData, setMessagesData] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const conversations = conversationsData?.data || conversationsData || []

  useEffect(() => {
    if (selectedConv) {
      clientApi.getMessages(selectedConv).then((res: any) => {
        setMessagesData(res?.messages || res?.data || [])
      })
    }
  }, [selectedConv])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesData])

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Carregando...</div>

  const handleSend = async () => {
    if (!message.trim() || !selectedConv) return
    await clientApi.sendMessage(selectedConv, { content: message })
    setMessage("")
    const res: any = await clientApi.getMessages(selectedConv)
    setMessagesData(res?.messages || res?.data || [])
  }

  const selectedConvData = conversations.find((c: any) => c.id === selectedConv)

  return (
    <div className="flex h-screen">
      <ClientSidebar onLogout={logout} />
      <div className="flex-1 flex overflow-hidden">
        {/* Lista */}
        <div className="w-72 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Mensagens</h2>
          </div>
          <ScrollArea className="flex-1">
            {(conversations || []).length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Nenhuma conversa.</p>
            ) : (
              (conversations || []).map((conv: any) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 border-b ${selectedConv === conv.id ? "bg-muted" : ""}`}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{conv.name?.[0] || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{conv.name || "Agência"}</span>
                      {conv.unreadCount > 0 && (
                        <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs">{conv.unreadCount}</Badge>
                      )}
                    </div>
                    {conv.lastMessage && <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Mensagens */}
        <div className="flex-1 flex flex-col">
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Selecione uma conversa</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{selectedConvData?.name?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{selectedConvData?.name || "Agência"}</span>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {(messagesData || []).map((msg: any) => {
                    const isMe = msg.senderId === user.id || msg.sender === "client"
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <p>{msg.content || msg.message}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {msg.time || formatDate(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} size="icon"><Send className="h-4 w-4" /></Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
