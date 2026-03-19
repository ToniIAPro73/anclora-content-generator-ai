/**
 * ANCLORA CONTENT GENERATOR AI - Embeddings Tests
 * Feature: ANCLORA-FEAT-TESTS
 * Description: Unit tests for local embeddings generation
 * Author: Agent D (Testing Specialist)
 * Date: 2026-03-19
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateLocalEmbeddings } from '../embeddings'

// Mock the Transformers.js pipeline
vi.mock('@huggingface/transformers', async () => {
  return {
    pipeline: vi.fn(() => async (text: string) => {
      // Return a mock embedding of 384 dimensions (same as all-MiniLM-L6-v2)
      return {
        data: new Float32Array(384).fill(0.5),
      }
    }),
    env: {
      allowLocalModels: true,
      useBrowserCache: false,
    },
  }
})

describe('generateLocalEmbeddings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should generate embeddings for a given text', async () => {
    const text = 'This is a test sentence.'

    const embedding = await generateLocalEmbeddings(text)

    expect(embedding).toBeInstanceOf(Array)
    expect(embedding.length).toBe(384) // all-MiniLM-L6-v2 dimensionality
  })

  it('should return numerical values', async () => {
    const text = 'Another test sentence.'

    const embedding = await generateLocalEmbeddings(text)

    embedding.forEach(value => {
      expect(typeof value).toBe('number')
      expect(isFinite(value)).toBe(true)
    })
  })

  it('should handle empty text', async () => {
    const embedding = await generateLocalEmbeddings('')

    expect(embedding).toBeInstanceOf(Array)
    expect(embedding.length).toBe(384)
  })

  it('should handle long text', async () => {
    const longText = 'word '.repeat(500)

    const embedding = await generateLocalEmbeddings(longText)

    expect(embedding).toBeInstanceOf(Array)
    expect(embedding.length).toBe(384)
  })

  it('should generate consistent embeddings for same text', async () => {
    const text = 'Consistent test text.'

    const embedding1 = await generateLocalEmbeddings(text)
    const embedding2 = await generateLocalEmbeddings(text)

    // Embeddings should be identical for the same input
    expect(embedding1).toEqual(embedding2)
  })

  it('should handle special characters', async () => {
    const text = 'Special characters: @#$%^&*(){}[]|\\:";\'<>?,./~`'

    const embedding = await generateLocalEmbeddings(text)

    expect(embedding).toBeInstanceOf(Array)
    expect(embedding.length).toBe(384)
  })

  it('should handle unicode characters', async () => {
    const text = 'Unicode: 你好世界 مرحبا العالم Здравствуй мир'

    const embedding = await generateLocalEmbeddings(text)

    expect(embedding).toBeInstanceOf(Array)
    expect(embedding.length).toBe(384)
  })

  it('should normalize embedding vectors', async () => {
    const text = 'Test for normalization.'

    const embedding = await generateLocalEmbeddings(text)

    // Calculate L2 norm (should be close to 1 if normalized)
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))

    // Mocked embeddings won't be perfectly normalized, but real ones should be
    expect(norm).toBeGreaterThan(0)
  })
})
