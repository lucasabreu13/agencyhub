import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"
import { ArrowLeft } from "lucide-react"

export default async function ClientLoginPage() {
  const cookieStore = await cookies()
  if (cookieStore.get("auth_token")?.value) redirect("/client")
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/login">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <LoginForm type="client" />
      </div>
    </div>
  )
}
