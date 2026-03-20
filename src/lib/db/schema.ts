/**
 * ANCLORA CONTENT GENERATOR AI - Drizzle Schema
 * Migration to Neon PostgreSQL with Drizzle ORM
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { pgTable, uuid, text, timestamp, integer, jsonb, boolean, real, pgEnum, date, vector } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
export * from './auth-schema'

// =====================================================
// ENUMS
// =====================================================

export const sourceTypeEnum = pgEnum('source_type', ['document', 'url', 'rss', 'manual', 'api'])
export const sourceStatusEnum = pgEnum('source_status', ['pending', 'processing', 'completed', 'error'])
export const contentTypeEnum = pgEnum('content_type', ['blog', 'linkedin', 'instagram', 'facebook', 'newsletter', 'custom'])
export const contentStatusEnum = pgEnum('content_status', ['draft', 'approved', 'scheduled', 'published', 'archived'])
export const platformTypeEnum = pgEnum('platform_type', ['linkedin', 'facebook', 'instagram', 'blog', 'newsletter'])
export const postStatusEnum = pgEnum('post_status', ['pending', 'processing', 'published', 'failed', 'cancelled'])
export const leadScoreEnum = pgEnum('lead_score', ['A', 'B', 'C', 'D', 'F'])
export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'qualified', 'converted', 'lost'])

// =====================================================
// TABLES
// =====================================================

export const contentSources = pgTable('content_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  title: text('title').notNull(),
  sourceType: sourceTypeEnum('source_type').notNull(),
  sourceUrl: text('source_url'),
  content: text('content'),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),
  status: sourceStatusEnum('status').default('pending').notNull(),
  errorMessage: text('error_message'),
  chunksCount: integer('chunks_count').default(0).notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const knowledgeChunks = pgTable('knowledge_chunks', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  sourceId: uuid('source_id').notNull().references(() => contentSources.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  chunkIndex: integer('chunk_index').notNull(),
  embedding: vector('embedding', { dimensions: 384 }),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),
  tokenCount: integer('token_count'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const contentTemplates = pgTable('content_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  name: text('name').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),
  systemPrompt: text('system_prompt').notNull(),
  config: jsonb('config').default(sql`'{}'::jsonb`).notNull(),
  description: text('description'),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const generatedContent = pgTable('generated_content', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  templateId: uuid('template_id').references(() => contentTemplates.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),
  status: contentStatusEnum('status').default('draft').notNull(),
  generationMetadata: jsonb('generation_metadata').default(sql`'{}'::jsonb`).notNull(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  keywords: text('keywords').array(),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  platformPostIds: jsonb('platform_post_ids').default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const scheduledPosts = pgTable('scheduled_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  contentId: uuid('content_id').notNull().references(() => generatedContent.id, { onDelete: 'cascade' }),
  platform: platformTypeEnum('platform').notNull(),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),
  status: postStatusEnum('status').default('pending').notNull(),
  retryCount: integer('retry_count').default(0).notNull(),
  maxRetries: integer('max_retries').default(3).notNull(),
  lastError: text('last_error'),
  platformPostId: text('platform_post_id'),
  platformResponse: jsonb('platform_response'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const contentMetrics = pgTable('content_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  contentId: uuid('content_id').notNull().references(() => generatedContent.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  views: integer('views').default(0).notNull(),
  impressions: integer('impressions').default(0).notNull(),
  clicks: integer('clicks').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  shares: integer('shares').default(0).notNull(),
  saves: integer('saves').default(0).notNull(),
  leadsGenerated: integer('leads_generated').default(0).notNull(),
  conversions: integer('conversions').default(0).notNull(),
  engagementRate: real('engagement_rate'),
  snapshotDate: date('snapshot_date').defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const microZones = pgTable('micro_zones', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  municipality: text('municipality').notNull(),
  region: text('region').default('Southwest Mallorca').notNull(),
  marketData: jsonb('market_data').default(sql`'{}'::jsonb`).notNull(),
  description: text('description'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const leadTracking = pgTable('lead_tracking', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  contentId: uuid('content_id').references(() => generatedContent.id, { onDelete: 'set null' }),
  email: text('email'),
  phone: text('phone'),
  name: text('name'),
  sourcePlatform: text('source_platform'),
  sourceUrl: text('source_url'),
  utmParams: jsonb('utm_params'),
  score: leadScoreEnum('score'),
  status: leadStatusEnum('status').default('new').notNull(),
  notes: text('notes'),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// =====================================================
// TYPE EXPORTS (para inferir tipos de Drizzle)
// =====================================================

export type ContentSource = typeof contentSources.$inferSelect
export type ContentSourceInsert = typeof contentSources.$inferInsert

export type KnowledgeChunk = typeof knowledgeChunks.$inferSelect
export type KnowledgeChunkInsert = typeof knowledgeChunks.$inferInsert

export type ContentTemplate = typeof contentTemplates.$inferSelect
export type ContentTemplateInsert = typeof contentTemplates.$inferInsert

export type GeneratedContent = typeof generatedContent.$inferSelect
export type GeneratedContentInsert = typeof generatedContent.$inferInsert

export type ScheduledPost = typeof scheduledPosts.$inferSelect
export type ScheduledPostInsert = typeof scheduledPosts.$inferInsert

export type ContentMetrics = typeof contentMetrics.$inferSelect
export type ContentMetricsInsert = typeof contentMetrics.$inferInsert

export type MicroZone = typeof microZones.$inferSelect
export type MicroZoneInsert = typeof microZones.$inferInsert

export type LeadTracking = typeof leadTracking.$inferSelect
export type LeadTrackingInsert = typeof leadTracking.$inferInsert
