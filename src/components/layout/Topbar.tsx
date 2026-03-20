import { betterAuthClient } from "@/lib/auth/better-auth-client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, LogOut, Sparkles, TrendingUp, User } from "lucide-react"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  dashboardNavLinks,
  getDashboardPageMeta,
} from "@/components/layout/dashboard-nav"

export function Topbar() {
  const pathname = usePathname()
  const page = getDashboardPageMeta(pathname)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    window.addEventListener("mousedown", handlePointerDown)
    return () => window.removeEventListener("mousedown", handlePointerDown)
  }, [])

  async function handleLogout() {
    await betterAuthClient.signOut()
    setMenuOpen(false)
    window.location.href = "/login"
  }

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
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-2 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/15"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
                A
              </div>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-44 overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-1.5 shadow-2xl backdrop-blur">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted/70"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Perfil</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar</span>
                </button>
              </div>
            )}
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
        <div>Better Auth + Neon Core</div>
      </div>
    </header>
  )
}
