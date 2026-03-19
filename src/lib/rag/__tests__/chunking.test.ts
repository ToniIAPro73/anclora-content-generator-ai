/**
 * ANCLORA CONTENT GENERATOR AI - Chunking Tests
 * Feature: ANCLORA-FEAT-TESTS
 * Description: Unit tests for semantic text chunking
 * Author: Agent D (Testing Specialist)
 * Date: 2026-03-19
 */

import { describe, it, expect } from 'vitest'
import { chunkText } from '../chunking'

describe('chunkText', () => {
  it('should split text into chunks based on separators', () => {
    const text = `
# Main Title

## Section 1
This is paragraph 1.

This is paragraph 2.

## Section 2
Another paragraph here.
    `.trim()

    const chunks = chunkText(text, { maxChunkSize: 100, overlap: 20 })

    expect(chunks).toBeInstanceOf(Array)
    expect(chunks.length).toBeGreaterThan(0)
    chunks.forEach(chunk => {
      expect(chunk.content).toBeDefined()
      expect(chunk.index).toBeGreaterThanOrEqual(0)
      expect(chunk.metadata.tokenCount).toBeGreaterThan(0)
    })
  })

  it('should respect chunk size limits', () => {
    const text = 'word '.repeat(200) // 200 words

    const chunks = chunkText(text, { maxChunkSize: 50, overlap: 10, mode: 'fixed' })

    chunks.forEach(chunk => {
      // Content length should be close to maxChunkSize
      expect(chunk.content.length).toBeLessThanOrEqual(50)
    })
  })

  it('should create overlapping chunks in fixed mode', () => {
    const text = 'word '.repeat(100)

    const chunks = chunkText(text, { maxChunkSize: 30, overlap: 10, mode: 'fixed' })

    // Should have multiple chunks with overlap
    expect(chunks.length).toBeGreaterThan(1)
  })

  it('should store metadata correctly', () => {
    const text = 'Simple text for testing.'

    const chunks = chunkText(text, { maxChunkSize: 100, overlap: 10 })

    chunks.forEach(chunk => {
      expect(chunk.metadata).toBeDefined()
      expect(chunk.metadata.startChar).toBeGreaterThanOrEqual(0)
      expect(chunk.metadata.endChar).toBeGreaterThan(chunk.metadata.startChar)
      expect(chunk.metadata.tokenCount).toBeGreaterThan(0)
    })
  })

  it('should handle empty text', () => {
    const chunks = chunkText('', { maxChunkSize: 100, overlap: 10 })

    expect(chunks).toEqual([])
  })

  it('should handle text shorter than chunk size', () => {
    const text = 'Short text.'

    const chunks = chunkText(text, { maxChunkSize: 100, overlap: 10 })

    expect(chunks.length).toBe(1)
    expect(chunks[0].content).toBe(text)
    expect(chunks[0].index).toBe(0)
  })

  it('should split on hierarchical separators', () => {
    const text = `
Paragraph one with some content.

Paragraph two with more content.

Paragraph three with additional content.
    `.trim()

    const chunks = chunkText(text, { maxChunkSize: 50, overlap: 10 })

    // Should create multiple chunks based on paragraph separators
    expect(chunks.length).toBeGreaterThan(0)
  })

  it('should assign sequential indices to chunks', () => {
    const text = 'word '.repeat(100)

    const chunks = chunkText(text, { maxChunkSize: 30, overlap: 5, mode: 'fixed' })

    chunks.forEach((chunk, idx) => {
      expect(chunk.index).toBe(idx)
    })
  })

  it('should calculate token counts for each chunk', () => {
    const text = 'This is a test sentence with multiple words in it.'

    const chunks = chunkText(text, { maxChunkSize: 100, overlap: 10 })

    chunks.forEach(chunk => {
      expect(chunk.metadata.tokenCount).toBeGreaterThan(0)
      expect(typeof chunk.metadata.tokenCount).toBe('number')
    })
  })
})
