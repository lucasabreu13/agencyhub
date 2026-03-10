"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Target,
  LayoutDashboard,
  Megaphone,
  FileText,
  MessageSquare,
  LogOut,
  FolderOpen,
  HeadphonesIcon,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ClientSidebarProps {
  onLogout: () => void
}

export function ClientSidebar({ onLogout }: ClientSidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: "/client", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/client/campaigns", icon: Megaphone, label: "Campanhas" },
    { href: "/client/reports", icon: FileText, label: "Relatórios" },
    { href: "/client/documents", icon: FolderOpen, label: "Documentos" },
    { href: "/client/financial", icon: CreditCard, label: "Financeiro" }, // Added financial link
    { href: "/client/support", icon: HeadphonesIcon, label: "Suporte" },
    { href: "/client/messages", icon: MessageSquare, label: "Mensagens" },
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
