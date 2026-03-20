import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { db } from '@/lib/db/neon'
import { contentOpportunities } from '@/lib/db/schema'
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

export async function PATCH(request: Request) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const body = (await request.json()) as { id?: string; status?: 'new' | 'accepted' | 'dismissed' }

    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'id y status son requeridos' }, { status: 400 })
    }

    const [updated] = await db
      .update(contentOpportunities)
      .set({
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(contentOpportunities.id, body.id))
      .returning({
        id: contentOpportunities.id,
        workspaceId: contentOpportunities.workspaceId,
        status: contentOpportunities.status,
      })

    if (!updated || updated.workspaceId !== workspaceId) {
      return NextResponse.json({ error: 'Oportunidad no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true, opportunity: updated })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Content Opportunities PATCH]', error)
    return NextResponse.json({ error: 'Error al actualizar la oportunidad' }, { status: 500 })
  }
}
