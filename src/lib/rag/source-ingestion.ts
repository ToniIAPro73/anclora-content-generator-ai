import { Buffer } from 'node:buffer'

import mammoth from 'mammoth'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db/neon'
import { contentSources, type sourceCategoryEnum, type sourceTypeEnum } from '@/lib/db/schema'
import { chunkText } from '@/lib/rag/chunking'
import { createContentOpportunitiesFromIngestion } from '@/lib/rag/content-opportunity-agent'
import { generateEmbeddings } from '@/lib/rag/embeddings'
import { insertVectorChunks } from '@/lib/rag/vector-store'

type SourceType = (typeof sourceTypeEnum.enumValues)[number]
type SourceCategory = (typeof sourceCategoryEnum.enumValues)[number]

type CreateIndexedSourceInput = {
  workspaceId: string
  title: string
  sourceType: SourceType
  sourceCategory?: SourceCategory
  content: string
  sourceUrl?: string
  metadata?: Record<string, unknown>
}

function buildFallbackEmbedding(text: string, dimensions = 384) {
  const vector = new Array<number>(dimensions).fill(0)
  if (!text.trim()) {
    return vector
  }

  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index)
    vector[index % dimensions] += ((code % 31) - 15) / 31
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1
  return vector.map((value) => value / norm)
}

async function generateResilientEmbedding(text: string) {
  try {
    return await generateEmbeddings(text)
  } catch (error) {
    console.warn('[Source Ingestion] Falling back to deterministic embedding', error)
    return buildFallbackEmbedding(text)
  }
}

export async function createIndexedSource(input: CreateIndexedSourceInput) {
  const [source] = await db
    .insert(contentSources)
    .values({
      workspaceId: input.workspaceId,
      title: input.title,
      sourceType: input.sourceType,
      sourceCategory: input.sourceCategory ?? 'general',
      sourceUrl: input.sourceUrl ?? null,
      content: input.content,
      metadata: {
        sourceCategory: input.sourceCategory ?? 'general',
        ...(input.metadata ?? {}),
      },
      status: 'processing',
    })
    .returning()

  try {
    const chunks = chunkText(input.content, {
      maxChunkSize: 1000,
      overlap: 200,
      mode: 'semantic',
    })

    const chunksWithEmbeddings = await Promise.all(
      chunks.map(async (chunk) => ({
        content: chunk.content,
        chunkIndex: chunk.index,
        embedding: await generateResilientEmbedding(chunk.content),
        metadata: {
          ...chunk.metadata,
          title: input.title,
          sourceType: input.sourceType,
          sourceCategory: input.sourceCategory ?? 'general',
        },
        tokenCount: chunk.metadata.tokenCount as number | undefined,
      }))
    )

    await insertVectorChunks({
      workspaceId: input.workspaceId,
      sourceId: source.id,
      chunks: chunksWithEmbeddings,
    })

    await db
      .update(contentSources)
      .set({
        status: 'completed',
        chunksCount: chunks.length,
        processedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(contentSources.id, source.id))

    await createContentOpportunitiesFromIngestion({
      workspaceId: input.workspaceId,
      sourceId: source.id,
      title: input.title,
      content: input.content,
    })

    return {
      id: source.id,
      title: input.title,
      type: input.sourceType,
      category: input.sourceCategory ?? 'general',
      status: 'completed',
      chunks: chunks.length,
      date: new Date().toISOString().slice(0, 10),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo procesar la fuente'

    await db
      .update(contentSources)
      .set({
        status: 'error',
        errorMessage: message,
        updatedAt: new Date(),
      })
      .where(eq(contentSources.id, source.id))

    throw error
  }
}

function extractGoogleDocId(url: string) {
  const match = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/)
  return match?.[1] ?? null
}

export async function fetchGoogleDocAsText(url: string) {
  const docId = extractGoogleDocId(url)
  if (!docId) {
    throw new Error('La URL de Google Docs no tiene un identificador valido')
  }

  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`
  const response = await fetch(exportUrl)

  if (!response.ok) {
    throw new Error('No se pudo exportar el Google Doc. Asegurate de que sea accesible o publico.')
  }

  const text = await response.text()
  if (!text.trim()) {
    throw new Error('El Google Doc no contiene texto util para indexar')
  }

  return text
}

export async function extractTextFromUploadedFile(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer())
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension === 'pdf') {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({
      data: bytes,
      worker: null as never,
    })
    try {
      const result = await parser.getText()
      return result.text?.trim() ?? ''
    } finally {
      await parser.destroy()
    }
  }

  if (extension === 'docx') {
    const result = await mammoth.extractRawText({ buffer: bytes })
    return result.value?.trim() ?? ''
  }

  if (extension === 'txt' || extension === 'md') {
    return bytes.toString('utf-8').trim()
  }

  throw new Error('Formato no soportado. Usa PDF, DOCX, TXT o MD.')
}
