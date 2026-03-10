"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, BarChart3, Users, Calendar, FileText, Target, Zap, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const translations = {
  pt: {
    nav: {
      features: "Recursos",
      pricing: "Planos",
      demo: "Demo",
      login: "Entrar",
      start: "Começar Agora",
    },
    hero: {
      badge: "Plataforma completa de gestão",
      title: "Gerencie sua agência de marketing com ",
      titleHighlight: "eficiência total",
      description:
        "Controle projetos, clientes, campanhas e resultados em um único lugar. Aumente a produtividade da sua agência em até 300%.",
      cta1: "Começar Gratuitamente",
      cta2: "Ver Demonstração",
      trial: "Sem cartão de crédito • Teste grátis por 14 dias",
    },
    features: {
      title: "Tudo que sua agência precisa",
      description: "Ferramentas profissionais para gerenciar cada aspecto do seu negócio",
      items: [
        { title: "Gestão de Clientes", description: "Organize e acompanhe todos os seus clientes em um só lugar" },
        { title: "Calendário de Campanhas", description: "Planeje e visualize todas as campanhas de forma intuitiva" },
        { title: "Relatórios Analíticos", description: "Dashboards completos com métricas e KPIs em tempo real" },
        { title: "Gestão de Projetos", description: "Controle tarefas, prazos e entregas com eficiência" },
        { title: "Portal do Cliente", description: "Seus clientes acompanham resultados em tempo real" },
        { title: "Automações", description: "Automatize processos e economize horas de trabalho" },
      ],
    },
    pricing: {
      title: "Planos que crescem com você",
      description: "Escolha o plano ideal para o tamanho da sua agência",
      perMonth: "/mês",
      plans: {
        basic: {
          name: "Básico",
          description: "Ideal para agências iniciantes",
          features: [
            "Até 10 clientes",
            "2 usuários da agência",
            "Gestão de projetos",
            "Relatórios básicos",
            "Portal do cliente",
            "Suporte por email",
          ],
        },
        pro: {
          name: "Profissional",
          description: "Para agências em crescimento",
          badge: "Mais Popular",
          features: [
            "Até 50 clientes",
            "10 usuários da agência",
            "Gestão completa de projetos",
            "Relatórios avançados + BI",
            "Portal do cliente personalizado",
            "White Label Completo: Logo, Cores e Domínio",
            "Automações de workflow",
            "API e integrações",
            "Suporte prioritário",
          ],
        },
        enterprise: {
          name: "Enterprise",
          description: "Para grandes agências",
          features: [
            "Clientes ilimitados",
            "Usuários ilimitados",
            "Tudo do plano Pro",
            "White label completo",
            "Integrações customizadas",
            "Gerente de conta dedicado",
            "SLA garantido 99.9%",
            "Suporte 24/7",
          ],
        },
      },
    },
    demo: {
      title: "Experimente a plataforma agora",
      description: "Acesse as áreas de demonstração e veja como funciona",
      portals: [
        { title: "Portal da Agência", description: "Gerencie clientes, projetos e campanhas da sua agência" },
        { title: "Portal do Cliente", description: "Veja como seus clientes acompanham campanhas e resultados" },
        { title: "Painel Admin", description: "Administre toda a plataforma e visualize estatísticas globais" },
      ],
      cta: "Acessar Demo",
    },
    cta: {
      title: "Pronto para transformar sua agência?",
      description: "Junte-se a centenas de agências que já usam o AgencyHub",
      button: "Começar Agora Gratuitamente",
    },
    footer: {
      description: "Plataforma completa de gestão para agências de marketing.",
      product: "Produto",
      company: "Empresa",
      legal: "Legal",
      about: "Sobre",
      blog: "Blog",
      contact: "Contato",
      privacy: "Privacidade",
      terms: "Termos",
      rights: "Todos os direitos reservados.",
    },
  },
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      demo: "Demo",
      login: "Login",
      start: "Get Started",
    },
    hero: {
      badge: "Complete management platform",
      title: "Manage your marketing agency with ",
      titleHighlight: "total efficiency",
      description:
        "Control projects, clients, campaigns and results in one place. Increase your agency's productivity by up to 300%.",
      cta1: "Start Free",
      cta2: "Watch Demo",
      trial: "No credit card • Free 14-day trial",
    },
    features: {
      title: "Everything your agency needs",
      description: "Professional tools to manage every aspect of your business",
      items: [
        { title: "Client Management", description: "Organize and track all your clients in one place" },
        { title: "Campaign Calendar", description: "Plan and visualize all campaigns intuitively" },
        { title: "Analytics Reports", description: "Complete dashboards with real-time metrics and KPIs" },
        { title: "Project Management", description: "Control tasks, deadlines and deliveries efficiently" },
        { title: "Client Portal", description: "Your clients track results in real time" },
        { title: "Automations", description: "Automate processes and save hours of work" },
      ],
    },
    pricing: {
      title: "Plans that grow with you",
      description: "Choose the ideal plan for your agency size",
      perMonth: "/month",
      plans: {
        basic: {
          name: "Basic",
          description: "Ideal for starting agencies",
          features: [
            "Up to 10 clients",
            "2 agency users",
            "Project management",
            "Basic reports",
            "Client portal",
            "Email support",
          ],
        },
        pro: {
          name: "Professional",
          description: "For growing agencies",
          badge: "Most Popular",
          features: [
            "Up to 50 clients",
            "10 agency users",
            "Complete project management",
            "Advanced reports + BI",
            "Customized client portal",
            "Complete White Label: Logo, Colors and Domain",
            "Workflow automations",
            "API and integrations",
            "Priority support",
          ],
        },
        enterprise: {
          name: "Enterprise",
          description: "For large agencies",
          features: [
            "Unlimited clients",
            "Unlimited users",
            "Everything from Pro plan",
            "Complete white label",
            "Custom integrations",
            "Dedicated account manager",
            "99.9% guaranteed SLA",
            "24/7 support",
          ],
        },
      },
    },
    demo: {
      title: "Try the platform now",
      description: "Access the demo areas and see how it works",
      portals: [
        { title: "Agency Portal", description: "Manage clients, projects and campaigns of your agency" },
        { title: "Client Portal", description: "See how your clients track campaigns and results" },
        { title: "Admin Panel", description: "Manage the entire platform and view global statistics" },
      ],
      cta: "Access Demo",
    },
    cta: {
      title: "Ready to transform your agency?",
      description: "Join hundreds of agencies already using AgencyHub",
      button: "Start Now for Free",
    },
    footer: {
      description: "Complete management platform for marketing agencies.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      about: "About",
      blog: "Blog",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      rights: "All rights reserved.",
    },
  },
  es: {
    nav: {
      features: "Características",
      pricing: "Precios",
      demo: "Demo",
      login: "Entrar",
      start: "Comenzar Ahora",
    },
    hero: {
      badge: "Plataforma completa de gestión",
      title: "Gestiona tu agencia de marketing con ",
      titleHighlight: "eficiencia total",
      description:
        "Controla proyectos, clientes, campañas y resultados en un solo lugar. Aumenta la productividad de tu agencia hasta un 300%.",
      cta1: "Comenzar Gratis",
      cta2: "Ver Demo",
      trial: "Sin tarjeta de crédito • Prueba gratis por 14 días",
    },
    features: {
      title: "Todo lo que tu agencia necesita",
      description: "Herramientas profesionales para gestionar cada aspecto de tu negocio",
      items: [
        { title: "Gestión de Clientes", description: "Organiza y rastrea todos tus clientes en un solo lugar" },
        { title: "Calendario de Campañas", description: "Planifica y visualiza todas las campañas de forma intuitiva" },
        { title: "Informes Analíticos", description: "Dashboards completos con métricas y KPIs en tiempo real" },
        { title: "Gestión de Proyectos", description: "Controla tareas, plazos y entregas con eficiencia" },
        { title: "Portal del Cliente", description: "Tus clientes siguen los resultados en tiempo real" },
        { title: "Automatizaciones", description: "Automatiza procesos y ahorra horas de trabajo" },
      ],
    },
    pricing: {
      title: "Planes que crecen contigo",
      description: "Elige el plan ideal para el tamaño de tu agencia",
      perMonth: "/mes",
      plans: {
        basic: {
          name: "Básico",
          description: "Ideal para agencias iniciantes",
          features: [
            "Hasta 10 clientes",
            "2 usuarios de la agencia",
            "Gestión de proyectos",
            "Informes básicos",
            "Portal del cliente",
            "Soporte por correo",
          ],
        },
        pro: {
          name: "Profesional",
          description: "Para agencias en crecimiento",
          badge: "Más Popular",
          features: [
            "Hasta 50 clientes",
            "10 usuarios de la agencia",
            "Gestión completa de proyectos",
            "Informes avanzados + BI",
            "Portal del cliente personalizado",
            "White Label Completo: Logo, Colores y Dominio",
            "Automatizaciones de flujo de trabajo",
            "API e integraciones",
            "Soporte prioritario",
          ],
        },
        enterprise: {
          name: "Enterprise",
          description: "Para grandes agencias",
          features: [
            "Clientes ilimitados",
            "Usuarios ilimitados",
            "Todo del plan Pro",
            "White label completo",
            "Integraciones personalizadas",
            "Gerente de cuenta dedicado",
            "SLA garantizado 99.9%",
            "Soporte 24/7",
          ],
        },
      },
    },
    demo: {
      title: "Prueba la plataforma ahora",
      description: "Accede a las áreas de demostración y ve cómo funciona",
      portals: [
        { title: "Portal de la Agencia", description: "Gestiona clientes, proyectos y campañas de tu agencia" },
        { title: "Portal del Cliente", description: "Ve cómo tus clientes siguen campañas y resultados" },
        { title: "Panel Admin", description: "Administra toda la plataforma y visualiza estadísticas globales" },
      ],
      cta: "Acceder Demo",
    },
    cta: {
      title: "¿Listo para transformar tu agencia?",
      description: "Únete a cientos de agencias que ya usan AgencyHub",
      button: "Comenzar Ahora Gratis",
    },
    footer: {
      description: "Plataforma completa de gestión para agencias de marketing.",
      product: "Producto",
      company: "Empresa",
      legal: "Legal",
      about: "Acerca",
      blog: "Blog",
      contact: "Contacto",
      privacy: "Privacidad",
      terms: "Términos",
      rights: "Todos los derechos reservados.",
    },
  },
}

const currencies = {
  BRL: { symbol: "R$", rates: { basic: 197, pro: 497, enterprise: 997 } },
  USD: { symbol: "$", rates: { basic: 39, pro: 99, enterprise: 199 } },
  EUR: { symbol: "€", rates: { basic: 37, pro: 93, enterprise: 187 } },
}

const locales = [
  { code: "pt", name: "Português (BR)", currency: "BRL", flag: "🇧🇷" },
  { code: "en", name: "English (US)", currency: "USD", flag: "🇺🇸" },
  { code: "es", name: "Español (ES)", currency: "EUR", flag: "🇪🇸" },
]

export default function LandingPage() {
  const [locale, setLocale] = useState<"pt" | "en" | "es">("pt")
  const [currency, setCurrency] = useState<"BRL" | "USD" | "EUR">("BRL")

  const t = translations[locale]
  const currencyData = currencies[currency]

  const handleLocaleChange = (newLocale: "pt" | "en" | "es", newCurrency: "BRL" | "USD" | "EUR") => {
    setLocale(newLocale)
    setCurrency(newCurrency)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AgencyHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              {t.nav.features}
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              {t.nav.pricing}
            </a>
            <a href="#demo" className="text-sm font-medium hover:text-primary transition-colors">
              {t.nav.demo}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{locales.find((l) => l.code === locale)?.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {locales.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => handleLocaleChange(l.code as any, l.currency as any)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-lg">{l.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{l.name}</span>
                      <span className="text-xs text-muted-foreground">{l.currency}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">{t.nav.login}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="#pricing">{t.nav.start}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="mb-4">
            {t.hero.badge}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            {t.hero.title}
            <span className="text-primary">{t.hero.titleHighlight}</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">{t.hero.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="#pricing">{t.hero.cta1}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#demo">{t.hero.cta2}</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-2">{t.hero.trial}</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.features.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.features.description}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[Users, Calendar, BarChart3, FileText, Target, Zap].map((Icon, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <Icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{t.features.items[idx].title}</CardTitle>
                  <CardDescription>{t.features.items[idx].description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.pricing.title}</h2>
            <p className="text-lg text-muted-foreground">{t.pricing.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{t.pricing.plans.basic.name}</CardTitle>
                <CardDescription>{t.pricing.plans.basic.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">
                    {currencyData.symbol} {currencyData.rates.basic}
                  </span>
                  <span className="text-muted-foreground">{t.pricing.perMonth}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {t.pricing.plans.basic.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline" asChild>
                  <Link href="/login">{t.nav.start}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="flex flex-col border-primary shadow-lg relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t.pricing.plans.pro.badge}</Badge>
              <CardHeader>
                <CardTitle className="text-2xl">{t.pricing.plans.pro.name}</CardTitle>
                <CardDescription>{t.pricing.plans.pro.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">
                    {currencyData.symbol} {currencyData.rates.pro}
                  </span>
                  <span className="text-muted-foreground">{t.pricing.perMonth}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {t.pricing.plans.pro.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className={`text-sm ${idx === 5 ? "font-semibold" : ""}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/login">{t.nav.start}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{t.pricing.plans.enterprise.name}</CardTitle>
                <CardDescription>{t.pricing.plans.enterprise.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">
                    {currencyData.symbol} {currencyData.rates.enterprise}
                  </span>
                  <span className="text-muted-foreground">{t.pricing.perMonth}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {t.pricing.plans.enterprise.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline" asChild>
                  <Link href="/login">
                    {locale === "en" ? "Contact Sales" : locale === "es" ? "Hablar con Ventas" : "Falar com Vendas"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{t.demo.title}</h2>
          <p className="text-lg text-muted-foreground">{t.demo.description}</p>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {[Target, Users, BarChart3].map((Icon, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{t.demo.portals[idx].title}</CardTitle>
                  <CardDescription className="min-h-12">{t.demo.portals[idx].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-transparent" variant="outline" asChild>
                    <Link href={idx === 0 ? "/login/agency" : idx === 1 ? "/login/client" : "/login/admin"}>
                      {t.demo.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-primary text-primary-foreground rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{t.cta.title}</h2>
          <p className="text-lg opacity-90">{t.cta.description}</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#pricing">{t.cta.button}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">AgencyHub</span>
              </div>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    {t.nav.features}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-primary transition-colors">
                    {t.nav.pricing}
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-primary transition-colors">
                    {t.nav.demo}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t.footer.about}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t.footer.blog}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t.footer.contact}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t.footer.privacy}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    {t.footer.terms}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 AgencyHub. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
