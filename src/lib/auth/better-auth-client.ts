"use client"

import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const betterAuthClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  basePath: "/api/auth",
  plugins: [organizationClient()],
})

export type BetterAuthSession = typeof betterAuthClient.$Infer.Session
