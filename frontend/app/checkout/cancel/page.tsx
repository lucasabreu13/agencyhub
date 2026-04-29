"use client"

import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-400" />
          </div>
          <CardTitle className="text-2xl text-red-700">Pagamento cancelado</CardTitle>
          <CardDescription className="text-base mt-2">
            Nenhuma cobrança foi realizada. Você pode tentar novamente a qualquer momento.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-center">
          <Button asChild className="w-full">
            <Link href="/agency">Voltar para o painel</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/register">Escolher um plano</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
