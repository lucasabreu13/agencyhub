import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, BarChart3 } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">Spherum</span>
          </div>
          <h1 className="text-3xl font-bold">Escolha sua área de acesso</h1>
          <p className="text-muted-foreground">Selecione o portal adequado para fazer login</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all hover:border-primary">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Portal da Agência</CardTitle>
              <CardDescription>Para donos de agência gerenciarem clientes e projetos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/login/agency">Acessar Portal</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-primary">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Portal do Cliente</CardTitle>
              <CardDescription>Para clientes acompanharem suas campanhas e resultados</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/login/client">Acessar Portal</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-primary">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Área Administrativa</CardTitle>
              <CardDescription>Para administradores gerenciarem a plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/login/admin">Acessar Área</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-3">
          <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5">
            <p className="text-sm font-medium">Ainda não tem uma agência no AgencyHub?</p>
            <p className="text-sm text-muted-foreground mt-1">Crie sua conta em menos de 2 minutos e comece grátis por 14 dias.</p>
            <Button className="mt-3" asChild>
              <Link href="/register">Cadastrar minha agência →</Link>
            </Button>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/">Voltar para Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
