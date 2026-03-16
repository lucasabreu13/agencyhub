// app/page.tsx
// Next.js (App Router) + Tailwind
// Coloque este arquivo em: /app/page.tsx
// Requer: Tailwind configurado no projeto (globals.css com @tailwind base/components/utilities)

"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

const logos = [
  "AgencyOne",
  "North Studio",
  "Pulse Media",
  "Vertex Ads",
  "MonoWorks",
  "Blackline Growth",
  "Orbit Labs",
  "Astra Marketing",
  "Nova Creative",
  "Slate Agency",
];

const features = [
  {
    title: "Workflows & Automação",
    desc: "Gatilhos inteligentes para mover projetos do onboarding ao fechamento do mês.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M7 7h10v10H7z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M17 7l3-3M7 17l-3 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Comunicação Centralizada",
    desc: "Threads por projeto, anexos, aprovações e histórico rastreável.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M7 10h10M7 14h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M5 5h14v14H5z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    title: "KPIs e Escala",
    desc: "Dashboards por conta: performance, tarefas, aprovações e saúde de operação.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M5 19V9M12 19V5M19 19v-7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Portal do Cliente",
    desc: "Cliente acompanha resultados, aprova criativos e vê métricas sem te chamar no WhatsApp.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M8 12l2 2 6-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 5h14v14H5z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    title: "Relatórios Automáticos",
    desc: "Relatórios consistentes com cadência e templates por tipo de serviço.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M8 7h8M7 12h10M8 17h8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M5 4h14v16H5z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    title: "Lucratividade em Tempo Real",
    desc: "Horas, custos e margem por cliente para decisões rápidas e seguras.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M7 20V4M17 20V4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M7 8h10M7 16h10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "O Spherum serve para agências pequenas?",
    a: "Sim. Você começa simples (onboarding, tarefas, aprovações) e vai ativando automações e dashboards conforme cresce. O plano Starter é perfeito para começar.",
  },
  {
    q: "Como funciona a integração com ferramentas que já uso?",
    a: "O Spherum se integra com as principais ferramentas do mercado (Meta Ads, Google Ads, Analytics, etc.) para centralizar dados e relatórios em um único lugar.",
  },
  {
    q: "Preciso migrar tudo de uma vez?",
    a: "Não. Você pode iniciar por um squad/conta e expandir conforme o playbook fica redondo. A migração é gradual e sem fricção.",
  },
  {
    q: "Qual o tempo de implementação?",
    a: "Setup em minutos. Você pode começar a usar imediatamente e ir configurando automações e personalizações conforme sua operação evolui.",
  },
  {
    q: "Os dados dos meus clientes ficam seguros?",
    a: "Sim. Utilizamos criptografia de ponta a ponta, servidores em cloud com certificações de segurança e backups automáticos diários.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim, sem multas ou burocracias. Você mantém acesso aos seus dados por 30 dias após o cancelamento para exportar o que precisar.",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Hook para contagem animada
function useAnimatedCounter(end: number, decimals: number = 0, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const multiplier = Math.pow(10, decimals);

  useEffect(() => {
    if (!hasAnimated) return;
    
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(end * easeOutQuart * multiplier) / multiplier);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, hasAnimated, multiplier]);

  const startAnimation = useCallback(() => setHasAnimated(true), []);

  return { count, startAnimation };
}

// Componente de animação scroll-triggered
function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

function Glow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[120px]" />
    </div>
  );
}

// Componente de Analytics
function AnalyticsSection() {
  const chartData = [45, 62, 58, 73, 68, 81, 75, 92, 88, 94, 89, 96];
  const maxValue = Math.max(...chartData);

  return (
    <div className="space-y-4">
      {/* Métricas principais */}
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="ROAS Médio"
          value={4.2}
          suffix="x"
          decimals={1}
          change={12}
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <MetricCard
          label="CAC Médio"
          value={38}
          prefix="R$ "
          change={-9}
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M12 19V5M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <MetricCard
          label="Aprovações"
          value={92}
          suffix="%"
          change={18}
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
        />
      </div>

      {/* Gráfico de performance */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium text-white/90">Performance ROAS</div>
          <div className="text-xs text-white/50">Últimos 12 meses</div>
        </div>
        <div className="flex items-end justify-between gap-1.5" style={{ height: '80px' }}>
          {chartData.map((value, i) => {
            const heightPercent = (value / maxValue) * 100;
            return (
              <div
                key={i}
                className="group relative flex-1"
              >
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-violet-500/80 to-violet-400/60 transition-all duration-300 group-hover:from-violet-500 group-hover:to-violet-400"
                  style={{ height: `${heightPercent}%` }}
                />
                <div className="absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white group-hover:block">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge de confiança */}
      <div className="flex items-center justify-center gap-2 text-xs text-white/50">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-violet-400" fill="none">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Dados verificados de +150 agências parceiras</span>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  change,
  icon,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change: number;
  icon: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { count, startAnimation } = useAnimatedCounter(value, decimals);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startAnimation();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [startAnimation]);

  const isPositive = change > 0;
  const displayValue = isVisible ? (decimals > 0 ? count.toFixed(decimals) : count) : 0;

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all hover:border-violet-400/30 hover:bg-white/[0.06]"
    >
      {/* Gradient hover effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
      </div>

      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-white/60">{label}</span>
          <div className={cn(
            "flex h-6 w-6 items-center justify-center rounded-lg",
            isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {icon}
          </div>
        </div>
        
        <div className="mb-1 font-[Sora] text-2xl tracking-tight text-white">
          {prefix}{displayValue}{suffix}
        </div>
        
        <div className={cn(
          "text-xs font-medium",
          isPositive ? "text-emerald-400" : "text-rose-400"
        )}>
          {isPositive ? "+" : ""}{change}% este mês
        </div>
      </div>
    </div>
  );
}

function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl",
        "before:absolute before:inset-0 before:bg-[radial-gradient(600px_240px_at_20%_10%,rgba(99,102,241,0.22),transparent_60%),radial-gradient(500px_280px_at_80%_30%,rgba(0,242,255,0.14),transparent_60%)] before:opacity-60 before:content-['']",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Button({
  variant = "ghost",
  children,
  href,
}: {
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  href?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition will-change-transform";
  const ghost =
    "border border-white/10 bg-white/[0.04] text-white hover:-translate-y-0.5 hover:border-white/20";
  const primary =
    "border border-violet-400/30 bg-gradient-to-br from-violet-500/90 to-violet-500/50 text-white shadow-[0_14px_44px_rgba(99,102,241,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_54px_rgba(99,102,241,0.38)]";

  const cls = cn(base, variant === "primary" ? primary : ghost);

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <button className={cls}>{children}</button>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur-xl">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_14px_rgba(99,102,241,0.6)]" />
      {children}
    </div>
  );
}

function Sphere() {
  return (
    <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03]">
      <div className="absolute h-[260px] w-[260px] rounded-full border border-white/10 opacity-60 [transform:rotateX(70deg)_rotateZ(25deg)] shadow-[0_0_40px_rgba(99,102,241,0.16)]" />
      <div className="relative h-[150px] w-[150px] animate-[float_4.8s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.85),rgba(255,255,255,0.15)_28%,rgba(255,255,255,0)_55%),radial-gradient(circle_at_65%_70%,rgba(0,242,255,0.26),transparent_55%),radial-gradient(circle_at_40%_60%,rgba(99,102,241,0.33),transparent_60%),radial-gradient(circle_at_55%_45%,rgba(255,255,255,0.10),rgba(0,0,0,0.85)_70%)] shadow-[0_30px_90px_rgba(0,0,0,0.65),0_0_55px_rgba(99,102,241,0.22)] saturate-110">
        <div className="absolute -inset-5 animate-[spin_8s_linear_infinite] rounded-full bg-[conic-gradient(from_180deg,rgba(99,102,241,0),rgba(99,102,241,0.18),rgba(0,242,255,0),rgba(0,242,255,0.16),rgba(99,102,241,0))] opacity-55 blur-xl" />
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes float { 0%,100%{ transform: translateY(2px)} 50%{ transform: translateY(-10px)} }
        @keyframes spin { to { transform: rotate(360deg)} }
      `}</style>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/85">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          Agency Analytics
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="mb-3 grid gap-2 md:grid-cols-3">
        {[
          { k: "ROAS", v: "4.2x", d: "+12% este mês" },
          { k: "CAC", v: "R$ 38", d: "-9% este mês" },
          { k: "Aprovações", v: "92%", d: "em 24h" },
        ].map((m) => (
          <div
            key={m.k}
            className="rounded-2xl border border-white/10 bg-black/25 p-3"
          >
            <div className="text-xs text-white/60">{m.k}</div>
            <div className="font-[Sora] text-lg tracking-[-0.2px]">{m.v}</div>
            <div className="text-xs text-white/55">{m.d}</div>
          </div>
        ))}
      </div>

      <div className="relative h-14 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.0)),radial-gradient(140px_60px_at_35%_40%,rgba(99,102,241,0.24),transparent_60%),radial-gradient(140px_60px_at_70%_70%,rgba(0,242,255,0.14),transparent_60%)]">
        <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-90">
          <path
            d="M0,110 C90,60 140,140 220,90 C300,40 360,120 430,80 C510,35 560,105 600,70"
            fill="none"
            stroke="rgba(229,231,235,0.65)"
            strokeWidth="2.5"
          />
          <path
            d="M0,130 C90,80 140,150 220,110 C300,70 360,130 430,105 C510,65 560,120 600,95"
            fill="none"
            stroke="rgba(99,102,241,0.55)"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    </div>
  );
}

function LogoCarousel() {
  // CSS marquee infinito (sem dependências)
  const row = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />

      <div className="flex gap-6 whitespace-nowrap py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex min-w-full animate-[marquee_18s_linear_infinite] gap-6">
          {row.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.20em] text-white/45"
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function PricingCard({
  name,
  priceMonthly,
  priceAnnual,
  highlight,
  bullets,
  isAnnual,
}: {
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  highlight?: string;
  bullets: string[];
  isAnnual: boolean;
}) {
  const displayPrice = isAnnual ? priceAnnual : priceMonthly;
  
  return (
    <GlassCard
      className={cn(
        "p-6 relative",
        highlight &&
          "ring-2 ring-violet-400/50 border-violet-400/40 bg-[linear-gradient(180deg,rgba(99,102,241,0.12),rgba(255,255,255,0.03))] shadow-[0_0_40px_rgba(99,102,241,0.2)]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-[Sora] text-lg">{name}</div>
          {highlight ? (
            <div className="mt-2 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-white/85">
              {highlight}
            </div>
          ) : (
            <div className="mt-2 text-sm text-white/60">
              Para operação previsível
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-end gap-2">
          <div className="font-[Sora] text-3xl tracking-[-0.6px]">
            {displayPrice}
          </div>
          <div className="pb-1 text-sm text-white/60">/mês</div>
        </div>
      </div>

      <ul className="mt-5 space-y-3 text-sm text-white/70">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1 h-4 w-4 flex-none rounded-full border border-white/10 bg-white/[0.04] text-center text-[10px] leading-4 text-white/70">
              ✓
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-3">
        <Button variant={highlight ? "primary" : "ghost"} href="/login">
          Começar
        </Button>
      </div>
    </GlassCard>
  );
}

function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  
  return (
    <section id="pricing" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-[Sora] text-2xl tracking-[-0.4px] md:text-3xl">
          Planos para sua agência escalar com previsibilidade
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
          Escolha o plano ideal para o momento da sua agência e escale conforme cresce.
        </p>

        {/* Toggle Mensal/Anual */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-white" : "text-white/50")}>
              Mensal
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-7 w-12 flex-shrink-0 rounded-full border border-white/10 bg-white/[0.04] transition-colors hover:border-white/20"
            >
              <div
                className={cn(
                  "absolute top-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg transition-transform duration-200",
                  isAnnual ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-white" : "text-white/50")}>
              Anual
            </span>
          </div>
          <span className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-white/85">
            Economize até 20%
          </span>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PricingCard
            name="Starter"
            priceMonthly="R$ 197"
            priceAnnual="R$ 167"
            isAnnual={isAnnual}
            bullets={[
              "Até 3 colaboradores",
              "Até 5 clientes ativos",
              "Onboarding + tarefas + aprovações",
              "Portal do cliente básico",
              "Relatórios e templates essenciais",
              "Suporte padrão por email",
            ]}
          />
          <PricingCard
            name="Pro"
            priceMonthly="R$ 397"
            priceAnnual="R$ 337"
            isAnnual={isAnnual}
            highlight="Mais vendido"
            bullets={[
              "Até 10 colaboradores",
              "Até 15 clientes ativos",
              "Workflows + automações avançadas",
              "Dashboards por conta com KPIs em tempo real",
              "Permissões e perfis customizados",
              "Portal do cliente premium",
              "Relatórios automáticos personalizados",
              "Suporte prioritário",
            ]}
          />
          <PricingCard
            name="Scale"
            priceMonthly="R$ 797"
            priceAnnual="R$ 677"
            isAnnual={isAnnual}
            bullets={[
              "Até 25 colaboradores",
              "Até 50 clientes ativos",
              "Multi-squads + governança avançada",
              "Lucratividade em tempo real por cliente",
              "Auditoria de ações + logs completos",
              "API e integrações customizadas",
              "SLA garantido + suporte prioritário 24/7",
              "Onboarding personalizado",
            ]}
          />
          <PricingCard
            name="Personalizado"
            priceMonthly="Sob consulta"
            priceAnnual="Sob consulta"
            isAnnual={isAnnual}
            bullets={[
              "Colaboradores ilimitados",
              "Clientes ilimitados",
              "Infraestrutura dedicada",
              "Integrações customizadas",
              "CSM dedicado",
              "Treinamento personalizado",
              "SLA premium garantido",
              "Suporte 24/7 prioritário",
            ]}
          />
        </div>

        <div className="mt-6 text-center text-xs text-white/50">
          Todos os planos incluem 14 dias de teste gratuito · Sem cartão · Cancele quando quiser
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[linear-gradient(180deg,#0B1220,#0D0D0D_45%)] text-white">
      <Glow />

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3 font-[Sora] font-bold tracking-[0.2px]">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(99,102,241,0.7)]" />
            Spherum
          </div>

          <nav className="hidden items-center gap-5 text-sm font-medium text-white/60 md:flex">
            <a className="hover:text-white" href="#ecosistema">
              Ecossistema
            </a>
            <a className="hover:text-white" href="#pilares">
              Pilares
            </a>
            <a className="hover:text-white" href="#features">
              Recursos
            </a>
            <a className="hover:text-white" href="#pricing">
              Planos
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="primary" href="/login">Entrar</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pb-10 pt-12 md:pb-16 md:pt-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 md:grid-cols-2">
          <div>
            <Badge>O sistema que sua agência necessita</Badge>

            <h1 className="mt-4 font-[Sora] text-[clamp(38px,4.6vw,56px)] leading-[1.05] tracking-[-0.7px]">
              Organize, Automate, Scale.
            </h1>

            <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-white/70">
              <span className="text-white/90">
                O sistema nervoso central da sua agência de marketing.
              </span>{" "}
              Saia do caos operacional. Centralize processos, automatize entregas
              e escale sua operação com o Spherum — a plataforma que une o time
              e o cliente em um só lugar.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" href="/login">
                Começar Teste Gratuito
              </Button>
            </div>

            <div className="mt-4 text-xs text-white/55">
              Sem cartão · Setup em minutos · Portal para clientes
            </div>
          </div>

          <div>
            <AnalyticsSection />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - CAROUSEL */}
      <section className="relative pb-6">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
            Agências que confiam no Spherum
          </div>
          <LogoCarousel />
        </div>
      </section>

      {/* ECOSSISTEMA DUAL - INTRO */}
      <section id="ecosistema" className="relative py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal>
            <h2 className="font-[Sora] text-2xl tracking-[-0.4px] md:text-3xl">
              Dois portais. Uma operação. Zero ruído.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
              O Spherum separa o que é execução pesada do que é experiência premium.
              Seu time trabalha com dados e automações — e seu cliente acompanha
              tudo com clareza, em um portal dedicado.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* PORTAL DA AGÊNCIA SECTION */}
      <section className="relative py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal>
            <h2 className="font-[Sora] text-2xl tracking-[-0.4px] md:text-3xl">
              Portal da Agência: Operação & Controle
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
              Centralize toda a operação da sua agência em um único lugar. 
              Gestão completa de projetos, automações e dados para seu time executar sem fricção.
            </p>
          </ScrollReveal>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            <GlassCard className="flex items-center justify-center overflow-hidden p-6 md:p-8">
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                  <div className="text-center">
                    <svg viewBox="0 0 24 24" className="mx-auto h-16 w-16 text-white/40" fill="none">
                      <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M2 8h20M8 3v5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
                      <circle cx="16" cy="13" r="1.5" fill="currentColor"/>
                      <circle cx="12" cy="17" r="1.5" fill="currentColor"/>
                    </svg>
                    <p className="mt-4 text-sm text-white/50">
                      Adicione uma screenshot do<br />Portal da Agência aqui
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/80" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-[Sora] text-base">Pipeline & CRM completo</div>
                    <p className="mt-1 text-sm text-white/70">
                      Gerencie leads, propostas e projetos em um pipeline visual. Acompanhe cada etapa do funil comercial.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/80" fill="none">
                      <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-[Sora] text-base">Automação de processos</div>
                    <p className="mt-1 text-sm text-white/70">
                      Automatize relatórios, aprovações e notificações. Seu time foca no que importa: resultados.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/80" fill="none">
                      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M7 16l4-4 3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-[Sora] text-base">Lucratividade em tempo real</div>
                    <p className="mt-1 text-sm text-white/70">
                      Veja lucro, margem e rentabilidade de cada cliente e projeto. Tome decisões baseadas em dados reais.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/80" fill="none">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-[Sora] text-base">Gestão de equipes</div>
                    <p className="mt-1 text-sm text-white/70">
                      Distribua tarefas, acompanhe produtividade e mantenha a comunicação centralizada por projeto.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* PORTAL DO CLIENTE SECTION */}
      <section className="relative py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal>
            <h2 className="font-[Sora] text-2xl tracking-[-0.4px] md:text-3xl">
              Portal do Cliente: Transparência que vende
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
              Dê ao seu cliente uma experiência premium com acesso direto aos resultados, 
              aprovações rápidas e total transparência do projeto.
            </p>
          </ScrollReveal>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            <GlassCard className="p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-violet-400" fill="none">
                      <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-[Sora] text-base">Aprovações em 1 clique</div>
                    <p className="mt-1 text-sm text-white/70">
                      Cliente aprova criativos, campanhas e relatórios direto na plataforma. Sem WhatsApp, sem email perdido.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-violet-400" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-[Sora] text-base">Dashboard em tempo real</div>
                    <p className="mt-1 text-sm text-white/70">
                      Métricas atualizadas automaticamente. Seu cliente vê resultados, investimento e ROI sem precisar perguntar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-violet-400" fill="none">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-[Sora] text-base">Relatórios automáticos</div>
                    <p className="mt-1 text-sm text-white/70">
                      Relatórios gerados e enviados automaticamente. Menos tempo em reuniões de apresentação, mais tempo executando.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-violet-400" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-[Sora] text-base">Histórico completo</div>
                    <p className="mt-1 text-sm text-white/70">
                      Todo o histórico de ações, campanhas e resultados em um só lugar. Transparência total para o cliente.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center justify-center overflow-hidden p-6 md:p-8">
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-transparent">
                  <div className="text-center">
                    <svg viewBox="0 0 24 24" className="mx-auto h-16 w-16 text-white/40" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="15" cy="15" r="2" fill="currentColor"/>
                    </svg>
                    <p className="mt-4 text-sm text-white/50">
                      Adicione uma screenshot do<br />Portal do Cliente aqui
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="relative py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal>
            <h2 className="font-[Sora] text-2xl tracking-[-0.4px] md:text-3xl">
              Do improviso ao previsível
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
              Três pilares para tirar sua agência do improviso e colocar sua operação
              em modo previsível e escalável.
            </p>
          </ScrollReveal>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Organize",
                d: "Chega de 15 abas abertas. Briefings, arquivos e conversas centralizados.",
              },
              {
                t: "Automatize",
                d: "Gatilhos inteligentes que movem o projeto sozinho — do onboarding ao fechamento do mês.",
              },
              {
                t: "Escale",
                d: "Visão clara de KPIs para você focar no crescimento, não no microgerenciamento.",
              },
            ].map((x, i) => (
              <ScrollReveal key={x.t} delay={i * 100}>
                <GlassCard className="p-6">
                  <div className="font-[Sora] text-base">{x.t}</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {x.d}
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section id="features" className="relative py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <ScrollReveal>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-white/85">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                All-in-One
              </div>
              <h2 className="mt-4 font-[Sora] text-2xl tracking-[-0.4px] md:text-3xl">
                Tudo o que sua agência precisa em um só lugar
              </h2>
              <p className="mt-3 mx-auto max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
                Esque��a a bagunça de ferramentas desconectadas. O Spherum centraliza gestão, 
                automação, relatórios e comunicação em uma plataforma completa e integrada.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80}>
                <GlassCard className="p-6 transition-all hover:border-violet-400/30 hover:bg-white/[0.08]">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-transparent text-violet-400">
                    {f.icon}
                  </div>
                  <div className="font-[Sora] text-base">{f.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {f.desc}
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={500}>
            <div className="mt-10 text-center">
              <GlassCard className="inline-flex items-center gap-3 p-4 md:p-5">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-violet-400" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="text-left">
                  <div className="font-[Sora] text-base">Integrado nativamente</div>
                  <p className="text-sm text-white/70">
                    Dados fluem entre módulos sem necessidade de sincronizações manuais ou exportações
                  </p>
                </div>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PRICING */}
      <PricingSection />

      {/* FAQ */}
      <section className="relative py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-5">
          <ScrollReveal>
            <h2 className="text-center font-[Sora] text-2xl tracking-[-0.4px] md:text-3xl">
              Perguntas Frequentes
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-white/70 md:text-base">
              Tudo o que você precisa saber sobre o Spherum
            </p>
          </ScrollReveal>

          <div className="mt-7 space-y-4">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <GlassCard className="p-5 md:p-6">
                  <div className="font-[Sora] text-base">{faq.q}</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {faq.a}
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-white/60">
            Não encontrou o que procurava? Entre em contato conosco.
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="trial" className="relative py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <GlassCard className="p-7 md:p-10">
            <div className="grid items-center gap-6 md:grid-cols-2">
              <div>
                <div className="font-[Sora] text-xl tracking-[-0.3px] md:text-2xl">
                  Pare de operar no caos. Comece a escalar com padrão.
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Centralize processos, automatize entregas e dê ao seu cliente um
                  portal premium. Teste o Spherum sem fricção.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Button variant="primary" href="/login">
                  Começar Teste Gratuito
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 text-sm text-white/55">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5">
          <div>© {new Date().getFullYear()} Spherum. Todos os direitos reservados.</div>
          <div className="flex flex-wrap gap-4">
            <a className="hover:text-white" href="#seguranca">
              Segurança
            </a>
            <a className="hover:text-white" href="#seguranca">
              Privacidade
            </a>
            <a className="hover:text-white" href="#seguranca">
              Suporte
            </a>
            <a className="hover:text-white" href="#seguranca">
              Status
            </a>
            <a className="hover:text-white" href="#seguranca">
              Termos
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
