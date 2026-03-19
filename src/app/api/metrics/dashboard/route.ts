/**
 * ANCLORA CONTENT GENERATOR AI - Metrics Dashboard API (Neon)
 * Feature: ANCLORA-FEAT-API-ROUTES
 * Endpoint: GET /api/metrics/dashboard-neon
 * Description: Retorna métricas agregadas del dashboard (Neon)
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/neon'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Obtener workspaceId de query params (temporalmente)
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId es requerido' },
        { status: 400 }
      )
    }

    // Ejecutar queries en paralelo usando Neon SQL
    const [
      totalContentResult,
      publishedContentResult,
      scheduledPostsResult,
      totalSourcesResult
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM generated_content WHERE workspace_id = ${workspaceId}`,
      sql`SELECT COUNT(*) as count FROM generated_content WHERE workspace_id = ${workspaceId} AND status = 'published'`,
      sql`SELECT COUNT(*) as count FROM scheduled_posts WHERE workspace_id = ${workspaceId} AND status = 'pending'`,
      sql`SELECT COUNT(*) as count FROM content_sources WHERE workspace_id = ${workspaceId}`
    ])

    return NextResponse.json({
      success: true,
      metrics: {
        totalContent: parseInt(totalContentResult[0]?.count || '0'),
        publishedContent: parseInt(publishedContentResult[0]?.count || '0'),
        scheduledPosts: parseInt(scheduledPostsResult[0]?.count || '0'),
        totalSources: parseInt(totalSourcesResult[0]?.count || '0')
      }
    })

  } catch (error) {
    console.error('[Metrics API] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: String(error) },
      { status: 500 }
    )
  }
}
