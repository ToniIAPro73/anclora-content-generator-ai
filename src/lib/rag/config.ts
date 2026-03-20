export type VectorBackend = 'pgvector' | 'pinecone'
export type EmbeddingBackend = 'local' | 'google'

const DEFAULT_TOP_K = 5
const DEFAULT_SIMILARITY_THRESHOLD = 0.7

export function getVectorBackend(): VectorBackend {
  return process.env.RAG_VECTOR_BACKEND === 'pinecone' ? 'pinecone' : 'pgvector'
}

export function getEmbeddingBackend(): EmbeddingBackend {
  return process.env.RAG_EMBEDDING_BACKEND === 'google' ? 'google' : 'local'
}

export function getRagTopK() {
  const parsed = Number(process.env.RAG_TOP_K ?? DEFAULT_TOP_K)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TOP_K
}

export function getRagSimilarityThreshold() {
  const parsed = Number(process.env.RAG_SIMILARITY_THRESHOLD ?? DEFAULT_SIMILARITY_THRESHOLD)
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : DEFAULT_SIMILARITY_THRESHOLD
}

export function getGoogleEmbeddingModel() {
  return process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001'
}

export function getGoogleGenerationModel() {
  return process.env.GEMINI_GENERATION_MODEL || 'gemini-2.0-flash'
}

export function getPineconeIndexName() {
  return process.env.PINECONE_INDEX_NAME || 'gemini-rag'
}

export function ensureRagBackendCompatibility() {
  const vectorBackend = getVectorBackend()
  const embeddingBackend = getEmbeddingBackend()

  if (vectorBackend === 'pgvector' && embeddingBackend === 'google') {
    throw new Error(
      'La configuracion actual no es compatible: `pgvector` sigue dimensionado para embeddings locales. Mantén `RAG_EMBEDDING_BACKEND=local` o migra el vector backend antes de activar Google embeddings.'
    )
  }

  if (vectorBackend === 'pinecone' && !process.env.PINECONE_API_KEY) {
    throw new Error('Falta `PINECONE_API_KEY` para usar Pinecone como vector backend.')
  }

  if (embeddingBackend === 'google' && !process.env.GOOGLE_AI_API_KEY) {
    throw new Error('Falta `GOOGLE_AI_API_KEY` para usar Google embeddings.')
  }
}
