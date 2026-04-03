"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { dashboardNavLinks } from "@/components/layout/dashboard-nav"
import { CONTENT_GENERATOR_LOGO_SRC } from "@/lib/brand"

export function Sidebar({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={`hidden h-full flex-shrink-0 flex-col border-r border-border/70 bg-card/70 backdrop-blur transition-[width] duration-200 md:flex ${
        isCollapsed ? "w-[88px]" : "w-[320px]"
      }`}
    >
      <div
        className={`border-b border-border/70 px-4 py-4 ${
          isCollapsed ? "flex min-h-20 flex-col items-center justify-center gap-3" : "min-h-48"
        }`}
      >
        <div className={`flex ${isCollapsed ? "w-full justify-center" : "justify-end"}`}>
          <button
            type="button"
            onClick={onToggle}
            aria-label={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/70 text-muted-foreground transition-all duration-200 hover:border-primary/25 hover:bg-primary/5 hover:text-foreground"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <Link
          href="/dashboard"
          className={`group flex ${isCollapsed ? "flex-col items-center gap-3" : "flex-col items-center gap-4"} text-center`}
        >
          <div className="relative h-16 w-16 overflow-hidden transition-transform group-hover:scale-[0.98]">
            <Image
              src={CONTENT_GENERATOR_LOGO_SRC}
              alt="Anclora Content Generator AI logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {!isCollapsed && (
            <div className="space-y-1.5">
              <span className="block font-heading text-lg font-semibold tracking-tight leading-tight">
                Anclora Content Generator AI
              </span>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                By Anclora Group
              </span>
            </div>
          )}
        </Link>
      </div>

      <nav className={`flex-1 py-4 ${isCollapsed ? "px-2" : "px-3"}`}>
        {!isCollapsed && (
          <div className="mb-4 rounded-2xl border border-border/70 bg-background/70 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Control Loop
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Detecta seales, redacta activos de contenido y revisa su impacto por canal.
            </p>
          </div>
        )}

        {!isCollapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70">
            Navegacion
          </p>
        )}
        <div className="space-y-1">
          {dashboardNavLinks.map(({ href, label, description, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                title={isCollapsed ? label : undefined}
                className={`group relative flex rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                } ${isCollapsed ? "items-center justify-center px-0 py-3" : "items-start gap-3 px-3 py-3"}`}
              >
                {active && (
                  <div
                    className={`absolute bg-primary ${
                      isCollapsed
                        ? "left-3 right-3 top-0 h-[3px] rounded-b-full"
                        : "left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                    }`}
                  />
                )}
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:text-foreground"
                  } ${isCollapsed ? "" : "mt-0.5"}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className={`font-medium ${active ? "text-foreground" : ""}`}>{label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
