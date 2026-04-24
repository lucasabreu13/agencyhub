"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authApi, type RegisterAgencyPayload } from "@/lib/api"
import { setToken } from "@/lib/api"
import { setSession } from "@/lib/session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  Zap,
  Star,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Plan = "basic" | "pro" | "enterprise"

interface FormData {
  plan: Plan
  agencyName: string
  ownerName: string
  ownerEmail: string
  ownerPassword: string
  ownerPasswordConfirm: string
  ownerPhone: string
}

// ─── Configuração dos planos ──────────────────────────────────────────────────

const PLANS = [
  {
    id: "basic" as Plan,
    name: "Starter",
    price: "R$ 197",
    period: "/mês",
    icon: Zap,
    color: "border-blue-200 hover:border-blue-400",
    activeColor: "border-blue-500 bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-700",
    features: ["Até 5 clientes", "Campanhas ilimitadas", "Relatórios mensais", "Kanban e Projetos", "Suporte por email"],
  },
  {
    id: "pro" as Plan,
    name: "Pro",
    price: "R$ 397",
    period: "/mês",
    icon: Star,
    color: "border-purple-200 hover:border-purple-400",
    activeColor: "border-purple-500 bg-purple-50",
    badgeColor: "bg-purple-100 text-purple-700",
    popular: true,
    features: ["Clientes ilimitados", "CRM completo", "Financeiro avançado", "Metas e KPIs", "Suporte prioritário"],
  },
  {
    id: "enterprise" as Plan,
    name: "Scale",
    price: "R$ 797",
    period: "/mês",
    icon: Crown,
    color: "border-amber-200 hover:border-amber-400",
    activeColor: "border-amber-500 bg-amber-50",
    badgeColor: "bg-amber-100 text-amber-700",
    features: ["Tudo do Pro", "Multi-usuário avançado", "API dedicada", "SLA garantido", "Gerente de conta dedicado"],
  },
]

// ─── Indicador de força de senha ──────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const labels = ["", "Fraca", "Regular", "Boa", "Forte"]
  const colors = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"]

  if (!password) return null

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn("h-1 flex-1 rounded-full transition-colors", i <= score ? colors[score] : "bg-muted")}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Senha {labels[score] || "muito fraca"}</p>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState<FormData>({
    plan: "pro",
    agencyName: "",
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
    ownerPasswordConfirm: "",
    ownerPhone: "",
  })

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  // ── Validação do passo 2 ──────────────────────────────────────────────────

  function validateStep2(): string | null {
    if (!form.agencyName.trim()) return "Informe o nome da agência"
    if (!form.ownerName.trim()) return "Informe seu nome completo"
    if (!form.ownerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail))
      return "Informe um email válido"
    if (form.ownerPassword.length < 8) return "A senha deve ter no mínimo 8 caracteres"
    if (form.ownerPassword !== form.ownerPasswordConfirm) return "As senhas não conferem"
    return null
  }

  // ── Submissão ─────────────────────────────────────────────────────────────

  async function handleSubmit() {
    const validationError = validateStep2()
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const payload: RegisterAgencyPayload = {
        agencyName: form.agencyName.trim(),
        plan: form.plan,
        ownerName: form.ownerName.trim(),
        ownerEmail: form.ownerEmail.trim().toLowerCase(),
        ownerPassword: form.ownerPassword,
        ownerPhone: form.ownerPhone.trim() || undefined,
      }

      const { access_token, user } = await authApi.register(payload)

      setToken(access_token)
      setSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId,
        createdAt: new Date(),
      })

      setStep(3)

      // Redireciona para o painel após 3 segundos
      setTimeout(() => router.push("/agency"), 3000)
    } catch (err: any) {
      setError(err?.message || "Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlan = PLANS.find((p) => p.id === form.plan)!

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <Target className="h-7 w-7 text-primary" />
        <span className="font-bold text-xl">AgencyHub</span>
      </div>

      {/* Progress */}
      {step < 3 && (
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  step > s
                    ? "bg-primary text-primary-foreground"
                    : step === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              <span className={cn("text-sm hidden sm:block", step === s ? "font-medium" : "text-muted-foreground")}>
                {s === 1 ? "Escolha o plano" : "Dados da conta"}
              </span>
              {s < 2 && <div className="h-px w-8 bg-border" />}
            </div>
          ))}
        </div>
      )}

      {/* ── Passo 1: Plano ────────────────────────────────────────────────── */}

      {step === 1 && (
        <div className="w-full max-w-3xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Escolha seu plano</h1>
            <p className="text-muted-foreground mt-1">Comece grátis por 14 dias. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const Icon = plan.icon
              const isSelected = form.plan === plan.id
              return (
                <div
                  key={plan.id}
                  onClick={() => update("plan", plan.id)}
                  className={cn(
                    "relative cursor-pointer rounded-xl border-2 p-5 transition-all",
                    isSelected ? plan.activeColor : plan.color,
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground text-xs px-3">Mais popular</Badge>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                  <Icon className="h-8 w-8 mb-3 text-primary" />
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-1">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center">
            <Button variant="ghost" asChild>
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Já tenho conta
              </Link>
            </Button>
            <Button onClick={() => setStep(2)} size="lg" className="gap-2">
              Continuar com o plano {selectedPlan.name}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Passo 2: Dados ────────────────────────────────────────────────── */}

      {step === 2 && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dados da sua conta</CardTitle>
                <CardDescription className="mt-1">Agência e acesso do responsável</CardDescription>
              </div>
              <Badge className={selectedPlan.badgeColor}>{selectedPlan.name}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Agência */}
            <div className="space-y-1.5">
              <Label htmlFor="agencyName" className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Nome da agência
              </Label>
              <Input
                id="agencyName"
                placeholder="Pixel Agency"
                value={form.agencyName}
                onChange={(e) => update("agencyName", e.target.value)}
              />
            </div>

            <div className="border-t pt-4 space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Responsável</p>

              {/* Nome */}
              <div className="space-y-1.5">
                <Label htmlFor="ownerName" className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Nome completo
                </Label>
                <Input
                  id="ownerName"
                  placeholder="Mariana Costa"
                  value={form.ownerName}
                  onChange={(e) => update("ownerName", e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="ownerEmail" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email de acesso
                </Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="mariana@suaagencia.com.br"
                  value={form.ownerEmail}
                  onChange={(e) => update("ownerEmail", e.target.value)}
                />
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <Label htmlFor="ownerPhone" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Telefone <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Input
                  id="ownerPhone"
                  type="tel"
                  placeholder="(11) 99999-0000"
                  value={form.ownerPhone}
                  onChange={(e) => update("ownerPhone", e.target.value)}
                />
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <Label htmlFor="ownerPassword" className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Senha
                </Label>
                <Input
                  id="ownerPassword"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={form.ownerPassword}
                  onChange={(e) => update("ownerPassword", e.target.value)}
                />
                <PasswordStrength password={form.ownerPassword} />
              </div>

              {/* Confirmar senha */}
              <div className="space-y-1.5">
                <Label htmlFor="ownerPasswordConfirm">Confirmar senha</Label>
                <Input
                  id="ownerPasswordConfirm"
                  type="password"
                  placeholder="Repita a senha"
                  value={form.ownerPasswordConfirm}
                  onChange={(e) => update("ownerPasswordConfirm", e.target.value)}
                />
                {form.ownerPasswordConfirm && form.ownerPassword !== form.ownerPasswordConfirm && (
                  <p className="text-xs text-destructive">As senhas não conferem</p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent" disabled={isLoading}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar minha conta
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Ao criar sua conta você concorda com nossos{" "}
              <span className="underline cursor-pointer">Termos de Uso</span> e{" "}
              <span className="underline cursor-pointer">Política de Privacidade</span>.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Passo 3: Sucesso ──────────────────────────────────────────────── */}

      {step === 3 && (
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8 space-y-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Conta criada com sucesso!</h2>
              <p className="text-muted-foreground">
                Bem-vindo(a) ao AgencyHub, <strong>{form.ownerName.split(" ")[0]}</strong>! 🎉
              </p>
              <p className="text-sm text-muted-foreground">
                Enviamos um email de boas-vindas para <strong>{form.ownerEmail}</strong>.
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-left space-y-2">
              <p className="text-sm font-medium">Pronto para começar? Seu painel já tem:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-green-600" />Meta inicial criada</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-green-600" />Lembretes de configuração</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-green-600" />Board Kanban com primeiras tarefas</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button className="w-full" onClick={() => router.push("/agency")}>
                Acessar meu painel agora
              </Button>
              <p className="text-xs text-muted-foreground">
                Redirecionando automaticamente em 3 segundos...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
