"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

// Este Shell asegura el cumplimiento de: sin scroll vertical global en dashboard
// El height es estrictamente 100vh h-screen con overflow-hidden
export function Shell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [authBootstrapError, setAuthBootstrapError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const storedValue = window.localStorage.getItem("anclora-sidebar-collapsed")
    if (storedValue === "true") {
      setIsCollapsed(true)
    }
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem("anclora-sidebar-collapsed", String(isCollapsed))
  }, [isCollapsed])

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_BETTER_AUTH_ENABLED !== "true") {
      return
    }

    let isActive = true

    async function bootstrapWorkspace() {
      try {
        const response = await fetch("/api/auth/bootstrap-workspace", {
          method: "POST",
        })

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as
            | { message?: string }
            | null

          throw new Error(
            payload?.message ?? "No se pudo inicializar el workspace autenticado."
          )
        }

        if (isActive) {
          setAuthBootstrapError(null)
        }
      } catch (error) {
        if (isActive) {
          setAuthBootstrapError(
            error instanceof Error
              ? error.message
              : "No se pudo inicializar el workspace autenticado."
          )
        }
      }
    }

    bootstrapWorkspace()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="flex h-screen min-h-screen w-full overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((value) => !value)} />
      <div className="relative flex h-screen min-h-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,hsla(var(--primary),0.12),transparent_60%)]" />
        <Topbar />
        <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 pt-4 lg:px-6 lg:pb-8 lg:pt-5">
          {authBootstrapError ? (
            <div className="mb-4 rounded-2xl border border-destructive/20 bg-card/95 px-4 py-3 shadow-lg">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-destructive/80">
                Auth Bootstrap Error
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {authBootstrapError}
              </p>
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  )
}
