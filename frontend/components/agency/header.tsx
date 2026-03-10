"use client"

import type { User } from "@/lib/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  user: User
  title: string
}

export function AgencyHeader({ user, title }: HeaderProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user.name}</p>
          <Badge variant="secondary" className="text-xs">
            Dono da Agência
          </Badge>
        </div>
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
