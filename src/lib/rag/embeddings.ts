import { pipeline, type PipelineType, type FeatureExtractionPipeline, type ProgressCallback } from '@huggingface/transformers'

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
