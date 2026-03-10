"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Target,
  LayoutDashboard,
  Users,
  Megaphone,
  FolderKanban,
  BarChart3,
  Settings,
  LogOut,
  UserCog,
  DollarSign,
  Trello,
  TrendingUp,
  Headphones,
  FolderOpen,
  UsersRound,
  MessageSquare,
  FileText,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onLogout: () => void
}

export function AgencySidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: "/agency", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/agency/clients", icon: Users, label: "Clientes" },
    { href: "/agency/crm", icon: UserCog, label: "CRM" },
    { href: "/agency/campaigns", icon: Megaphone, label: "Campanhas" },
    { href: "/agency/projects", icon: FolderKanban, label: "Projetos" },
    { href: "/agency/kanban", icon: Trello, label: "Kanban" },
    { href: "/agency/calendar", icon: Calendar, label: "Calendário" }, // Added calendar link
    { href: "/agency/financial", icon: DollarSign, label: "Financeiro" },
    { href: "/agency/invoices", icon: FileText, label: "Notas Fiscais" },
    { href: "/agency/goals", icon: TrendingUp, label: "Metas" },
    { href: "/agency/reports", icon: BarChart3, label: "Relatórios" },
    { href: "/agency/chat", icon: MessageSquare, label: "Chat" },
    { href: "/agency/support", icon: Headphones, label: "Suporte" },
    { href: "/agency/documents", icon: FolderOpen, label: "Documentos" },
    { href: "/agency/users", icon: UsersRound, label: "Usuários" },
    { href: "/agency/settings", icon: Settings, label: "Configurações" },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/30">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Target className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">AgencyHub</span>
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
