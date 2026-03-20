import { and, asc, desc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { db } from '@/lib/db/neon'
import { generatedContent, scheduledPosts } from '@/lib/db/schema'

export const runtime = 'nodejs'

type EditorialAction = 'review' | 'approve' | 'publish' | 'schedule' | 'unschedule' | 'archive'

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

    const [items, scheduledQueue] = await Promise.all([
      db.query.generatedContent.findMany({
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
      }),
      db
        .select({
          id: scheduledPosts.id,
          contentId: scheduledPosts.contentId,
          platform: scheduledPosts.platform,
          scheduledFor: scheduledPosts.scheduledFor,
          status: scheduledPosts.status,
          title: generatedContent.title,
          contentType: generatedContent.contentType,
        })
        .from(scheduledPosts)
        .innerJoin(generatedContent, eq(scheduledPosts.contentId, generatedContent.id))
        .where(
          and(
            eq(scheduledPosts.workspaceId, workspaceId),
            eq(scheduledPosts.status, 'pending')
          )
        )
        .orderBy(asc(scheduledPosts.scheduledFor))
        .limit(12),
    ])

    return NextResponse.json({ success: true, items, scheduledQueue })
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
        scheduledFor: true,
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

      const pendingSchedule = await db.query.scheduledPosts.findFirst({
        where: and(
          eq(scheduledPosts.workspaceId, workspaceId),
          eq(scheduledPosts.contentId, existing.id),
          eq(scheduledPosts.status, 'pending')
        ),
        columns: {
          id: true,
        },
      })

      if (pendingSchedule) {
        await db
          .update(scheduledPosts)
          .set({
            platform: mapContentTypeToPlatform(existing.contentType),
            scheduledFor: scheduledAt,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(scheduledPosts.id, pendingSchedule.id),
              eq(scheduledPosts.workspaceId, workspaceId)
            )
          )
      } else {
        await db.insert(scheduledPosts).values({
          workspaceId,
          contentId: existing.id,
          platform: mapContentTypeToPlatform(existing.contentType),
          scheduledFor: scheduledAt,
          status: 'pending',
        })
      }

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

    if (body.action === 'unschedule') {
      await db
        .update(scheduledPosts)
        .set({
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(scheduledPosts.workspaceId, workspaceId),
            eq(scheduledPosts.contentId, existing.id),
            eq(scheduledPosts.status, 'pending')
          )
        )

      const [unscheduled] = await db
        .update(generatedContent)
        .set({
          status: 'approved',
          scheduledFor: null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(generatedContent.id, existing.id),
            eq(generatedContent.workspaceId, workspaceId)
          )
        )
        .returning()

      return NextResponse.json({ success: true, item: unscheduled })
    }

    const nextStatus =
      body.action === 'review'
        ? 'review'
        : body.action === 'approve'
        ? 'approved'
        : body.action === 'publish'
        ? 'published'
        : 'archived'

    if (body.action === 'publish' || body.action === 'archive') {
      await db
        .update(scheduledPosts)
        .set({
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(scheduledPosts.workspaceId, workspaceId),
            eq(scheduledPosts.contentId, existing.id),
            eq(scheduledPosts.status, 'pending')
          )
        )
    }

    const [updated] = await db
      .update(generatedContent)
      .set({
        status: nextStatus,
        publishedAt: body.action === 'publish' ? new Date() : null,
        scheduledFor: body.action === 'publish' || body.action === 'archive' ? null : undefined,
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
