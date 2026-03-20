import { and, desc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { db } from '@/lib/db/neon'
import { generatedContent, scheduledPosts } from '@/lib/db/schema'

export const runtime = 'nodejs'

type EditorialAction = 'review' | 'approve' | 'publish' | 'schedule' | 'archive'

type UpdateRequest = {
  id?: string
  action?: EditorialAction
  scheduledFor?: string
}

function mapContentTypeToPlatform(contentType: string) {
  switch (contentType) {
    case 'linkedin':
    case 'instagram':
    case 'facebook':
    case 'blog':
    case 'newsletter':
      return contentType
    case 'custom':
    default:
      return 'blog'
  }
}

export async function GET() {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()

    const items = await db.query.generatedContent.findMany({
      where: eq(generatedContent.workspaceId, workspaceId),
      orderBy: [desc(generatedContent.updatedAt)],
      limit: 12,
      columns: {
        id: true,
        title: true,
        contentType: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        scheduledFor: true,
        publishedAt: true,
        opportunityId: true,
      },
    })

    return NextResponse.json({ success: true, items })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Content Library GET]', error)
    return NextResponse.json({ error: 'Error al obtener la libreria editorial' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const body = (await request.json()) as UpdateRequest

    if (!body.id || !body.action) {
      return NextResponse.json({ error: 'id y action son requeridos' }, { status: 400 })
    }

    const existing = await db.query.generatedContent.findFirst({
      where: and(
        eq(generatedContent.id, body.id),
        eq(generatedContent.workspaceId, workspaceId)
      ),
      columns: {
        id: true,
        title: true,
        contentType: true,
        status: true,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Pieza no encontrada' }, { status: 404 })
    }

    if (body.action === 'schedule') {
      if (!body.scheduledFor) {
        return NextResponse.json({ error: 'scheduledFor es requerido para programar' }, { status: 400 })
      }

      const scheduledAt = new Date(body.scheduledFor)
      if (Number.isNaN(scheduledAt.getTime())) {
        return NextResponse.json({ error: 'scheduledFor no es una fecha valida' }, { status: 400 })
      }

      await db.insert(scheduledPosts).values({
        workspaceId,
        contentId: existing.id,
        platform: mapContentTypeToPlatform(existing.contentType),
        scheduledFor: scheduledAt,
        status: 'pending',
      })

      const [scheduled] = await db
        .update(generatedContent)
        .set({
          status: 'scheduled',
          scheduledFor: scheduledAt,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(generatedContent.id, existing.id),
            eq(generatedContent.workspaceId, workspaceId)
          )
        )
        .returning()

      return NextResponse.json({ success: true, item: scheduled })
    }

    const nextStatus =
      body.action === 'review'
        ? 'review'
        : body.action === 'approve'
        ? 'approved'
        : body.action === 'publish'
        ? 'published'
        : 'archived'

    const [updated] = await db
      .update(generatedContent)
      .set({
        status: nextStatus,
        publishedAt: body.action === 'publish' ? new Date() : null,
        scheduledFor: body.action === 'publish' ? null : undefined,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(generatedContent.id, existing.id),
          eq(generatedContent.workspaceId, workspaceId)
        )
      )
      .returning()

    return NextResponse.json({ success: true, item: updated })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Content Library PATCH]', error)
    return NextResponse.json({ error: 'Error al actualizar el estado editorial' }, { status: 500 })
  }
}
