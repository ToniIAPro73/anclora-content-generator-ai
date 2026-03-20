/**
 * ANCLORA CONTENT GENERATOR AI - Retrieval Module (Neon)
 * Feature: ANCLORA-FEAT-RAG-ENGINE
 * Description: Búsqueda semántica vectorial con Neon + pgvector
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { vectorSearch } from '@/lib/db/neon'
import { generateLocalEmbeddings } from './embeddings'

export interface RetrievalOptions {
  /** Número máximo de chunks a retornar */
  topK?: number
  /** Threshold de similaridad mínima (0-1) */
  similarityThreshold?: number
  /** Filtrar por workspace_id específico */
  workspaceId: string
  /** Filtrar por source_ids específicos */
  sourceIds?: string[]
}

export interface SimilarChunk {
  id: string
  content: string
  source_id: string
  similarity: number
  metadata: Record<string, unknown>
}

export interface RetrievalResult {
  chunks: SimilarChunk[]
  query: string
  totalFound: number
  executionTimeMs: number
}

const DEFAULT_OPTIONS = {
  topK: 5,
  similarityThreshold: 0.7
}

/**
 * Busca chunks similares semánticamente a una query de texto
 * @param query Texto de búsqueda
 * @param options Opciones de retrieval
 * @returns Resultados de búsqueda con chunks similares
 */
export async function retrieveSimilarChunks(
  query: string,
  options: RetrievalOptions
): Promise<RetrievalResult> {
  const startTime = performance.now()
  const opts = { ...DEFAULT_OPTIONS, ...options }

  try {
    // 1. Generar embedding de la query
    const queryEmbedding = await generateLocalEmbeddings(query)

    // 2. Ejecutar búsqueda vectorial en Neon
    const results = await vectorSearch({
      embedding: queryEmbedding,
      workspaceId: opts.workspaceId,
      limit: opts.topK,
      threshold: opts.similarityThreshold
    })

    // 3. Filtrar por source_ids si se especificó
    let filteredResults = results

    if (options.sourceIds && options.sourceIds.length > 0) {
      filteredResults = results.filter(chunk =>
        options.sourceIds!.includes(chunk.source_id)
      )
    }

    const executionTimeMs = performance.now() - startTime

    return {
      chunks: filteredResults,
      query,
      totalFound: filteredResults.length,
      executionTimeMs
    }
  } catch (error) {
    console.error('[RAG Retrieval] Error:', error)
    throw error
  }
}

/**
 * Retrieval con reranking (opcional)
 * Útil para mejorar la precisión cuando se necesitan más resultados
 */
export async function retrieveWithReranking(
  query: string,
  options: RetrievalOptions & { rerankTopK?: number }
): Promise<RetrievalResult> {
  const rerankTopK = options.rerankTopK || options.topK || 5

  // Recuperar más chunks de los necesarios para reranking
  const initialTopK = (options.topK || 5) * 2

  const initialResults = await retrieveSimilarChunks(query, {
    ...options,
    topK: initialTopK
  })

  // Si no hay suficientes resultados, retornar directamente
  if (initialResults.chunks.length <= rerankTopK) {
    return initialResults
  }

  // Reranking simple por similaridad
  const rerankedChunks = initialResults.chunks
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, rerankTopK)

  return {
    ...initialResults,
    chunks: rerankedChunks,
    totalFound: rerankedChunks.length
  }
}

/**
 * Contexto builder: convierte chunks recuperados en contexto para el LLM
 */
export function buildContextFromChunks(
  chunks: SimilarChunk[],
  options: {
    maxTokens?: number
    includeMetadata?: boolean
    separator?: string
  } = {}
): string {
  const {
    maxTokens = 4000,
    includeMetadata = false,
    separator = '\n\n---\n\n'
  } = options

  let context = ''
  let estimatedTokens = 0

  for (const chunk of chunks) {
    const sourceTitle = typeof chunk.metadata.title === 'string' ? chunk.metadata.title : chunk.source_id
    const sourceCategory =
      typeof chunk.metadata.sourceCategory === 'string' ? chunk.metadata.sourceCategory : 'general'
    const chunkText = includeMetadata
      ? `[Source: ${sourceTitle} | Category: ${sourceCategory} | Similarity: ${chunk.similarity.toFixed(3)}]\n${chunk.content}`
      : chunk.content

    // Estimación simple de tokens (1.3 chars/token para español)
    const chunkTokens = Math.ceil(chunkText.length / 1.3)

    // Si agregar este chunk excede el límite, parar
    if (estimatedTokens + chunkTokens > maxTokens) {
      break
    }

    context += (context ? separator : '') + chunkText
    estimatedTokens += chunkTokens
  }

  return context
}
