// Integração real com o backend — substitui o mock anterior

import { authApi, setToken, removeToken, type ApiUser } from "./api"

export type UserRole = "admin" | "agency_owner" | "agency_client"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  agencyId?: string
  createdAt: Date
}

function apiUserToUser(u: ApiUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    agencyId: u.agencyId,
    createdAt: new Date(u.createdAt),
  }
}

export async function signIn(email: string, password: string): Promise<User | null> {
  try {
    const { access_token, user } = await authApi.login(email, password)
    setToken(access_token)
    return apiUserToUser(user)
  } catch {
    return null
  }
}

export async function getUser(): Promise<User | null> {
  try {
    const user = await authApi.me()
    return apiUserToUser(user)
  } catch {
    return null
  }
}

export async function signOut(): Promise<void> {
  try {
    await authApi.logout()
  } finally {
    removeToken()
  }
}

export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin"
    case "agency_owner":
      return "/agency"
    case "agency_client":
      return "/client"
    default:
      return "/"
  }
}
