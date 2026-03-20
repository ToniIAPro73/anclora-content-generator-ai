import { createClient } from '@/utils/supabase/server'

type UserLike = {
  id: string
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
}

export class WorkspaceAuthError extends Error {
  status: number

  constructor(message: string, status = 401) {
    super(message)
    this.name = 'WorkspaceAuthError'
    this.status = status
  }
}

function readWorkspaceId(user: UserLike): string {
  const appMetadataWorkspaceId = user.app_metadata?.workspace_id
  if (typeof appMetadataWorkspaceId === 'string' && appMetadataWorkspaceId.length > 0) {
    return appMetadataWorkspaceId
  }

  const userMetadataWorkspaceId = user.user_metadata?.workspace_id
  if (typeof userMetadataWorkspaceId === 'string' && userMetadataWorkspaceId.length > 0) {
    return userMetadataWorkspaceId
  }

  // Fallback temporal: cada usuario opera sobre su propio workspace.
  return user.id
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function getAuthenticatedWorkspace() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new WorkspaceAuthError('No se pudo validar la sesion', 401)
  }

  if (!user) {
    throw new WorkspaceAuthError('Sesion requerida', 401)
  }

  return {
    userId: user.id,
    workspaceId: readWorkspaceId(user),
  }
}
