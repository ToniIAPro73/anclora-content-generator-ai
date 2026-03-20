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
  avgTokensUsed: 0,
  totalKnowledgeChunks: 0,
  scheduledPosts: 0,
  totalSources: 0,
  contentByType: {},
  recentActivity: [],
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

    const [totalContentResult, publishedContentResult, scheduledPostsResult, totalSourcesResult] =
      await Promise.all([
        sql`SELECT COUNT(*) as count FROM generated_content WHERE workspace_id = ${workspaceId}`,
        sql`SELECT COUNT(*) as count FROM generated_content WHERE workspace_id = ${workspaceId} AND status = 'published'`,
        sql`SELECT COUNT(*) as count FROM scheduled_posts WHERE workspace_id = ${workspaceId} AND status = 'pending'`,
        sql`SELECT COUNT(*) as count FROM content_sources WHERE workspace_id = ${workspaceId}`,
      ])

    return NextResponse.json({
      success: true,
      metrics: {
        ...EMPTY_METRICS,
        totalContent: parseInt(String(totalContentResult[0]?.count ?? '0')),
        publishedContent: parseInt(String(publishedContentResult[0]?.count ?? '0')),
        scheduledPosts: parseInt(String(scheduledPostsResult[0]?.count ?? '0')),
        totalSources: parseInt(String(totalSourcesResult[0]?.count ?? '0')),
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
