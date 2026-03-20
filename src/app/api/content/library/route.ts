import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { db } from '@/lib/db/neon'
import { contentMetrics, generatedContent, leadTracking, scheduledPosts } from '@/lib/db/schema'

export const runtime = 'nodejs'

type EditorialAction =
  | 'review'
  | 'approve'
  | 'publish'
  | 'schedule'
  | 'unschedule'
  | 'archive'
  | 'dispatch'
  | 'retry_delivery'

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

function clampLimit(rawLimit: string | null) {
  const parsed = Number.parseInt(rawLimit ?? '12', 10)
  if (Number.isNaN(parsed)) return 12
  return Math.min(Math.max(parsed, 1), 50)
}

function buildPlatformPostId(platform: string) {
  return `manual-${platform}-${Date.now()}`
}

export async function GET(request: NextRequest) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const limit = clampLimit(request.nextUrl.searchParams.get('limit'))
    const statusFilter = request.nextUrl.searchParams.get('status')
    const contentTypeFilter = request.nextUrl.searchParams.get('contentType')

    const contentConditions = [eq(generatedContent.workspaceId, workspaceId)]
    if (statusFilter) {
      contentConditions.push(eq(generatedContent.status, statusFilter as typeof generatedContent.status.enumValues[number]))
    }
    if (contentTypeFilter) {
      contentConditions.push(eq(generatedContent.contentType, contentTypeFilter as typeof generatedContent.contentType.enumValues[number]))
    }

    const [items, scheduledQueue, deliveryQueue] = await Promise.all([
      db.query.generatedContent.findMany({
        where: contentConditions.length === 1 ? contentConditions[0] : and(...contentConditions),
        orderBy: [desc(generatedContent.updatedAt)],
        limit,
        columns: {
          id: true,
          title: true,
          content: true,
          contentType: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          scheduledFor: true,
          publishedAt: true,
          opportunityId: true,
          microZoneId: true,
        },
        with: {
          microZone: {
            columns: {
              id: true,
              name: true,
              municipality: true,
            },
          },
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
        .limit(limit),
      db
        .select({
          id: scheduledPosts.id,
          contentId: scheduledPosts.contentId,
          platform: scheduledPosts.platform,
          scheduledFor: scheduledPosts.scheduledFor,
          status: scheduledPosts.status,
          retryCount: scheduledPosts.retryCount,
          lastError: scheduledPosts.lastError,
          publishedAt: scheduledPosts.publishedAt,
          platformPostId: scheduledPosts.platformPostId,
          title: generatedContent.title,
          contentType: generatedContent.contentType,
        })
        .from(scheduledPosts)
        .innerJoin(generatedContent, eq(scheduledPosts.contentId, generatedContent.id))
        .where(
          and(
            eq(scheduledPosts.workspaceId, workspaceId),
            inArray(scheduledPosts.status, ['pending', 'processing', 'failed', 'published'])
          )
        )
        .orderBy(desc(scheduledPosts.scheduledFor))
        .limit(limit),
    ])

    const contentIds = items.map((item) => item.id)

    const [performanceRows, leadRows] = contentIds.length
      ? await Promise.all([
          db
            .select({
              contentId: contentMetrics.contentId,
              views: sql<number>`COALESCE(SUM(${contentMetrics.views}), 0)`,
              impressions: sql<number>`COALESCE(SUM(${contentMetrics.impressions}), 0)`,
              clicks: sql<number>`COALESCE(SUM(${contentMetrics.clicks}), 0)`,
              leadsGenerated: sql<number>`COALESCE(SUM(${contentMetrics.leadsGenerated}), 0)`,
              conversions: sql<number>`COALESCE(SUM(${contentMetrics.conversions}), 0)`,
              engagementRate: sql<number>`COALESCE(AVG(${contentMetrics.engagementRate}), 0)`,
            })
            .from(contentMetrics)
            .where(
              and(
                eq(contentMetrics.workspaceId, workspaceId),
                inArray(contentMetrics.contentId, contentIds)
              )
            )
            .groupBy(contentMetrics.contentId),
          db
            .select({
              contentId: leadTracking.contentId,
              leadsTracked: sql<number>`COUNT(*)`,
              convertedLeads: sql<number>`COUNT(*) FILTER (WHERE ${leadTracking.status} = 'converted')`,
              newLeads: sql<number>`COUNT(*) FILTER (WHERE ${leadTracking.status} = 'new')`,
              contactedLeads: sql<number>`COUNT(*) FILTER (WHERE ${leadTracking.status} = 'contacted')`,
              qualifiedLeads: sql<number>`COUNT(*) FILTER (WHERE ${leadTracking.status} = 'qualified')`,
              lostLeads: sql<number>`COUNT(*) FILTER (WHERE ${leadTracking.status} = 'lost')`,
              scoreA: sql<number>`COUNT(*) FILTER (WHERE ${leadTracking.score} = 'A')`,
              scoreB: sql<number>`COUNT(*) FILTER (WHERE ${leadTracking.score} = 'B')`,
              scoreC: sql<number>`COUNT(*) FILTER (WHERE ${leadTracking.score} = 'C')`,
            })
            .from(leadTracking)
            .where(
              and(
                eq(leadTracking.workspaceId, workspaceId),
                inArray(leadTracking.contentId, contentIds)
              )
            )
            .groupBy(leadTracking.contentId),
        ])
      : [[], []]

    const performanceByContent = new Map(
      performanceRows.map((row) => [
        row.contentId,
        {
          views: Number(row.views ?? 0),
          impressions: Number(row.impressions ?? 0),
          clicks: Number(row.clicks ?? 0),
          leadsGenerated: Number(row.leadsGenerated ?? 0),
          conversions: Number(row.conversions ?? 0),
          engagementRate: Number(row.engagementRate ?? 0),
        },
      ])
    )

    const leadsByContent = new Map(
      leadRows.map((row) => [
        row.contentId,
        {
          leadsTracked: Number(row.leadsTracked ?? 0),
          convertedLeads: Number(row.convertedLeads ?? 0),
          newLeads: Number(row.newLeads ?? 0),
          contactedLeads: Number(row.contactedLeads ?? 0),
          qualifiedLeads: Number(row.qualifiedLeads ?? 0),
          lostLeads: Number(row.lostLeads ?? 0),
          scoreA: Number(row.scoreA ?? 0),
          scoreB: Number(row.scoreB ?? 0),
          scoreC: Number(row.scoreC ?? 0),
        },
      ])
    )

    const enrichedItems = items.map((item) => ({
      ...item,
      microZone: item.microZone
        ? {
            id: item.microZone.id,
            name: item.microZone.name,
            municipality: item.microZone.municipality,
          }
        : null,
      performance: {
        views: performanceByContent.get(item.id)?.views ?? 0,
        impressions: performanceByContent.get(item.id)?.impressions ?? 0,
        clicks: performanceByContent.get(item.id)?.clicks ?? 0,
        leadsGenerated: performanceByContent.get(item.id)?.leadsGenerated ?? 0,
        conversions: performanceByContent.get(item.id)?.conversions ?? 0,
        engagementRate: performanceByContent.get(item.id)?.engagementRate ?? 0,
        leadsTracked: leadsByContent.get(item.id)?.leadsTracked ?? 0,
        convertedLeads: leadsByContent.get(item.id)?.convertedLeads ?? 0,
        leadStatus: {
          new: leadsByContent.get(item.id)?.newLeads ?? 0,
          contacted: leadsByContent.get(item.id)?.contactedLeads ?? 0,
          qualified: leadsByContent.get(item.id)?.qualifiedLeads ?? 0,
          lost: leadsByContent.get(item.id)?.lostLeads ?? 0,
        },
        leadScore: {
          A: leadsByContent.get(item.id)?.scoreA ?? 0,
          B: leadsByContent.get(item.id)?.scoreB ?? 0,
          C: leadsByContent.get(item.id)?.scoreC ?? 0,
        },
      },
    }))

    return NextResponse.json({ success: true, items: enrichedItems, scheduledQueue, deliveryQueue })
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

    if (body.action === 'dispatch') {
      const queuedPost = await db.query.scheduledPosts.findFirst({
        where: and(
          eq(scheduledPosts.workspaceId, workspaceId),
          eq(scheduledPosts.contentId, existing.id),
          inArray(scheduledPosts.status, ['pending', 'failed'])
        ),
        orderBy: [asc(scheduledPosts.scheduledFor)],
        columns: {
          id: true,
          platform: true,
          retryCount: true,
        },
      })

      if (!queuedPost) {
        return NextResponse.json({ error: 'No hay entrega pendiente o fallida para esta pieza' }, { status: 400 })
      }

      await db
        .update(scheduledPosts)
        .set({
          status: 'processing',
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(scheduledPosts.id, queuedPost.id),
            eq(scheduledPosts.workspaceId, workspaceId)
          )
        )

      const publishedAt = new Date()
      const platformPostId = buildPlatformPostId(queuedPost.platform)

      await db
        .update(scheduledPosts)
        .set({
          status: 'published',
          publishedAt,
          platformPostId,
          platformResponse: {
            mode: 'manual-assist',
            deliveredBy: 'operator',
            deliveredAt: publishedAt.toISOString(),
          },
          updatedAt: publishedAt,
        })
        .where(
          and(
            eq(scheduledPosts.id, queuedPost.id),
            eq(scheduledPosts.workspaceId, workspaceId)
          )
        )

      const [published] = await db
        .update(generatedContent)
        .set({
          status: 'published',
          publishedAt,
          scheduledFor: null,
          updatedAt: publishedAt,
        })
        .where(
          and(
            eq(generatedContent.id, existing.id),
            eq(generatedContent.workspaceId, workspaceId)
          )
        )
        .returning()

      return NextResponse.json({ success: true, item: published })
    }

    if (body.action === 'retry_delivery') {
      const failedPost = await db.query.scheduledPosts.findFirst({
        where: and(
          eq(scheduledPosts.workspaceId, workspaceId),
          eq(scheduledPosts.contentId, existing.id),
          eq(scheduledPosts.status, 'failed')
        ),
        orderBy: [desc(scheduledPosts.updatedAt)],
        columns: {
          id: true,
          retryCount: true,
        },
      })

      if (!failedPost) {
        return NextResponse.json({ error: 'No hay una entrega fallida para reintentar' }, { status: 400 })
      }

      await db
        .update(scheduledPosts)
        .set({
          status: 'pending',
          retryCount: failedPost.retryCount + 1,
          lastError: null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(scheduledPosts.id, failedPost.id),
            eq(scheduledPosts.workspaceId, workspaceId)
          )
        )

      const [rescheduled] = await db
        .update(generatedContent)
        .set({
          status: 'scheduled',
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(generatedContent.id, existing.id),
            eq(generatedContent.workspaceId, workspaceId)
          )
        )
        .returning()

      return NextResponse.json({ success: true, item: rescheduled })
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
