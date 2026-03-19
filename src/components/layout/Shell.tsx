"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

// Este Shell asegura el cumplimiento de: sin scroll vertical global en dashboard
// El height es estrictamente 100vh h-screen con overflow-hidden
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen min-h-screen w-full overflow-hidden bg-background md:grid-cols-[272px_1fr]">
      <Sidebar />
      <div className="relative flex h-screen min-h-0 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,hsla(var(--primary),0.12),transparent_60%)]" />
        <Topbar />
        <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 pt-4 lg:px-6 lg:pb-8 lg:pt-5">
          {children}
        </main>
      </div>
    </div>
  )
}
