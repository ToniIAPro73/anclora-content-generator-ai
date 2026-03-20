/**
 * ANCLORA CONTENT GENERATOR AI - Ingest Content API (Neon)
 * Feature: ANCLORA-FEAT-API-ROUTES
 * Endpoint: POST /api/content/ingest-neon
 * Description: Ingesta documentos/URLs y genera chunks con embeddings (Neon)
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { NextRequest, NextResponse } from 'next/server'
import { db, insertChunks } from '@/lib/db/neon'
import { contentSources } from '@/lib/db/schema'
import { chunkText } from '@/lib/rag/chunking'
import { generateLocalEmbeddings } from '@/lib/rag/embeddings'
import { eq } from 'drizzle-orm'
import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'

export const runtime = 'nodejs'

interface IngestRequest {
  title: string
  sourceType: 'document' | 'url' | 'rss' | 'manual' | 'api'
  content?: string
  sourceUrl?: string
  metadata?: Record<string, unknown>
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

    // Crear source
    const [source] = await db.insert(contentSources).values({
      workspaceId,
      title: body.title,
      sourceType: body.sourceType,
      sourceUrl: body.sourceUrl,
      content: body.content,
      metadata: body.metadata || {},
      status: 'processing'
    }).returning()

    // Procesar contenido (chunking + embeddings)
    const contentToProcess = body.content || ''

    const chunks = chunkText(contentToProcess, {
      maxChunkSize: 1000,
      overlap: 200,
      mode: 'semantic'
    })

    // Generar embeddings y preparar para inserción
    const chunksWithEmbeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await generateLocalEmbeddings(chunk.content)
        return {
          content: chunk.content,
          chunkIndex: chunk.index,
          embedding,
          metadata: chunk.metadata,
          tokenCount: chunk.metadata.tokenCount as number | undefined
        }
      })
    )

    // Insertar todos los chunks de una vez (bulk insert)
    await insertChunks({
      workspaceId,
      sourceId: source.id,
      chunks: chunksWithEmbeddings
    })

    // Actualizar source
    await db.update(contentSources)
      .set({
        status: 'completed',
        chunksCount: chunks.length,
        processedAt: new Date()
      })
      .where(eq(contentSources.id, source.id))

    return NextResponse.json({
      success: true,
      source: {
        ...source,
        chunksCount: chunks.length
      }
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
