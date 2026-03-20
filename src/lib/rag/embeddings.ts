import { pipeline, type PipelineType, type FeatureExtractionPipeline, type ProgressCallback } from '@huggingface/transformers'
import { ensureRagBackendCompatibility, getEmbeddingBackend, getGoogleEmbeddingModel } from './config'

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2'

class PipelineSingleton {
  static task: PipelineType = 'feature-extraction'
  static model = MODEL_NAME
  static instance: Promise<FeatureExtractionPipeline> | null = null

  static async getInstance(progress_callback?: ProgressCallback): Promise<FeatureExtractionPipeline> {
    if (this.instance === null) {
      // Configuraciones para entorno Node/Edge
      const { env } = await import('@huggingface/transformers')
      // Deshabilitamos modelos locales para asegurar descarga del Hub
      env.allowLocalModels = false

      this.instance = (pipeline(this.task, this.model, {
        progress_callback,
      }) as unknown) as Promise<FeatureExtractionPipeline>
    }
    return this.instance
  }
}

/**
 * Genera embeddings vectoriales locales sin coste de API.
 * @param text El texto a procesar.
 * @returns Array de floats representando el embedding (dim: 384 por defecto)
 */
export async function generateLocalEmbeddings(text: string): Promise<number[]> {
  const extractor = await PipelineSingleton.getInstance()
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  
  // Convertimos el Float32Array a un const array standard
  return Array.from(output.data)
}

export async function generateGoogleEmbeddings(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${getGoogleEmbeddingModel()}:embedContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GOOGLE_AI_API_KEY || '',
      },
      body: JSON.stringify({
        model: `models/${getGoogleEmbeddingModel()}`,
        content: {
          parts: [{ text }],
        },
        outputDimensionality: 1536,
      }),
    }
  )

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Google embeddings error: ${details}`)
  }

  const payload = (await response.json()) as {
    embedding?: {
      values?: number[]
    }
  }

  const values = payload.embedding?.values
  if (!values?.length) {
    throw new Error('Google embeddings devolvio un vector vacio')
  }

  return values
}

export async function generateEmbeddings(text: string): Promise<number[]> {
  ensureRagBackendCompatibility()

  if (getEmbeddingBackend() === 'google') {
    return generateGoogleEmbeddings(text)
  }

  return generateLocalEmbeddings(text)
}
