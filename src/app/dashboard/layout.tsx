import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth, isBetterAuthEnabled } from "@/lib/auth/better-auth-server"
import { Shell } from "@/components/layout/Shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (isBetterAuthEnabled) {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      redirect("/login")
    }
  }

  return <Shell>{children}</Shell>
}
