import * as React from "react"
import Link from "next/link"
import { LayoutDashboard, PenTool, BookOpen, BarChart3, Settings, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/studio", label: "Content Studio", icon: PenTool },
    { href: "/dashboard/rag", label: "Knowledge Base", icon: BookOpen },
    { href: "/dashboard/metrics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 border-r bg-muted/40 hidden md:block h-full flex-shrink-0">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold font-heading">
            <span className="text-primary group-hover:text-primary transition-colors">
               Anclora Content AI
            </span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
            {links.map((link) => {
               const Icon = link.icon
               return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
               )
            })}
          </nav>
        </div>
        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
