-- =====================================================
-- ANCLORA CONTENT GENERATOR AI - RAG SCHEMA
-- Migration: 002_rag_schema.sql
-- Feature: ANCLORA-FEAT-DB-SCHEMA
-- Description: Schema completo para RAG Engine, Content Generation y Metrics
-- Author: Agent A (Database Architect)
-- Date: 2026-03-19
-- =====================================================

-- Habilitar extensión pgvector para embeddings vectoriales
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- TABLA: content_sources
-- Fuentes de datos para ingesta en RAG (Idealista, IBESTAT, RSS, manual upload)
-- =====================================================
CREATE TABLE IF NOT EXISTS content_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('document', 'url', 'rss', 'manual', 'api')),
  source_url TEXT,
  content TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  error_message TEXT,

  -- Processing stats
  chunks_count INTEGER DEFAULT 0,
  processed_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para content_sources
CREATE INDEX idx_content_sources_workspace ON content_sources(workspace_id);
CREATE INDEX idx_content_sources_status ON content_sources(status);
CREATE INDEX idx_content_sources_type ON content_sources(source_type);
CREATE INDEX idx_content_sources_created ON content_sources(created_at DESC);

-- =====================================================
-- TABLA: knowledge_chunks
-- Fragmentos de texto con embeddings vectoriales para búsqueda semántica
-- =====================================================
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES content_sources(id) ON DELETE CASCADE,

  -- Contenido del chunk
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,

  -- Embedding vectorial (384 dimensiones para all-MiniLM-L6-v2)
  embedding vector(384),

  -- Metadata del chunk
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Token count
  token_count INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint: un source puede tener múltiples chunks con índices únicos
  UNIQUE(source_id, chunk_index)
);

-- Índices para knowledge_chunks
CREATE INDEX idx_knowledge_chunks_workspace ON knowledge_chunks(workspace_id);
CREATE INDEX idx_knowledge_chunks_source ON knowledge_chunks(source_id);

-- Índice HNSW para búsqueda vectorial eficiente (cosine distance)
CREATE INDEX idx_knowledge_chunks_embedding ON knowledge_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- =====================================================
-- TABLA: content_templates
-- Plantillas reutilizables por tipo de contenido con system prompts
-- =====================================================
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('blog', 'linkedin', 'instagram', 'facebook', 'newsletter', 'custom')),

  -- System prompt para el LLM
  system_prompt TEXT NOT NULL,

  -- Configuración del template
  config JSONB DEFAULT '{}'::jsonb,
  -- Ejemplo config: {"max_tokens": 2000, "temperature": 0.7, "model": "claude-3-5-sonnet"}

  -- Metadata
  description TEXT,
  is_default BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint: nombre único por workspace y tipo
  UNIQUE(workspace_id, name, content_type)
);

-- Índices para content_templates
CREATE INDEX idx_content_templates_workspace ON content_templates(workspace_id);
CREATE INDEX idx_content_templates_type ON content_templates(content_type);
CREATE INDEX idx_content_templates_default ON content_templates(is_default) WHERE is_default = true;

-- =====================================================
-- TABLA: generated_content
-- Contenido generado con metadata de generación y métricas
-- =====================================================
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES content_templates(id) ON DELETE SET NULL,

  -- Contenido
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('blog', 'linkedin', 'instagram', 'facebook', 'newsletter', 'custom')),

  -- Status y workflow
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'scheduled', 'published', 'archived')),

  -- Metadata de generación
  generation_metadata JSONB DEFAULT '{}'::jsonb,
  -- Ejemplo: {"model": "claude-3-5-sonnet", "tokens_used": 1500, "temperature": 0.7, "rag_sources": ["source_id_1", "source_id_2"]}

  -- SEO y metadata
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],

  -- Programación
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,

  -- Platform IDs (para tracking de publicaciones)
  platform_post_ids JSONB DEFAULT '{}'::jsonb,
  -- Ejemplo: {"linkedin": "urn:li:share:123456", "facebook": "post_id_789"}

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para generated_content
CREATE INDEX idx_generated_content_workspace ON generated_content(workspace_id);
CREATE INDEX idx_generated_content_template ON generated_content(template_id);
CREATE INDEX idx_generated_content_status ON generated_content(status);
CREATE INDEX idx_generated_content_type ON generated_content(content_type);
CREATE INDEX idx_generated_content_scheduled ON generated_content(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX idx_generated_content_created ON generated_content(created_at DESC);

-- Índice GIN para búsqueda full-text en contenido
CREATE INDEX idx_generated_content_search ON generated_content USING gin(to_tsvector('spanish', title || ' ' || content));

-- =====================================================
-- TABLA: scheduled_posts
-- Programación de publicaciones con reintentos
-- =====================================================
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES generated_content(id) ON DELETE CASCADE,

  -- Plataforma y configuración
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'blog', 'newsletter')),
  scheduled_for TIMESTAMPTZ NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'published', 'failed', 'cancelled')),

  -- Retry logic
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_error TEXT,

  -- Platform response
  platform_post_id TEXT,
  platform_response JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para scheduled_posts
CREATE INDEX idx_scheduled_posts_workspace ON scheduled_posts(workspace_id);
CREATE INDEX idx_scheduled_posts_content ON scheduled_posts(content_id);
CREATE INDEX idx_scheduled_posts_platform ON scheduled_posts(platform);
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX idx_scheduled_posts_scheduled ON scheduled_posts(scheduled_for);

-- =====================================================
-- TABLA: content_metrics
-- Métricas de rendimiento por contenido y plataforma
-- =====================================================
CREATE TABLE IF NOT EXISTS content_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES generated_content(id) ON DELETE CASCADE,

  platform TEXT NOT NULL,

  -- Métricas de engagement
  views INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,

  -- Métricas de conversión
  leads_generated INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,

  -- Engagement rate calculado
  engagement_rate DECIMAL(5,2),

  -- Snapshot date (para tracking histórico)
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint: una métrica por contenido, plataforma y fecha
  UNIQUE(content_id, platform, snapshot_date)
);

-- Índices para content_metrics
CREATE INDEX idx_content_metrics_workspace ON content_metrics(workspace_id);
CREATE INDEX idx_content_metrics_content ON content_metrics(content_id);
CREATE INDEX idx_content_metrics_platform ON content_metrics(platform);
CREATE INDEX idx_content_metrics_date ON content_metrics(snapshot_date DESC);

-- =====================================================
-- TABLA: micro_zones
-- Catálogo de micro-zonas del suroeste de Mallorca
-- =====================================================
CREATE TABLE IF NOT EXISTS micro_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificación
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  municipality TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'Southwest Mallorca',

  -- Datos de mercado
  market_data JSONB DEFAULT '{}'::jsonb,
  -- Ejemplo: {"avg_price_m2": 4500, "avg_property_price": 850000, "inventory": 45, "avg_days_market": 120}

  -- Metadata
  description TEXT,
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint: código único por workspace
  UNIQUE(workspace_id, code)
);

-- Índices para micro_zones
CREATE INDEX idx_micro_zones_workspace ON micro_zones(workspace_id);
CREATE INDEX idx_micro_zones_municipality ON micro_zones(municipality);
CREATE INDEX idx_micro_zones_code ON micro_zones(code);

-- =====================================================
-- TABLA: lead_tracking
-- Seguimiento de leads generados por contenido
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES generated_content(id) ON DELETE SET NULL,

  -- Lead information
  email TEXT,
  phone TEXT,
  name TEXT,

  -- Source tracking
  source_platform TEXT,
  source_url TEXT,
  utm_params JSONB,

  -- Lead scoring
  score TEXT CHECK (score IN ('A', 'B', 'C', 'D', 'F')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),

  -- Additional data
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para lead_tracking
CREATE INDEX idx_lead_tracking_workspace ON lead_tracking(workspace_id);
CREATE INDEX idx_lead_tracking_content ON lead_tracking(content_id);
CREATE INDEX idx_lead_tracking_status ON lead_tracking(status);
CREATE INDEX idx_lead_tracking_score ON lead_tracking(score);
CREATE INDEX idx_lead_tracking_created ON lead_tracking(created_at DESC);

-- =====================================================
-- FUNCIONES AUXILIARES
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_content_sources_updated_at BEFORE UPDATE ON content_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at BEFORE UPDATE ON generated_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at BEFORE UPDATE ON scheduled_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_metrics_updated_at BEFORE UPDATE ON content_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_micro_zones_updated_at BEFORE UPDATE ON micro_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_tracking_updated_at BEFORE UPDATE ON lead_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIÓN: search_similar_chunks
-- Búsqueda semántica de chunks similares usando pgvector
-- =====================================================
CREATE OR REPLACE FUNCTION search_similar_chunks(
  query_embedding vector(384),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  filter_workspace_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source_id UUID,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.content,
    kc.source_id,
    1 - (kc.embedding <=> query_embedding) AS similarity,
    kc.metadata
  FROM knowledge_chunks kc
  WHERE
    (filter_workspace_id IS NULL OR kc.workspace_id = filter_workspace_id)
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- =====================================================
-- FUNCIÓN: calculate_engagement_rate
-- Calcula el engagement rate automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_engagement_rate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.impressions > 0 THEN
    NEW.engagement_rate := ROUND(
      ((NEW.likes + NEW.comments + NEW.shares + NEW.saves)::DECIMAL / NEW.impressions::DECIMAL) * 100,
      2
    );
  ELSE
    NEW.engagement_rate := 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular engagement_rate automáticamente
CREATE TRIGGER calculate_content_metrics_engagement BEFORE INSERT OR UPDATE ON content_metrics
  FOR EACH ROW EXECUTE FUNCTION calculate_engagement_rate();

-- =====================================================
-- COMENTARIOS EN TABLAS (Documentación)
-- =====================================================
COMMENT ON TABLE content_sources IS 'Fuentes de datos para ingesta en RAG (Idealista, IBESTAT, RSS, manual)';
COMMENT ON TABLE knowledge_chunks IS 'Fragmentos de texto con embeddings vectoriales (384 dims) para búsqueda semántica';
COMMENT ON TABLE content_templates IS 'Plantillas reutilizables por tipo de contenido con system prompts para LLM';
COMMENT ON TABLE generated_content IS 'Contenido generado con estado, metadata de generación y métricas';
COMMENT ON TABLE scheduled_posts IS 'Programación de publicaciones automáticas con retry logic';
COMMENT ON TABLE content_metrics IS 'Métricas de rendimiento por contenido y plataforma con snapshots históricos';
COMMENT ON TABLE micro_zones IS 'Catálogo de micro-zonas del suroeste de Mallorca con datos de mercado';
COMMENT ON TABLE lead_tracking IS 'Seguimiento de leads generados por contenido con scoring automático';

COMMENT ON FUNCTION search_similar_chunks IS 'Búsqueda semántica de chunks similares usando cosine distance en pgvector';
COMMENT ON FUNCTION calculate_engagement_rate IS 'Calcula engagement rate automáticamente al insertar/actualizar métricas';
