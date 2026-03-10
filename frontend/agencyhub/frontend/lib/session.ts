"use client"

import type { User } from "./auth"
import { getToken, removeToken } from "./api"

const SESSION_KEY = "user_session"

export function setSession(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }
}

export function getSession(): User | null {
  if (typeof window !== "undefined") {
    // Se não tem token JWT, a sessão não é válida
    if (!getToken()) {
      clearSession()
      return null
    }
    const session = localStorage.getItem(SESSION_KEY)
    return session ? JSON.parse(session) : null
  }
  return null
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY)
    removeToken()
  }
}
