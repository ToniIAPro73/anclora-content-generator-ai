import * as React from "react"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between">
      <div className="flex-1">
         {/* Mobile menu toggle would go here */}
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder for Language Switcher */}
        <Button variant="ghost" size="sm" className="font-medium text-xs">
          ES
        </Button>
        <ThemeToggle />
        {/* Placeholder for User Profile Dropdown */}
        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-xs font-semibold text-primary">
          A
        </div>
      </div>
    </header>
  )
}
