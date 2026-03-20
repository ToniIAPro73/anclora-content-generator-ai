import { insertChunks as insertPgvectorChunks, vectorSearch as pgvectorSearch } from '@/lib/db/neon'
import { ensureRagBackendCompatibility, getPineconeIndexName, getVectorBackend } from './config'

type SearchParams = {
  embedding: number[]
  workspaceId: string
  limit?: number
  threshold?: number
}

type SearchResult = Array<{
  id: string
  content: string
  source_id: string
  metadata: Record<string, unknown>
  similarity: number
}>

type InsertParams = {
  workspaceId: string
  sourceId: string
  chunks: Array<{
    content: string
    chunkIndex: number
    embedding: number[]
    metadata?: Record<string, unknown>
    tokenCount?: number
  }>
}

async function pineconeSearch(params: SearchParams): Promise<SearchResult> {
  void params
  throw new Error(
    `Pinecone está preparado pero no activado en el flujo operativo actual. Configura el adaptador completo para el índice \`${getPineconeIndexName()}\` antes de cambiar \`RAG_VECTOR_BACKEND=pinecone\`.`
  )
}

async function pineconeInsert(params: InsertParams): Promise<number> {
  void params
  throw new Error(
    `Pinecone está preparado pero no activado en el flujo operativo actual. Mantén \`RAG_VECTOR_BACKEND=pgvector\` mientras Neon siga siendo el backend activo.`
  )
}

export async function searchVectorStore(params: SearchParams): Promise<SearchResult> {
  ensureRagBackendCompatibility()

  if (getVectorBackend() === 'pinecone') {
    return pineconeSearch(params)
  }

  return pgvectorSearch(params)
}

export async function insertVectorChunks(params: InsertParams) {
  ensureRagBackendCompatibility()

  if (getVectorBackend() === 'pinecone') {
    return pineconeInsert(params)
  }

  return insertPgvectorChunks(params)
}
