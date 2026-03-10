"use client"

import { useEffect, useState } from "react"
import type { User } from "@/lib/auth"
import { signOut } from "@/lib/auth"
import { getSession, clearSession } from "@/lib/session"
import { useRouter } from "next/navigation"

export function useAuth(requiredRole?: User["role"]) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const session = getSession()

    if (!session) {
      router.push("/login")
      return
    }

    if (requiredRole && session.role !== requiredRole) {
      router.push("/unauthorized")
      return
    }

    setUser(session)
    setLoading(false)
  }, [requiredRole, router])

  const logout = async () => {
    await signOut()
    clearSession()
    router.push("/")
  }

  return { user, loading, logout }
}
