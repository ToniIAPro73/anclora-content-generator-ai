/**
 * ANCLORA CONTENT GENERATOR AI - Retrieval Tests
 * Feature: ANCLORA-FEAT-TESTS
 * Description: Unit tests for vector retrieval with Neon
 * Author: Agent D (Testing Specialist)
 * Date: 2026-03-19
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { retrieveSimilarChunks } from '../retrieval-neon'

// Mock the embeddings module
vi.mock('../embeddings', () => ({
  generateLocalEmbeddings: vi.fn(async () => new Array(384).fill(0.5)),
}))

// Mock the Neon client
vi.mock('@/lib/db/neon', () => ({
  vectorSearch: vi.fn(async (params: {embedding: number[], workspaceId: string, limit?: number, threshold?: number}) => {
    const allResults = [
      {
        id: '1',
        content: 'This is a test chunk about Next.js',
        source_id: 'source-1',
        metadata: { title: 'Next.js Guide' },
        similarity: 0.95,
      },
      {
        id: '2',
        content: 'React Server Components are great',
        source_id: 'source-2',
        metadata: { title: 'React Guide' },
        similarity: 0.87,
      },
      {
        id: '3',
        content: 'TypeScript provides type safety',
        source_id: 'source-3',
        metadata: { title: 'TypeScript Guide' },
        similarity: 0.75,
      },
    ]

    // Apply threshold filter
    const filtered = allResults.filter(r => r.similarity >= (params.threshold || 0))

    // Apply limit
    return filtered.slice(0, params.limit || 5)
  }),
}))

describe('retrieveSimilarChunks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should retrieve similar chunks for a query', async () => {
    const query = 'Next.js features'
    const options = {
      workspaceId: 'test-workspace',
      topK: 5,
      similarityThreshold: 0.7,
    }

    const result = await retrieveSimilarChunks(query, options)

    expect(result).toBeDefined()
    expect(result.chunks).toBeInstanceOf(Array)
    expect(result.query).toBe(query)
    expect(result.totalFound).toBeGreaterThan(0)
  })

  it('should limit results to topK', async () => {
    const query = 'Test query'
    const options = {
      workspaceId: 'test-workspace',
      topK: 2,
      similarityThreshold: 0.7,
    }

    const result = await retrieveSimilarChunks(query, options)

    expect(result.chunks.length).toBeLessThanOrEqual(2)
  })

  it('should filter by similarity threshold', async () => {
    const query = 'Test query'
    const options = {
      workspaceId: 'test-workspace',
      topK: 10,
      similarityThreshold: 0.9, // High threshold
    }

    const result = await retrieveSimilarChunks(query, options)

    // All returned chunks should meet the threshold
    result.chunks.forEach(chunk => {
      expect(chunk.similarity).toBeGreaterThanOrEqual(0.9)
    })
  })

  it('should return chunks sorted by similarity (descending)', async () => {
    const query = 'Test query'
    const options = {
      workspaceId: 'test-workspace',
      topK: 5,
      similarityThreshold: 0.5,
    }

    const result = await retrieveSimilarChunks(query, options)

    for (let i = 0; i < result.chunks.length - 1; i++) {
      expect(result.chunks[i].similarity).toBeGreaterThanOrEqual(
        result.chunks[i + 1].similarity
      )
    }
  })

  it('should include chunk metadata', async () => {
    const query = 'Test query'
    const options = {
      workspaceId: 'test-workspace',
      topK: 5,
      similarityThreshold: 0.7,
    }

    const result = await retrieveSimilarChunks(query, options)

    result.chunks.forEach(chunk => {
      expect(chunk).toHaveProperty('id')
      expect(chunk).toHaveProperty('content')
      expect(chunk).toHaveProperty('source_id')
      expect(chunk).toHaveProperty('metadata')
      expect(chunk).toHaveProperty('similarity')
    })
  })

  it('should measure execution time', async () => {
    const query = 'Test query'
    const options = {
      workspaceId: 'test-workspace',
      topK: 5,
      similarityThreshold: 0.7,
    }

    const result = await retrieveSimilarChunks(query, options)

    expect(result.executionTimeMs).toBeDefined()
    expect(typeof result.executionTimeMs).toBe('number')
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0)
  })

  it('should handle empty results', async () => {
    const { vectorSearch } = await import('@/lib/db/neon')
    vi.mocked(vectorSearch).mockResolvedValueOnce([])

    const query = 'Query with no results'
    const options = {
      workspaceId: 'test-workspace',
      topK: 5,
      similarityThreshold: 0.95,
    }

    const result = await retrieveSimilarChunks(query, options)

    expect(result.chunks).toEqual([])
    expect(result.totalFound).toBe(0)
  })

  it('should handle errors gracefully', async () => {
    const { vectorSearch } = await import('@/lib/db/neon')
    vi.mocked(vectorSearch).mockRejectedValueOnce(new Error('Database error'))

    const query = 'Test query'
    const options = {
      workspaceId: 'test-workspace',
      topK: 5,
      similarityThreshold: 0.7,
    }

    await expect(retrieveSimilarChunks(query, options)).rejects.toThrow()
  })

  it('should use workspace ID for filtering', async () => {
    const { vectorSearch } = await import('@/lib/db/neon')
    const mockVectorSearch = vi.mocked(vectorSearch)

    const query = 'Test query'
    const workspaceId = 'specific-workspace-123'
    const options = {
      workspaceId,
      topK: 5,
      similarityThreshold: 0.7,
    }

    await retrieveSimilarChunks(query, options)

    expect(mockVectorSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId,
      })
    )
  })
})
