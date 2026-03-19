/**
 * ANCLORA CONTENT GENERATOR AI - Neon Client
 * Serverless PostgreSQL client with pgvector support
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * Cliente SQL directo de Neon (para queries raw)
 * Note: fetchConnectionCache is now always true by default
 */
export const sql = neon(process.env.DATABASE_URL!)

/**
 * Cliente Drizzle ORM (para queries tipadas)
 */
export const db = drizzle(sql, { schema })

/**
 * Helper para ejecutar queries vectoriales
 * @example
 * const results = await vectorSearch({
 *   embedding: [0.1, 0.2, ...],
 *   workspaceId: '...',
 *   limit: 5
 * })
 */
export async function vectorSearch(params: {
  embedding: number[]
  workspaceId: string
  limit?: number
  threshold?: number
}) {
  const { embedding, workspaceId, limit = 5, threshold = 0.7 } = params

  // Convertir embedding a string de PostgreSQL
  const embeddingStr = `[${embedding.join(',')}]`

  const results = await sql`
    SELECT
      id,
      content,
      source_id,
      metadata,
      1 - (embedding <=> ${embeddingStr}::vector) as similarity
    FROM knowledge_chunks
    WHERE workspace_id = ${workspaceId}
      AND 1 - (embedding <=> ${embeddingStr}::vector) > ${threshold}
    ORDER BY embedding <=> ${embeddingStr}::vector
    LIMIT ${limit}
  `

  return results as Array<{
    id: string
    content: string
    source_id: string
    metadata: Record<string, unknown>
    similarity: number
  }>
}

/**
 * Helper para insertar chunks con embeddings
 */
export async function insertChunks(params: {
  workspaceId: string
  sourceId: string
  chunks: Array<{
    content: string
    chunkIndex: number
    embedding: number[]
    metadata?: Record<string, unknown>
    tokenCount?: number
  }>
}) {
  const { workspaceId, sourceId, chunks } = params

  // Construir valores para bulk insert
  const values = chunks.map(chunk => ({
    workspace_id: workspaceId,
    source_id: sourceId,
    content: chunk.content,
    chunk_index: chunk.chunkIndex,
    embedding: `[${chunk.embedding.join(',')}]`,
    metadata: JSON.stringify(chunk.metadata || {}),
    token_count: chunk.tokenCount || null
  }))

  // Bulk insert usando múltiples queries (más simple y seguro)
  for (const v of values) {
    await sql`
      INSERT INTO knowledge_chunks
      (workspace_id, source_id, content, chunk_index, embedding, metadata, token_count)
      VALUES (
        ${v.workspace_id},
        ${v.source_id},
        ${v.content},
        ${v.chunk_index},
        ${v.embedding}::vector,
        ${v.metadata}::jsonb,
        ${v.token_count}
      )
    `
  }

  return chunks.length
}
