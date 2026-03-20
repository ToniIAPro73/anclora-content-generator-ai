"use client"

import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

function resolveBetterAuthBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
}

export const betterAuthClient = createAuthClient({
  baseURL: resolveBetterAuthBaseURL(),
  basePath: "/api/auth",
  plugins: [organizationClient()],
})

export type BetterAuthSession = typeof betterAuthClient.$Infer.Session
