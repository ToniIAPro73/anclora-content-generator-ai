/**
 * ANCLORA CONTENT GENERATOR AI - Metrics Dashboard API (Neon)
 * Feature: ANCLORA-FEAT-API-ROUTES
 * Endpoint: GET /api/metrics/dashboard-neon
 * Description: Retorna métricas agregadas del dashboard (Neon)
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { NextResponse } from 'next/server'
import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'

export const runtime = 'nodejs'

const EMPTY_METRICS = {
  totalContent: 0,
  publishedContent: 0,
  draftContent: 0,
  reviewContent: 0,
  approvedContent: 0,
  avgTokensUsed: 0,
  totalKnowledgeChunks: 0,
  scheduledPosts: 0,
  totalSources: 0,
  contentByType: {},
  recentActivity: [],
  recentContent: [],
  scheduledQueue: [],
  platformPerformance: [],
  topPerformingContent: [],
}

export async function GET() {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()

    // Return empty metrics when DATABASE_URL is not configured yet
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true, metrics: EMPTY_METRICS })
    }

    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)

    const [
      totalContentResult,
      publishedContentResult,
      draftContentResult,
      reviewContentResult,
      approvedContentResult,
      scheduledPostsResult,
      totalSourcesResult,
      contentByTypeResult,
      recentContentResult,
      scheduledQueueResult,
      platformPerformanceResult,
      topPerformingContentResult,
    ] =
      await Promise.all([
        sql`SELECT COUNT(*) as count FROM generated_content WHERE workspace_id = ${workspaceId}`,
        sql`SELECT COUNT(*) as count FROM generated_content WHERE workspace_id = ${workspaceId} AND status = 'published'`,
        sql`SELECT COUNT(*) as count FROM generated_content WHERE workspace_id = ${workspaceId} AND status = 'draft'`,
        sql`SELECT COUNT(*) as count FROM generated_content WHERE workspace_id = ${workspaceId} AND status = 'review'`,
        sql`SELECT COUNT(*) as count FROM generated_content WHERE workspace_id = ${workspaceId} AND status = 'approved'`,
        sql`SELECT COUNT(*) as count FROM scheduled_posts WHERE workspace_id = ${workspaceId} AND status = 'pending'`,
        sql`SELECT COUNT(*) as count FROM content_sources WHERE workspace_id = ${workspaceId}`,
        sql`
          SELECT content_type, COUNT(*) as count
          FROM generated_content
          WHERE workspace_id = ${workspaceId}
          GROUP BY content_type
        `,
        sql`
          SELECT id, title, status, content_type, updated_at
          FROM generated_content
          WHERE workspace_id = ${workspaceId}
          ORDER BY updated_at DESC
          LIMIT 5
        `,
        sql`
          SELECT sp.id, sp.content_id, sp.platform, sp.scheduled_for, gc.title, gc.content_type
          FROM scheduled_posts sp
          INNER JOIN generated_content gc ON gc.id = sp.content_id
          WHERE sp.workspace_id = ${workspaceId}
            AND sp.status = 'pending'
          ORDER BY sp.scheduled_for ASC
          LIMIT 5
        `,
        sql`
          SELECT
            platform,
            COALESCE(SUM(views), 0) AS views,
            COALESCE(SUM(impressions), 0) AS impressions,
            COALESCE(SUM(clicks), 0) AS clicks,
            COALESCE(SUM(leads_generated), 0) AS leads,
            COALESCE(AVG(engagement_rate), 0) AS avg_engagement_rate
          FROM content_metrics
          WHERE workspace_id = ${workspaceId}
          GROUP BY platform
          ORDER BY COALESCE(SUM(views), 0) DESC, COALESCE(SUM(leads_generated), 0) DESC
          LIMIT 5
        `,
        sql`
          SELECT
            gc.id,
            gc.title,
            gc.content_type,
            cm.platform,
            COALESCE(SUM(cm.views), 0) AS views,
            COALESCE(SUM(cm.impressions), 0) AS impressions,
            COALESCE(SUM(cm.clicks), 0) AS clicks,
            COALESCE(SUM(cm.leads_generated), 0) AS leads,
            COALESCE(AVG(cm.engagement_rate), 0) AS avg_engagement_rate,
            MAX(cm.snapshot_date) AS last_snapshot
          FROM content_metrics cm
          INNER JOIN generated_content gc ON gc.id = cm.content_id
          WHERE cm.workspace_id = ${workspaceId}
          GROUP BY gc.id, gc.title, gc.content_type, cm.platform
          ORDER BY COALESCE(SUM(cm.views), 0) DESC, COALESCE(SUM(cm.leads_generated), 0) DESC
          LIMIT 5
        `,
      ])

    const contentByType = Object.fromEntries(
      contentByTypeResult.map((row) => [String(row.content_type), Number(row.count ?? 0)])
    )

    return NextResponse.json({
      success: true,
      metrics: {
        ...EMPTY_METRICS,
        totalContent: parseInt(String(totalContentResult[0]?.count ?? '0')),
        publishedContent: parseInt(String(publishedContentResult[0]?.count ?? '0')),
        draftContent: parseInt(String(draftContentResult[0]?.count ?? '0')),
        reviewContent: parseInt(String(reviewContentResult[0]?.count ?? '0')),
        approvedContent: parseInt(String(approvedContentResult[0]?.count ?? '0')),
        scheduledPosts: parseInt(String(scheduledPostsResult[0]?.count ?? '0')),
        totalSources: parseInt(String(totalSourcesResult[0]?.count ?? '0')),
        contentByType,
        recentContent: recentContentResult.map((row) => ({
          id: String(row.id),
          title: String(row.title),
          status: String(row.status),
          contentType: String(row.content_type),
          updatedAt: String(row.updated_at),
        })),
        scheduledQueue: scheduledQueueResult.map((row) => ({
          id: String(row.id),
          contentId: String(row.content_id),
          title: String(row.title),
          platform: String(row.platform),
          contentType: String(row.content_type),
          scheduledFor: String(row.scheduled_for),
        })),
        platformPerformance: platformPerformanceResult.map((row) => ({
          platform: String(row.platform),
          views: Number(row.views ?? 0),
          impressions: Number(row.impressions ?? 0),
          clicks: Number(row.clicks ?? 0),
          leads: Number(row.leads ?? 0),
          avgEngagementRate: Number(row.avg_engagement_rate ?? 0),
        })),
        topPerformingContent: topPerformingContentResult.map((row) => ({
          id: String(row.id),
          title: String(row.title),
          contentType: String(row.content_type),
          platform: String(row.platform),
          views: Number(row.views ?? 0),
          impressions: Number(row.impressions ?? 0),
          clicks: Number(row.clicks ?? 0),
          leads: Number(row.leads ?? 0),
          avgEngagementRate: Number(row.avg_engagement_rate ?? 0),
          lastSnapshot: String(row.last_snapshot),
        })),
      },
    })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Metrics API] Error:', error)
    return NextResponse.json({ success: true, metrics: EMPTY_METRICS })
  }
}
