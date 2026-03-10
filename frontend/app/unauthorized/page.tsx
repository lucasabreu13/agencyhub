import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Acesso Negado</h1>
        <p className="text-muted-foreground max-w-md">Você não tem permissão para acessar esta área da plataforma.</p>
        <Button asChild>
          <Link href="/">Voltar para Home</Link>
        </Button>
      </div>
    </div>
  )
}
