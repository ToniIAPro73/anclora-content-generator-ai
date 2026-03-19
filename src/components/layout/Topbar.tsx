import * as React from "react"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export function Topbar() {
  return (
    <header className="flex h-14 lg:h-[60px] flex-shrink-0 items-center justify-between border-b border-border px-4 lg:px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold"
          style={{
            backgroundColor: "hsl(38 92% 55% / 0.15)",
            border: "1px solid hsl(38 92% 55% / 0.35)",
            color: "hsl(38 92% 60%)",
          }}
        >
          A
        </div>
      </div>
    </header>
  )
}
