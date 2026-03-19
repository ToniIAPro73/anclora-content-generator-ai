import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  PenTool,
  Settings,
} from "lucide-react"

export const dashboardNavLinks = [
  {
    href: "/dashboard",
    label: "Overview",
    shortLabel: "Overview",
    description: "Pulso operativo y señales clave",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/studio",
    label: "Content Studio",
    shortLabel: "Studio",
    description: "Briefing, generación y revisión",
    icon: PenTool,
    exact: false,
  },
  {
    href: "/dashboard/rag",
    label: "Knowledge Base",
    shortLabel: "RAG",
    description: "Fuentes, chunks y contexto",
    icon: BookOpen,
    exact: false,
  },
  {
    href: "/dashboard/metrics",
    label: "Analytics",
    shortLabel: "Metrics",
    description: "Rendimiento y cadencia",
    icon: BarChart3,
    exact: false,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    shortLabel: "Settings",
    description: "Modelos, plantillas y workspace",
    icon: Settings,
    exact: false,
  },
] as const

export function getDashboardPageMeta(pathname: string) {
  const match =
    dashboardNavLinks.find((item) =>
      item.exact ? item.href === pathname : pathname.startsWith(item.href)
    ) ?? dashboardNavLinks[0]

  return match
}
