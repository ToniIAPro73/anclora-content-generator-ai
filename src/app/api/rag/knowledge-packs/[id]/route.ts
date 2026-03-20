import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { getKnowledgePackDetail } from '@/lib/rag/agentic-knowledge'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const { id } = await context.params

    const pack = await getKnowledgePackDetail(workspaceId, id)
    if (!pack) {
      return NextResponse.json({ error: 'Knowledge pack no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      pack,
    })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Knowledge Pack GET]', error)
    return NextResponse.json({ error: 'Error al obtener el knowledge pack' }, { status: 500 })
  }
}
