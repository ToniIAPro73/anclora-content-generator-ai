"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, PenTool, BookOpen, BarChart3, Settings, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

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

const navLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/studio", label: "Content Studio", icon: PenTool, exact: false },
  { href: "/dashboard/rag", label: "Knowledge Base", icon: BookOpen, exact: false },
  { href: "/dashboard/metrics", label: "Analytics", icon: BarChart3, exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
]

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
      className="w-64 hidden md:flex flex-col h-full flex-shrink-0"
      style={{
        backgroundColor: "hsl(20 14% 7%)",
        borderRight: "1px solid hsl(20 10% 11%)",
      }}
    >
      {/* ─── Brand ─── */}
      <div
        className="flex h-14 lg:h-[60px] items-center px-5"
        style={{ borderBottom: "1px solid hsl(20 10% 11%)" }}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md transition-opacity group-hover:opacity-80"
            style={{ backgroundColor: "hsl(38 92% 55%)" }}
          >
            <AnchorMark
              style={{
                width: "14px",
                height: "14px",
                color: "hsl(20 18% 5%)",
                strokeWidth: 2.5,
              }}
            />
          </div>
          <span
            className="font-heading text-sm font-semibold tracking-tight"
            style={{ color: "hsl(36 15% 88%)" }}
          >
            Anclora
          </span>
        </Link>
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p
          className="mb-2 px-3 text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: "hsl(20 8% 36%)" }}
        >
          Menu
        </p>
        <div className="space-y-0.5">
          {navLinks.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm relative transition-all duration-150"
                style={
                  active
                    ? {
                        backgroundColor: "hsl(38 92% 55% / 0.1)",
                        color: "hsl(38 92% 60%)",
                        fontWeight: 500,
                      }
                    : { color: "hsl(20 8% 54%)" }
                }
              >
                {/* Active indicator bar */}
                {active && (
                  <div
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                    style={{ backgroundColor: "hsl(38 92% 55%)" }}
                  />
                )}
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ─── Logout ─── */}
      <div
        className="px-3 pb-4"
        style={{ borderTop: "1px solid hsl(20 10% 11%)" }}
      >
        <button
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150"
          style={{
            color: logoutHover ? "hsl(0 62% 60%)" : "hsl(20 8% 48%)",
            backgroundColor: logoutHover ? "hsl(0 62% 44% / 0.08)" : "transparent",
          }}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
