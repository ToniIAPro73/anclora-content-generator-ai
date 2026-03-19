/**
 * ANCLORA CONTENT GENERATOR AI - Chunking Module
 * Feature: ANCLORA-FEAT-RAG-ENGINE
 * Description: Segmentación semántica de documentos para RAG
 * Author: Agent B (API & RAG Engineer)
 * Date: 2026-03-19
 */

export interface ChunkOptions {
  /** Tamaño máximo del chunk en caracteres */
  maxChunkSize?: number
  /** Overlap entre chunks consecutivos (en caracteres) */
  overlap?: number
  /** Separadores para dividir el texto */
  separators?: string[]
  /** Modo de chunking: 'semantic' | 'fixed' */
  mode?: 'semantic' | 'fixed'
}

export interface TextChunk {
  content: string
  index: number
  metadata: {
    startChar: number
    endChar: number
    tokenCount?: number
    [key: string]: unknown
  }
}

const DEFAULT_OPTIONS: Required<ChunkOptions> = {
  maxChunkSize: 1000,
  overlap: 200,
  separators: ['\n\n', '\n', '. ', ', ', ' '],
  mode: 'semantic'
}

/**
 * Estima el número de tokens de un texto
 * Aproximación simple: ~1.3 caracteres por token para español
 */
function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 1.3)
}

/**
 * Divide texto en chunks usando separadores jerárquicos
 * @param text Texto a dividir
 * @param options Opciones de chunking
 * @returns Array de chunks con metadata
 */
export function chunkText(text: string, options: ChunkOptions = {}): TextChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  if (opts.mode === 'fixed') {
    return fixedSizeChunking(text, opts)
  }

  return semanticChunking(text, opts)
}

/**
 * Chunking de tamaño fijo con overlap
 */
function fixedSizeChunking(text: string, opts: Required<ChunkOptions>): TextChunk[] {
  const chunks: TextChunk[] = []
  const { maxChunkSize, overlap } = opts

  let startIndex = 0
  let chunkIndex = 0

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + maxChunkSize, text.length)
    const chunkContent = text.slice(startIndex, endIndex)

    chunks.push({
      content: chunkContent.trim(),
      index: chunkIndex,
      metadata: {
        startChar: startIndex,
        endChar: endIndex,
        tokenCount: estimateTokenCount(chunkContent)
      }
    })

    // Mover el índice con overlap
    startIndex = endIndex - overlap
    chunkIndex++

    // Evitar chunks muy pequeños al final
    if (startIndex >= text.length || (text.length - startIndex) < overlap) {
      break
    }
  }

  return chunks
}

/**
 * Chunking semántico usando separadores jerárquicos
 * Intenta mantener párrafos y oraciones completas
 */
function semanticChunking(text: string, opts: Required<ChunkOptions>): TextChunk[] {
  const chunks: TextChunk[] = []
  const { maxChunkSize, overlap, separators } = opts

  // Primero, dividir por los separadores principales (párrafos)
  const paragraphs = splitBySeparator(text, separators[0] || '\n\n')

  let currentChunk = ''
  let currentStartChar = 0
  let chunkIndex = 0

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]

    // Si el párrafo es demasiado largo, dividirlo recursivamente
    if (paragraph.length > maxChunkSize) {
      // Guardar chunk actual si existe
      if (currentChunk.trim()) {
        chunks.push(createChunk(currentChunk.trim(), chunkIndex++, currentStartChar))
        currentChunk = ''
      }

      // Dividir párrafo largo recursivamente
      const subChunks = splitLongText(paragraph, maxChunkSize, separators.slice(1))
      subChunks.forEach(subChunk => {
        chunks.push(createChunk(subChunk.trim(), chunkIndex++, currentStartChar))
        currentStartChar += subChunk.length
      })

      continue
    }

    // Si agregar el párrafo excede el tamaño máximo
    if ((currentChunk + paragraph).length > maxChunkSize && currentChunk.trim()) {
      // Guardar chunk actual
      chunks.push(createChunk(currentChunk.trim(), chunkIndex++, currentStartChar))

      // Mantener overlap con el chunk anterior
      const words = currentChunk.split(' ')
      const overlapText = words.slice(-Math.ceil(overlap / 5)).join(' ') // Aproximadamente 'overlap' caracteres

      currentChunk = overlapText + ' ' + paragraph
      currentStartChar += currentChunk.length - paragraph.length
    } else {
      // Agregar párrafo al chunk actual
      currentChunk += (currentChunk ? separators[0] : '') + paragraph
    }
  }

  // Agregar último chunk si existe
  if (currentChunk.trim()) {
    chunks.push(createChunk(currentChunk.trim(), chunkIndex, currentStartChar))
  }

  return chunks
}

/**
 * Divide texto por un separador específico
 */
function splitBySeparator(text: string, separator: string): string[] {
  return text.split(separator).filter(part => part.trim().length > 0)
}

/**
 * Divide texto largo recursivamente usando separadores jerárquicos
 */
function splitLongText(text: string, maxSize: number, separators: string[]): string[] {
  if (text.length <= maxSize) {
    return [text]
  }

  // Intentar con el siguiente separador en la jerarquía
  if (separators.length === 0) {
    // Si no quedan separadores, hacer split forzado
    return forceSplit(text, maxSize)
  }

  const separator = separators[0]
  const parts = splitBySeparator(text, separator)
  const result: string[] = []

  let currentPart = ''

  for (const part of parts) {
    if (part.length > maxSize) {
      // Parte muy larga, dividir recursivamente
      if (currentPart.trim()) {
        result.push(currentPart.trim())
        currentPart = ''
      }
      result.push(...splitLongText(part, maxSize, separators.slice(1)))
    } else if ((currentPart + separator + part).length > maxSize) {
      // Agregar parte actual excedería el límite
      if (currentPart.trim()) {
        result.push(currentPart.trim())
      }
      currentPart = part
    } else {
      // Agregar parte al chunk actual
      currentPart += (currentPart ? separator : '') + part
    }
  }

  if (currentPart.trim()) {
    result.push(currentPart.trim())
  }

  return result
}

/**
 * Split forzado cuando no hay separadores disponibles
 */
function forceSplit(text: string, maxSize: number): string[] {
  const result: string[] = []

  for (let i = 0; i < text.length; i += maxSize) {
    result.push(text.slice(i, i + maxSize))
  }

  return result
}

/**
 * Crea un objeto TextChunk
 */
function createChunk(content: string, index: number, startChar: number): TextChunk {
  return {
    content,
    index,
    metadata: {
      startChar,
      endChar: startChar + content.length,
      tokenCount: estimateTokenCount(content)
    }
  }
}

/**
 * Utility: Procesa múltiples documentos y retorna chunks combinados
 */
export function chunkDocuments(
  documents: Array<{ id: string; content: string; metadata?: Record<string, unknown> }>,
  options: ChunkOptions = {}
): Array<TextChunk & { documentId: string }> {
  const allChunks: Array<TextChunk & { documentId: string }> = []

  documents.forEach(doc => {
    const chunks = chunkText(doc.content, options)

    chunks.forEach(chunk => {
      allChunks.push({
        ...chunk,
        documentId: doc.id,
        metadata: {
          ...chunk.metadata,
          ...doc.metadata
        }
      })
    })
  })

  return allChunks
}
