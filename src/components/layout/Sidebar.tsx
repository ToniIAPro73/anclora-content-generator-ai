"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { dashboardNavLinks } from "@/components/layout/dashboard-nav"

function AnchorMark({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="22" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
  )
}

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [logoutHover, setLogoutHover] = React.useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="hidden h-full flex-shrink-0 flex-col border-r border-border/70 bg-card/70 backdrop-blur md:flex"
    >
      <div className="flex h-16 items-center border-b border-border/70 px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-[0.98]">
            <AnchorMark
              style={{
                width: "14px",
                height: "14px",
                color: "currentColor",
                strokeWidth: 2.5,
              }}
            />
          </div>
          <div className="space-y-0.5">
            <span className="block font-heading text-sm font-semibold tracking-tight">
              Anclora
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Mission Control
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="mb-4 rounded-2xl border border-border/70 bg-background/70 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary/80">
            Control Loop
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Detecta seales, redacta activos de contenido y revisa su impacto por canal.
          </p>
        </div>

        <p className="mb-2 px-3 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70">
          Navegacion
        </p>
        <div className="space-y-1">
          {dashboardNavLinks.map(({ href, label, description, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-start gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-150 ${
                  active
                    ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-primary" />
                )}
                <div
                  className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className={`font-medium ${active ? "text-foreground" : ""}`}>{label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-border/70 px-3 pb-4 pt-3">
        <button
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150"
          style={{
            color: logoutHover ? "hsl(var(--destructive))" : undefined,
            backgroundColor: logoutHover ? "hsl(var(--destructive) / 0.08)" : undefined,
          }}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
