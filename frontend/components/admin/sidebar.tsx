"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Target,
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  Settings,
  LogOut,
  Headphones,
  FileText,
  Bell,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  onLogout: () => void
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/agencies", icon: Building2, label: "Agências" },
    { href: "/admin/users", icon: Users, label: "Usuários" },
    { href: "/admin/revenue", icon: Wallet, label: "Financeiro" },
    { href: "/admin/tickets", icon: Headphones, label: "Chamados" },
    { href: "/admin/goals", icon: TrendingUp, label: "Metas" },
    { href: "/admin/reminders", icon: Bell, label: "Lembretes" },
    { href: "/admin/audit", icon: FileText, label: "Logs e Auditoria" },
    { href: "/admin/settings", icon: Settings, label: "Configurações" },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/30">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Target className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">AgencyHub Admin</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3", isActive && "bg-primary/10 text-primary")}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )
}
