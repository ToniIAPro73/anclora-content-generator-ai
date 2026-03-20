/**
 * ANCLORA CONTENT GENERATOR AI - Ingest Content API (Neon)
 * Feature: ANCLORA-FEAT-API-ROUTES
 * Endpoint: POST /api/content/ingest-neon
 * Description: Ingesta documentos/URLs y genera chunks con embeddings (Neon)
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { sourceCategoryEnum } from '@/lib/db/schema'
import { createIndexedSource } from '@/lib/rag/source-ingestion'

export const runtime = 'nodejs'

interface IngestRequest {
  title: string
  sourceType: 'document' | 'url' | 'rss' | 'manual' | 'api'
  sourceCategory?: (typeof sourceCategoryEnum.enumValues)[number]
  content?: string
  sourceUrl?: string
  metadata?: Record<string, unknown>
}

function resolveSourceCategory(category?: string) {
  return sourceCategoryEnum.enumValues.includes(category as (typeof sourceCategoryEnum.enumValues)[number])
    ? (category as (typeof sourceCategoryEnum.enumValues)[number])
    : 'general'
}

export async function POST(request: NextRequest) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()

    // Parsear request
    const body: IngestRequest = await request.json()

    if (!body.title || !body.sourceType) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: title, sourceType' },
        { status: 400 }
      )
    }

    if (!body.content && !body.sourceUrl) {
      return NextResponse.json(
        { error: 'Debes proporcionar content o sourceUrl' },
        { status: 400 }
      )
    }

    const source = await createIndexedSource({
      workspaceId,
      title: body.title,
      sourceType: body.sourceType,
      sourceCategory: resolveSourceCategory(body.sourceCategory),
      sourceUrl: body.sourceUrl,
      content: body.content || '',
      metadata: body.metadata || {},
    })

    return NextResponse.json({
      success: true,
      source,
    })

  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Ingest API] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: String(error) },
      { status: 500 }
    )
  }
}
