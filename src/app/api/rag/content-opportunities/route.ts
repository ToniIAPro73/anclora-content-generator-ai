import { NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { listContentOpportunities } from '@/lib/rag/content-opportunity-agent'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const opportunities = await listContentOpportunities(workspaceId)

    return NextResponse.json({
      success: true,
      opportunities,
    })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Content Opportunities GET]', error)
    return NextResponse.json({ error: 'Error al obtener oportunidades editoriales' }, { status: 500 })
  }
}
