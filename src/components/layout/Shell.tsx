"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

// Este Shell asegura el cumplimiento de: sin scroll vertical global en dashboard
// El height es estrictamente 100vh h-screen con overflow-hidden
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr] overflow-hidden h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto w-full relative">
           {children}
        </main>
      </div>
    </div>
  )
}
