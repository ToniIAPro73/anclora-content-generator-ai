import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, TrendingUp } from "lucide-react"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  dashboardNavLinks,
  getDashboardPageMeta,
} from "@/components/layout/dashboard-nav"

export function Topbar() {
  const pathname = usePathname()
  const page = getDashboardPageMeta(pathname)

  return (
    <header className="relative z-10 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary/80">
            Brand Authority Engine
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="truncate font-heading text-xl font-semibold tracking-tight lg:text-2xl">
              {page.label}
            </h1>
            <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:inline-flex">
              activo
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground lg:text-sm">
            {page.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs text-muted-foreground xl:flex">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Mallorca signals online
          </div>
          <ThemeToggle />
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-xs font-semibold text-primary">
            A
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden lg:px-6">
        {dashboardNavLinks.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                active
                  ? "border-primary/20 bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.shortLabel}
            </Link>
          )
        })}
      </div>

      <div className="hidden items-center justify-between border-t border-border/60 px-6 py-2 text-xs text-muted-foreground lg:flex">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Prioridad del dia: detectar oportunidades de contenido con contexto RAG verificable.
        </div>
        <div>Supabase Auth + Neon Core</div>
      </div>
    </header>
  )
}
