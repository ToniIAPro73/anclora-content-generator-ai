import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  ensureRagBackendCompatibility,
  getEmbeddingBackend,
  getGoogleEmbeddingModel,
  getGoogleGenerationModel,
  getPineconeIndexName,
  getRagSimilarityThreshold,
  getRagTopK,
  getVectorBackend,
} from '../config'

const envSnapshot = { ...process.env }

afterEach(() => {
  process.env = { ...envSnapshot }
  vi.restoreAllMocks()
})

describe('rag config', () => {
  it('uses pgvector and local embeddings by default', () => {
    delete process.env.RAG_VECTOR_BACKEND
    delete process.env.RAG_EMBEDDING_BACKEND

    expect(getVectorBackend()).toBe('pgvector')
    expect(getEmbeddingBackend()).toBe('local')
  })

  it('reads rag thresholds and falls back safely', () => {
    process.env.RAG_TOP_K = '12'
    process.env.RAG_SIMILARITY_THRESHOLD = '0.55'

    expect(getRagTopK()).toBe(12)
    expect(getRagSimilarityThreshold()).toBe(0.55)

    process.env.RAG_TOP_K = '-1'
    process.env.RAG_SIMILARITY_THRESHOLD = '9'

    expect(getRagTopK()).toBe(5)
    expect(getRagSimilarityThreshold()).toBe(0.7)
  })

  it('returns the configured google and pinecone defaults', () => {
    delete process.env.GEMINI_EMBEDDING_MODEL
    delete process.env.GEMINI_GENERATION_MODEL
    delete process.env.PINECONE_INDEX_NAME

    expect(getGoogleEmbeddingModel()).toBe('gemini-embedding-001')
    expect(getGoogleGenerationModel()).toBe('gemini-2.0-flash')
    expect(getPineconeIndexName()).toBe('gemini-rag')
  })

  it('blocks incompatible pgvector + google embeddings setup', () => {
    process.env.RAG_VECTOR_BACKEND = 'pgvector'
    process.env.RAG_EMBEDDING_BACKEND = 'google'

    expect(() => ensureRagBackendCompatibility()).toThrow(/no es compatible/i)
  })

  it('requires credentials for pinecone and google when activated', () => {
    process.env.RAG_VECTOR_BACKEND = 'pinecone'
    process.env.RAG_EMBEDDING_BACKEND = 'local'
    delete process.env.PINECONE_API_KEY

    expect(() => ensureRagBackendCompatibility()).toThrow(/PINECONE_API_KEY/)

    process.env.PINECONE_API_KEY = 'test'
    process.env.RAG_EMBEDDING_BACKEND = 'google'
    delete process.env.GOOGLE_AI_API_KEY

    expect(() => ensureRagBackendCompatibility()).toThrow(/GOOGLE_AI_API_KEY/)
  })
})
