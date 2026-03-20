import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'

import { auth, isBetterAuthEnabled } from '@/lib/auth/better-auth-server'
import { db } from '@/lib/db/neon'
import { workspaceOrganizations } from '@/lib/db/auth-schema'

export class WorkspaceAuthError extends Error {
  status: number

  constructor(message: string, status = 401) {
    super(message)
    this.name = 'WorkspaceAuthError'
    this.status = status
  }
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function getAuthenticatedWorkspace() {
  if (!isBetterAuthEnabled) {
    throw new WorkspaceAuthError(
      'Better Auth debe estar habilitado para resolver el workspace autenticado',
      500
    )
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new WorkspaceAuthError('Sesion requerida', 401)
  }

  const activeOrganizationId = session.session?.activeOrganizationId
  if (!activeOrganizationId) {
    throw new WorkspaceAuthError(
      'La sesion no tiene una organizacion activa asociada',
      403
    )
  }

  const workspaceLink = await db
    .select({
      workspaceId: workspaceOrganizations.workspaceId,
    })
    .from(workspaceOrganizations)
    .where(eq(workspaceOrganizations.organizationId, activeOrganizationId))
    .limit(1)

  const resolvedWorkspaceId = workspaceLink[0]?.workspaceId
  if (!resolvedWorkspaceId) {
    throw new WorkspaceAuthError(
      'No existe mapeo entre la organizacion activa y un workspace de negocio',
      403
    )
  }

  return {
    userId: session.user.id,
    workspaceId: resolvedWorkspaceId,
  }
}
