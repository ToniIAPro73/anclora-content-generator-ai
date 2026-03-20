/**
 * ANCLORA CONTENT GENERATOR AI - Drizzle Schema
 * Migration to Neon PostgreSQL with Drizzle ORM
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { pgTable, uuid, text, timestamp, integer, jsonb, boolean, real, pgEnum, date, vector } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
export * from './auth-schema'

// =====================================================
// ENUMS
// =====================================================

export const sourceTypeEnum = pgEnum('source_type', ['document', 'url', 'rss', 'manual', 'api', 'agentic_research_pack', 'notebooklm_notebook', 'curated_brief'])
export const sourceCategoryEnum = pgEnum('source_category', ['market', 'regulation', 'lifestyle', 'infrastructure', 'editorial', 'general'])
export const sourceStatusEnum = pgEnum('source_status', ['pending', 'processing', 'completed', 'error'])
export const contentTypeEnum = pgEnum('content_type', ['blog', 'linkedin', 'instagram', 'facebook', 'newsletter', 'custom'])
export const contentStatusEnum = pgEnum('content_status', ['draft', 'review', 'approved', 'scheduled', 'published', 'archived'])
export const platformTypeEnum = pgEnum('platform_type', ['linkedin', 'facebook', 'instagram', 'blog', 'newsletter'])
export const postStatusEnum = pgEnum('post_status', ['pending', 'processing', 'published', 'failed', 'cancelled'])
export const leadScoreEnum = pgEnum('lead_score', ['A', 'B', 'C', 'D', 'F'])
export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'qualified', 'converted', 'lost'])
export const knowledgePackTypeEnum = pgEnum('knowledge_pack_type', ['agentic_research_pack', 'notebooklm_notebook', 'curated_brief'])
export const knowledgePackStatusEnum = pgEnum('knowledge_pack_status', ['queued', 'processing', 'completed', 'failed'])
export const knowledgeClaimTypeEnum = pgEnum('knowledge_claim_type', ['market_signal', 'thesis', 'recommendation', 'risk'])
export const knowledgeSupportLevelEnum = pgEnum('knowledge_support_level', ['high', 'medium', 'low'])
export const knowledgeEvidenceTypeEnum = pgEnum('knowledge_evidence_type', ['prompt', 'notebook', 'manual', 'derived', 'workflow'])
export const knowledgeIngestionTriggerEnum = pgEnum('knowledge_ingestion_trigger', ['prompt', 'notebooklm', 'manual'])
export const contentOpportunityStatusEnum = pgEnum('content_opportunity_status', ['new', 'accepted', 'converted', 'dismissed'])

// =====================================================
// TABLES
// =====================================================

export const contentSources = pgTable('content_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  title: text('title').notNull(),
  sourceType: sourceTypeEnum('source_type').notNull(),
  sourceCategory: sourceCategoryEnum('source_category').default('general').notNull(),
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

export const knowledgePacks = pgTable('knowledge_packs', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  sourceId: uuid('source_id').references(() => contentSources.id, { onDelete: 'set null' }),
  sourceType: sourceTypeEnum('source_type').notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  status: knowledgePackStatusEnum('status').default('queued').notNull(),
  packType: knowledgePackTypeEnum('pack_type').notNull(),
  inputPrompt: text('input_prompt'),
  createdByUserId: text('created_by_user_id').notNull(),
  freshnessDate: date('freshness_date'),
  confidenceScore: real('confidence_score'),
  tags: jsonb('tags').default(sql`'[]'::jsonb`).notNull(),
  topics: jsonb('topics').default(sql`'[]'::jsonb`).notNull(),
  entities: jsonb('entities').default(sql`'[]'::jsonb`).notNull(),
  recommendedUses: jsonb('recommended_uses').default(sql`'[]'::jsonb`).notNull(),
  rawPayload: jsonb('raw_payload').default(sql`'{}'::jsonb`).notNull(),
  normalizedPayload: jsonb('normalized_payload').default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const knowledgePackEvidence = pgTable('knowledge_pack_evidence', {
  id: uuid('id').defaultRandom().primaryKey(),
  knowledgePackId: uuid('knowledge_pack_id').notNull().references(() => knowledgePacks.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  url: text('url'),
  sourceLabel: text('source_label').notNull(),
  excerpt: text('excerpt').notNull(),
  evidenceType: knowledgeEvidenceTypeEnum('evidence_type').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  confidenceScore: real('confidence_score'),
  position: integer('position').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const knowledgePackClaims = pgTable('knowledge_pack_claims', {
  id: uuid('id').defaultRandom().primaryKey(),
  knowledgePackId: uuid('knowledge_pack_id').notNull().references(() => knowledgePacks.id, { onDelete: 'cascade' }),
  claimType: knowledgeClaimTypeEnum('claim_type').notNull(),
  statement: text('statement').notNull(),
  supportLevel: knowledgeSupportLevelEnum('support_level').notNull(),
  evidenceRefs: jsonb('evidence_refs').default(sql`'[]'::jsonb`).notNull(),
  position: integer('position').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const knowledgeIngestionJobs = pgTable('knowledge_ingestion_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  knowledgePackId: uuid('knowledge_pack_id').references(() => knowledgePacks.id, { onDelete: 'set null' }),
  triggerType: knowledgeIngestionTriggerEnum('trigger_type').notNull(),
  status: knowledgePackStatusEnum('status').default('queued').notNull(),
  inputPayload: jsonb('input_payload').default(sql`'{}'::jsonb`).notNull(),
  orchestrator: text('orchestrator').default('anclorabot-core').notNull(),
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const contentOpportunities = pgTable('content_opportunities', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  sourceId: uuid('source_id').references(() => contentSources.id, { onDelete: 'set null' }),
  knowledgePackId: uuid('knowledge_pack_id').references(() => knowledgePacks.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  angle: text('angle').notNull(),
  rationale: text('rationale').notNull(),
  audience: text('audience'),
  recommendedFormat: text('recommended_format').notNull(),
  confidenceScore: real('confidence_score'),
  status: contentOpportunityStatusEnum('status').default('new').notNull(),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
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

export const workspaceSettings = pgTable('workspace_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull().unique(),
  workspaceName: text('workspace_name').notNull(),
  workspaceDescription: text('workspace_description'),
  editorialSystemPrompt: text('editorial_system_prompt').notNull(),
  defaultProvider: text('default_provider').default('anthropic').notNull(),
  defaultModel: text('default_model').default('claude-sonnet-4-6').notNull(),
  defaultTemperature: real('default_temperature').default(0.7).notNull(),
  defaultTopP: real('default_top_p').default(0.9).notNull(),
  ragChunkSize: integer('rag_chunk_size').default(512).notNull(),
  ragTopK: integer('rag_top_k').default(5).notNull(),
  similarityThreshold: real('similarity_threshold').default(0.7).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const generatedContent = pgTable('generated_content', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull(),
  templateId: uuid('template_id').references(() => contentTemplates.id, { onDelete: 'set null' }),
  opportunityId: uuid('opportunity_id').references(() => contentOpportunities.id, { onDelete: 'set null' }),
  microZoneId: uuid('micro_zone_id').references(() => microZones.id, { onDelete: 'set null' }),
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

export const microZonesRelations = relations(microZones, ({ many }) => ({
  generatedContent: many(generatedContent),
}))

export const generatedContentRelations = relations(generatedContent, ({ one }) => ({
  microZone: one(microZones, {
    fields: [generatedContent.microZoneId],
    references: [microZones.id],
  }),
  template: one(contentTemplates, {
    fields: [generatedContent.templateId],
    references: [contentTemplates.id],
  }),
}))

// =====================================================
// TYPE EXPORTS (para inferir tipos de Drizzle)
// =====================================================

export type ContentSource = typeof contentSources.$inferSelect
export type ContentSourceInsert = typeof contentSources.$inferInsert

export type KnowledgeChunk = typeof knowledgeChunks.$inferSelect
export type KnowledgeChunkInsert = typeof knowledgeChunks.$inferInsert

export type KnowledgePack = typeof knowledgePacks.$inferSelect
export type KnowledgePackInsert = typeof knowledgePacks.$inferInsert

export type KnowledgePackEvidence = typeof knowledgePackEvidence.$inferSelect
export type KnowledgePackEvidenceInsert = typeof knowledgePackEvidence.$inferInsert

export type KnowledgePackClaim = typeof knowledgePackClaims.$inferSelect
export type KnowledgePackClaimInsert = typeof knowledgePackClaims.$inferInsert

export type KnowledgeIngestionJob = typeof knowledgeIngestionJobs.$inferSelect
export type KnowledgeIngestionJobInsert = typeof knowledgeIngestionJobs.$inferInsert

export type ContentOpportunity = typeof contentOpportunities.$inferSelect
export type ContentOpportunityInsert = typeof contentOpportunities.$inferInsert

export type ContentTemplate = typeof contentTemplates.$inferSelect
export type ContentTemplateInsert = typeof contentTemplates.$inferInsert

export type WorkspaceSettings = typeof workspaceSettings.$inferSelect
export type WorkspaceSettingsInsert = typeof workspaceSettings.$inferInsert

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
