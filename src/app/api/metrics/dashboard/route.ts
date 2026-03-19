/**
 * ANCLORA CONTENT GENERATOR AI - Metrics Dashboard API (Neon)
 * Feature: ANCLORA-FEAT-API-ROUTES
 * Endpoint: GET /api/metrics/dashboard-neon
 * Description: Retorna métricas agregadas del dashboard (Neon)
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  // Return empty metrics when DATABASE_URL is not configured yet
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: true, metrics: EMPTY_METRICS })
  }

  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId es requerido' }, { status: 400 })
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
    console.error('[Metrics API] Error:', error)
    return NextResponse.json({ success: true, metrics: EMPTY_METRICS })
  }
}
