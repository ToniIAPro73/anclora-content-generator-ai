/**
 * ANCLORA CONTENT GENERATOR AI - RAG Pipeline
 * Feature: ANCLORA-FEAT-RAG-ENGINE
 * Description: Pipeline completo para generación de contenido con RAG
 * Author: Agent B (API & RAG Engineer)
 * Date: 2026-03-19
 */

import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { retrieveSimilarChunks, buildContextFromChunks } from './retrieval-neon'
import type { RetrievalOptions } from './retrieval-neon'
import type { ContentType } from '@/lib/db/types'

// =====================================================
// AI CLIENTS CONFIGURATION
// =====================================================

// 1. Cliente Groq (compatible con OpenAI SDK)
export const groqClient = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY || 'dummy_groq_key',
})

// 2. Cliente Ollama Local (compatible con OpenAI SDK nativamente o con endpoint local)
export const ollamaClient = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
  apiKey: 'ollama', // Ollama no requiere key real
})

// 3. Cliente Anthropic (Master Copy)
export const anthropicClient = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_anthropic_key',
})

/**
 * Retorna el modelo de inferencia adecuado según el nivel de complejidad requerido.
 * @param speed Nivel de inferencia deseado
 */
export function getModel(speed: 'fast-local' | 'fast-cloud' | 'reasoning' = 'fast-cloud') {
  switch (speed) {
    case 'fast-local':
      // Ideal para formateo de metadatos o chunks ligeros (Zero Cost)
      return ollamaClient('llama3')
    case 'reasoning':
      // Ideal para la redacción final del artículo comercial (Claude 3.5 Sonnet)
      return anthropicClient('claude-3-5-sonnet-20240620')
    case 'fast-cloud':
    default:
      // Ideal para ingestas pesadas, extraer entidades de Idealista, etc. (High rate limit, low latency)
      return groqClient('llama3-70b-8192')
  }
}

// =====================================================
// RAG PIPELINE
// =====================================================

export interface GenerateContentOptions {
  /** Tipo de contenido a generar */
  contentType: ContentType
  /** System prompt del template */
  systemPrompt: string
  /** User prompt / instrucciones específicas */
  userPrompt: string
  /** Query para retrieval RAG (opcional) */
  ragQuery?: string
  /** Opciones de retrieval */
  retrievalOptions?: RetrievalOptions
  /** Modelo a usar */
  model?: 'fast-local' | 'fast-cloud' | 'reasoning'
  /** Configuración del modelo */
  modelConfig?: {
    temperature?: number
    maxTokens?: number
    topP?: number
  }
}

export interface GenerateContentResult {
  content: string
  metadata: {
    model: string
    tokensUsed: number
    ragSources?: string[]
    ragSourceDetails?: Array<{
      sourceId: string
      title: string
      category: string
      similarity: number
    }>
    retrievalTime?: number
    generationTime: number
  }
}

/**
 * Pipeline completo de generación de contenido con RAG
 * @param options Opciones de generación
 * @returns Contenido generado con metadata
 */
export async function generateContentWithRAG(
  options: GenerateContentOptions
): Promise<GenerateContentResult> {
  const startTime = performance.now()

  try {
    // 1. Retrieval de contexto (si ragQuery está presente)
    let ragContext = ''
    let ragSources: string[] = []
    let ragSourceDetails: GenerateContentResult['metadata']['ragSourceDetails']
    let retrievalTime = 0

    if (options.ragQuery && options.retrievalOptions) {
      const retrievalStart = performance.now()

      const retrievalResult = await retrieveSimilarChunks(
        options.ragQuery,
        options.retrievalOptions
      )

      ragContext = buildContextFromChunks(retrievalResult.chunks, {
        maxTokens: 3000,
        includeMetadata: false
      })

      const uniqueSources = new Map<string, { sourceId: string; title: string; category: string; similarity: number }>()
      for (const chunk of retrievalResult.chunks) {
        const title = typeof chunk.metadata.title === 'string' ? chunk.metadata.title : chunk.source_id
        const category =
          typeof chunk.metadata.sourceCategory === 'string' ? chunk.metadata.sourceCategory : 'general'
        const existing = uniqueSources.get(chunk.source_id)

        if (!existing || chunk.similarity > existing.similarity) {
          uniqueSources.set(chunk.source_id, {
            sourceId: chunk.source_id,
            title,
            category,
            similarity: chunk.similarity,
          })
        }
      }

      ragSourceDetails = Array.from(uniqueSources.values())
      ragSources = ragSourceDetails.map(
        (source) => `${source.title} · ${source.category} · ${(source.similarity * 100).toFixed(0)}%`
      )
      retrievalTime = performance.now() - retrievalStart
    }

    // 2. Construir prompt completo
    const fullUserPrompt = ragContext
      ? `${options.userPrompt}\n\n=== CONTEXTO RELEVANTE ===\n${ragContext}\n\n=== FIN CONTEXTO ===`
      : options.userPrompt

    // 3. Generar contenido con el LLM
    const model = getModel(options.model || 'reasoning')

    const { text, usage } = await generateText({
      model,
      system: options.systemPrompt,
      prompt: fullUserPrompt,
      temperature: options.modelConfig?.temperature || 0.7,
      topP: options.modelConfig?.topP || 0.9,
    })

    const generationTime = performance.now() - startTime

    return {
      content: text,
      metadata: {
        model: String(model),
        tokensUsed: usage?.totalTokens || 0,
        ragSources: ragSources.length > 0 ? ragSources : undefined,
        ragSourceDetails: ragSourceDetails?.length ? ragSourceDetails : undefined,
        retrievalTime: retrievalTime > 0 ? retrievalTime : undefined,
        generationTime
      }
    }
  } catch (error) {
    console.error('[RAG Pipeline] Error:', error)
    throw new Error(`Error en generación de contenido: ${error}`)
  }
}
