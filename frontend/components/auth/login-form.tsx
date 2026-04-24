"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, getRedirectPath } from "@/lib/auth"
import { setSession } from "@/lib/session"

interface LoginFormProps {
  type: "admin" | "agency" | "client"
}

export function LoginForm({ type }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getTitle = () => {
    switch (type) {
      case "admin": return "Área Administrativa"
      case "agency": return "Portal da Agência"
      case "client": return "Portal do Cliente"
    }
  }

  const getDescription = () => {
    switch (type) {
      case "admin": return "Acesse o painel administrativo da plataforma"
      case "agency": return "Gerencie sua agência e clientes"
      case "client": return "Acompanhe suas campanhas e resultados"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = await signIn(email, password)

      if (!user) {
        setError("Email ou senha inválidos")
        setLoading(false)
        return
      }

      const expectedRole =
        type === "admin" ? "admin" : type === "agency" ? "agency_owner" : "agency_client"

      if (user.role !== expectedRole) {
        setError("Você não tem permissão para acessar esta área")
        setLoading(false)
        return
      }

      setSession(user)
      router.push(getRedirectPath(user.role))
    } catch (err) {
      setError("Erro ao conectar com o servidor")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <a href="/forgot-password" className="underline">
              Esqueci minha senha
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
