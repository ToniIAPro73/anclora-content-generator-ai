import { randomUUID } from "node:crypto"

import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { auth, isBetterAuthEnabled } from "@/lib/auth/better-auth-server"
import { db } from "@/lib/db/neon"
import { workspaceOrganizations } from "@/lib/db/auth-schema"

function slugifyWorkspaceName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}

async function ensureWorkspaceLink(organizationId: string) {
  const existing = await db
    .select({
      workspaceId: workspaceOrganizations.workspaceId,
    })
    .from(workspaceOrganizations)
    .where(eq(workspaceOrganizations.organizationId, organizationId))
    .limit(1)

  if (existing[0]?.workspaceId) {
    return existing[0].workspaceId
  }

  const workspaceId = randomUUID()

  await db.insert(workspaceOrganizations).values({
    workspaceId,
    organizationId,
  })

  return workspaceId
}

export async function POST(request: Request) {
  if (!isBetterAuthEnabled) {
    return NextResponse.json(
      {
        ok: false,
        message: "Better Auth no esta habilitado en este entorno.",
      },
      { status: 503 }
    )
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Sesion requerida.",
      },
      { status: 401 }
    )
  }

  let organizationId = session.session?.activeOrganizationId ?? null

  if (!organizationId) {
    const organizations = await auth.api.listOrganizations({
      headers: request.headers,
    })

    if (organizations.length > 0) {
      organizationId = organizations[0].id

      await auth.api.setActiveOrganization({
        headers: request.headers,
        body: {
          organizationId,
        },
      })
    } else {
      const baseName = session.user.name?.trim() || session.user.email.split("@")[0] || "Anclora Workspace"
      const createdOrganization = await auth.api.createOrganization({
        headers: request.headers,
        body: {
          name: `${baseName} Workspace`,
          slug: `${slugifyWorkspaceName(baseName)}-${session.user.id.slice(0, 8)}`,
        },
      })

      organizationId = createdOrganization.id
    }
  }

  if (!organizationId) {
    return NextResponse.json(
      {
        ok: false,
        message: "No se pudo determinar la organizacion activa.",
      },
      { status: 500 }
    )
  }

  const workspaceId = await ensureWorkspaceLink(organizationId)

  return NextResponse.json({
    ok: true,
    workspaceId,
    organizationId,
  })
}
