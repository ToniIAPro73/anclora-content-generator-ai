"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

// Este Shell asegura el cumplimiento de: sin scroll vertical global en dashboard
// El height es estrictamente 100vh h-screen con overflow-hidden
export function Shell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isAuthBootstrapLoading, setIsAuthBootstrapLoading] = React.useState(
    process.env.NEXT_PUBLIC_BETTER_AUTH_ENABLED === "true"
  )
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
      setIsAuthBootstrapLoading(false)
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
      } finally {
        if (isActive) {
          setIsAuthBootstrapLoading(false)
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
          {isAuthBootstrapLoading ? (
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card/95 p-6 text-center shadow-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary/80">
                  Workspace Bootstrap
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight">
                  Preparando tu entorno
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Estamos conectando tu sesion con la organizacion activa y el workspace de negocio.
                </p>
              </div>
            </div>
          ) : authBootstrapError ? (
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-xl rounded-3xl border border-destructive/20 bg-card/95 p-6 shadow-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-destructive/80">
                  Auth Bootstrap Error
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight">
                  No se pudo inicializar el workspace
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {authBootstrapError}
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
