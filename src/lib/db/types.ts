/**
 * ANCLORA CONTENT GENERATOR AI - Database Types
 * Feature: ANCLORA-FEAT-DB-SCHEMA
 * Auto-generated TypeScript types from Supabase schema
 * Author: Agent A (Database Architect)
 * Date: 2026-03-19
 */

// =====================================================
// ENUMS
// =====================================================

export type SourceType = 'document' | 'url' | 'rss' | 'manual' | 'api'
export type SourceStatus = 'pending' | 'processing' | 'completed' | 'error'
export type ContentType = 'blog' | 'linkedin' | 'instagram' | 'facebook' | 'newsletter' | 'custom'
export type ContentStatus = 'draft' | 'approved' | 'scheduled' | 'published' | 'archived'
export type PlatformType = 'linkedin' | 'facebook' | 'instagram' | 'blog' | 'newsletter'
export type PostStatus = 'pending' | 'processing' | 'published' | 'failed' | 'cancelled'
export type LeadScore = 'A' | 'B' | 'C' | 'D' | 'F'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

// =====================================================
// TABLES
// =====================================================

export interface ContentSource {
  id: string
  workspace_id: string
  title: string
  source_type: SourceType
  source_url?: string
  content?: string
  metadata: Record<string, unknown>
  status: SourceStatus
  error_message?: string
  chunks_count: number
  processed_at?: string
  created_at: string
  updated_at: string
}

export interface KnowledgeChunk {
  id: string
  workspace_id: string
  source_id: string
  content: string
  chunk_index: number
  embedding: number[] // vector(384)
  metadata: Record<string, unknown>
  token_count?: number
  created_at: string
}

export interface ContentTemplate {
  id: string
  workspace_id: string
  name: string
  content_type: ContentType
  system_prompt: string
  config: TemplateConfig
  description?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface TemplateConfig {
  max_tokens?: number
  temperature?: number
  model?: string
  [key: string]: unknown
}

export interface GeneratedContent {
  id: string
  workspace_id: string
  template_id?: string
  title: string
  content: string
  content_type: ContentType
  status: ContentStatus
  generation_metadata: GenerationMetadata
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  scheduled_for?: string
  published_at?: string
  platform_post_ids: Record<string, string>
  created_at: string
  updated_at: string
}

export interface GenerationMetadata {
  model?: string
  tokens_used?: number
  temperature?: number
  rag_sources?: string[]
  [key: string]: unknown
}

export interface ScheduledPost {
  id: string
  workspace_id: string
  content_id: string
  platform: PlatformType
  scheduled_for: string
  status: PostStatus
  retry_count: number
  max_retries: number
  last_error?: string
  platform_post_id?: string
  platform_response?: Record<string, unknown>
  created_at: string
  published_at?: string
  updated_at: string
}

export interface ContentMetrics {
  id: string
  workspace_id: string
  content_id: string
  platform: string
  views: number
  impressions: number
  clicks: number
  likes: number
  comments: number
  shares: number
  saves: number
  leads_generated: number
  conversions: number
  engagement_rate?: number
  snapshot_date: string
  created_at: string
  updated_at: string
}

export interface MicroZone {
  id: string
  workspace_id: string
  name: string
  code: string
  municipality: string
  region: string
  market_data: MarketData
  description?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface MarketData {
  avg_price_m2?: number
  avg_property_price?: number
  inventory?: number
  avg_days_market?: number
  [key: string]: unknown
}

export interface LeadTracking {
  id: string
  workspace_id: string
  content_id?: string
  email?: string
  phone?: string
  name?: string
  source_platform?: string
  source_url?: string
  utm_params?: Record<string, unknown>
  score?: LeadScore
  status: LeadStatus
  notes?: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

// =====================================================
// INSERT/UPDATE TYPES (sin campos auto-generados)
// =====================================================

export type ContentSourceInsert = Omit<ContentSource, 'id' | 'created_at' | 'updated_at' | 'chunks_count' | 'processed_at'>
export type ContentSourceUpdate = Partial<ContentSourceInsert>

export type KnowledgeChunkInsert = Omit<KnowledgeChunk, 'id' | 'created_at'>
export type KnowledgeChunkUpdate = Partial<KnowledgeChunkInsert>

export type ContentTemplateInsert = Omit<ContentTemplate, 'id' | 'created_at' | 'updated_at'>
export type ContentTemplateUpdate = Partial<ContentTemplateInsert>

export type GeneratedContentInsert = Omit<GeneratedContent, 'id' | 'created_at' | 'updated_at'>
export type GeneratedContentUpdate = Partial<GeneratedContentInsert>

export type ScheduledPostInsert = Omit<ScheduledPost, 'id' | 'created_at' | 'updated_at' | 'published_at'>
export type ScheduledPostUpdate = Partial<ScheduledPostInsert>

export type ContentMetricsInsert = Omit<ContentMetrics, 'id' | 'created_at' | 'updated_at' | 'engagement_rate'>
export type ContentMetricsUpdate = Partial<ContentMetricsInsert>

export type MicroZoneInsert = Omit<MicroZone, 'id' | 'created_at' | 'updated_at'>
export type MicroZoneUpdate = Partial<MicroZoneInsert>

export type LeadTrackingInsert = Omit<LeadTracking, 'id' | 'created_at' | 'updated_at'>
export type LeadTrackingUpdate = Partial<LeadTrackingInsert>

// =====================================================
// FUNCTION RETURN TYPES
// =====================================================

export interface SimilarChunk {
  id: string
  content: string
  source_id: string
  similarity: number
  metadata: Record<string, unknown>
}

// =====================================================
// DATABASE TYPE (para Supabase Client)
// =====================================================

export interface Database {
  public: {
    Tables: {
      content_sources: {
        Row: ContentSource
        Insert: ContentSourceInsert
        Update: ContentSourceUpdate
      }
      knowledge_chunks: {
        Row: KnowledgeChunk
        Insert: KnowledgeChunkInsert
        Update: KnowledgeChunkUpdate
      }
      content_templates: {
        Row: ContentTemplate
        Insert: ContentTemplateInsert
        Update: ContentTemplateUpdate
      }
      generated_content: {
        Row: GeneratedContent
        Insert: GeneratedContentInsert
        Update: GeneratedContentUpdate
      }
      scheduled_posts: {
        Row: ScheduledPost
        Insert: ScheduledPostInsert
        Update: ScheduledPostUpdate
      }
      content_metrics: {
        Row: ContentMetrics
        Insert: ContentMetricsInsert
        Update: ContentMetricsUpdate
      }
      micro_zones: {
        Row: MicroZone
        Insert: MicroZoneInsert
        Update: MicroZoneUpdate
      }
      lead_tracking: {
        Row: LeadTracking
        Insert: LeadTrackingInsert
        Update: LeadTrackingUpdate
      }
    }
    Functions: {
      search_similar_chunks: {
        Args: {
          query_embedding: number[]
          match_threshold?: number
          match_count?: number
          filter_workspace_id?: string
        }
        Returns: SimilarChunk[]
      }
    }
  }
}
