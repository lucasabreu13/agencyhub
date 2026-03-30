import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"
import { ArrowLeft } from "lucide-react"

export default function AgencyLoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/login">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <LoginForm type="agency" />
        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Cadastre sua agência grátis
          </Link>
        </p>
      </div>
    </div>
  )
}
