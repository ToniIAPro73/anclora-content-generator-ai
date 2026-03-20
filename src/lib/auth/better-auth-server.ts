import { betterAuth as createBetterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { toNextJsHandler, nextCookies } from "better-auth/next-js"
import { organization } from "better-auth/plugins"

import { db } from "@/lib/db/neon"
import {
  authAccounts,
  authInvitations,
  authMembers,
  authOrganizations,
  authSessions,
  authUsers,
  authVerifications,
} from "@/lib/db/auth-schema"

const betterAuthSecret =
  process.env.BETTER_AUTH_SECRET ??
  "anclora-dev-secret-change-me-before-enabling-better-auth"

const betterAuthBaseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000"

export const isBetterAuthEnabled = process.env.BETTER_AUTH_ENABLED === "true"
  || process.env.NEXT_PUBLIC_BETTER_AUTH_ENABLED === "true"

/**
 * Skeleton coexistente de Better Auth.
 * En esta iteracion queda instalado y disponible, pero no sustituye todavia
 * el flujo productivo existente hasta completar tablas y migracion de sesion.
 */
export const auth = createBetterAuth({
  appName: "Anclora Content Generator AI",
  baseURL: betterAuthBaseURL,
  secret: betterAuthSecret,
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authUsers,
      session: authSessions,
      account: authAccounts,
      verification: authVerifications,
      organization: authOrganizations,
      member: authMembers,
      invitation: authInvitations,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  plugins: [
    nextCookies(),
    organization({
      allowUserToCreateOrganization: true,
    }),
  ],
})

const liveHandler = toNextJsHandler(auth)

function disabledResponse() {
  return Response.json(
    {
      ok: false,
      message:
        "Better Auth esta instalado pero aun no esta habilitado para produccion en este repo.",
    },
    { status: 503 }
  )
}

export const betterAuthRouteHandlers = {
  GET: async (request: Request) =>
    isBetterAuthEnabled ? liveHandler.GET(request) : disabledResponse(),
  POST: async (request: Request) =>
    isBetterAuthEnabled ? liveHandler.POST(request) : disabledResponse(),
}
