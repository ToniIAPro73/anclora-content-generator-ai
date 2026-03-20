import { and, asc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { db } from '@/lib/db/neon'
import { contentTemplates } from '@/lib/db/schema'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()

    const templates = await db.query.contentTemplates.findMany({
      where: eq(contentTemplates.workspaceId, workspaceId),
      orderBy: [asc(contentTemplates.name)],
    })

    return NextResponse.json({ success: true, templates })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Content Templates API] GET error:', error)
    return NextResponse.json({ error: 'No se pudieron cargar las plantillas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const body = (await request.json()) as {
      name?: string
      contentType?: 'blog' | 'linkedin' | 'instagram' | 'facebook' | 'newsletter' | 'custom'
      systemPrompt?: string
      description?: string
    }

    if (!body.name?.trim() || !body.contentType || !body.systemPrompt?.trim()) {
      return NextResponse.json({ error: 'name, contentType y systemPrompt son requeridos' }, { status: 400 })
    }

    const [created] = await db
      .insert(contentTemplates)
      .values({
        workspaceId,
        name: body.name.trim(),
        contentType: body.contentType,
        systemPrompt: body.systemPrompt.trim(),
        description: body.description?.trim() || null,
        config: {},
        isDefault: false,
      })
      .returning()

    return NextResponse.json({ success: true, template: created })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Content Templates API] POST error:', error)
    return NextResponse.json({ error: 'No se pudo guardar la plantilla' }, { status: 500 })
  }
}
