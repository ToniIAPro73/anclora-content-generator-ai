-- =====================================================
-- ANCLORA CONTENT GENERATOR AI - RLS POLICIES
-- Migration: 003_rls_policies.sql
-- Feature: ANCLORA-FEAT-DB-SCHEMA
-- Description: Row Level Security policies para aislamiento multi-tenant
-- Author: Agent A (Database Architect)
-- Date: 2026-03-19
-- =====================================================

-- =====================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tracking ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES: content_sources
-- =====================================================

-- Los usuarios solo pueden ver sus propias fuentes
CREATE POLICY "Users can view their own content sources"
  ON content_sources FOR SELECT
  USING (auth.uid() = workspace_id);

-- Los usuarios pueden insertar sus propias fuentes
CREATE POLICY "Users can insert their own content sources"
  ON content_sources FOR INSERT
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden actualizar sus propias fuentes
CREATE POLICY "Users can update their own content sources"
  ON content_sources FOR UPDATE
  USING (auth.uid() = workspace_id)
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden eliminar sus propias fuentes
CREATE POLICY "Users can delete their own content sources"
  ON content_sources FOR DELETE
  USING (auth.uid() = workspace_id);

-- =====================================================
-- POLICIES: knowledge_chunks
-- =====================================================

-- Los usuarios solo pueden ver sus propios chunks
CREATE POLICY "Users can view their own knowledge chunks"
  ON knowledge_chunks FOR SELECT
  USING (auth.uid() = workspace_id);

-- Los usuarios pueden insertar sus propios chunks
CREATE POLICY "Users can insert their own knowledge chunks"
  ON knowledge_chunks FOR INSERT
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden actualizar sus propios chunks
CREATE POLICY "Users can update their own knowledge chunks"
  ON knowledge_chunks FOR UPDATE
  USING (auth.uid() = workspace_id)
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden eliminar sus propios chunks
CREATE POLICY "Users can delete their own knowledge chunks"
  ON knowledge_chunks FOR DELETE
  USING (auth.uid() = workspace_id);

-- =====================================================
-- POLICIES: content_templates
-- =====================================================

-- Los usuarios solo pueden ver sus propios templates
CREATE POLICY "Users can view their own content templates"
  ON content_templates FOR SELECT
  USING (auth.uid() = workspace_id);

-- Los usuarios pueden insertar sus propios templates
CREATE POLICY "Users can insert their own content templates"
  ON content_templates FOR INSERT
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden actualizar sus propios templates
CREATE POLICY "Users can update their own content templates"
  ON content_templates FOR UPDATE
  USING (auth.uid() = workspace_id)
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden eliminar sus propios templates
CREATE POLICY "Users can delete their own content templates"
  ON content_templates FOR DELETE
  USING (auth.uid() = workspace_id);

-- =====================================================
-- POLICIES: generated_content
-- =====================================================

-- Los usuarios solo pueden ver su propio contenido generado
CREATE POLICY "Users can view their own generated content"
  ON generated_content FOR SELECT
  USING (auth.uid() = workspace_id);

-- Los usuarios pueden insertar su propio contenido
CREATE POLICY "Users can insert their own generated content"
  ON generated_content FOR INSERT
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden actualizar su propio contenido
CREATE POLICY "Users can update their own generated content"
  ON generated_content FOR UPDATE
  USING (auth.uid() = workspace_id)
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden eliminar su propio contenido
CREATE POLICY "Users can delete their own generated content"
  ON generated_content FOR DELETE
  USING (auth.uid() = workspace_id);

-- =====================================================
-- POLICIES: scheduled_posts
-- =====================================================

-- Los usuarios solo pueden ver sus propias publicaciones programadas
CREATE POLICY "Users can view their own scheduled posts"
  ON scheduled_posts FOR SELECT
  USING (auth.uid() = workspace_id);

-- Los usuarios pueden insertar sus propias publicaciones programadas
CREATE POLICY "Users can insert their own scheduled posts"
  ON scheduled_posts FOR INSERT
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden actualizar sus propias publicaciones programadas
CREATE POLICY "Users can update their own scheduled posts"
  ON scheduled_posts FOR UPDATE
  USING (auth.uid() = workspace_id)
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden eliminar sus propias publicaciones programadas
CREATE POLICY "Users can delete their own scheduled posts"
  ON scheduled_posts FOR DELETE
  USING (auth.uid() = workspace_id);

-- =====================================================
-- POLICIES: content_metrics
-- =====================================================

-- Los usuarios solo pueden ver sus propias métricas
CREATE POLICY "Users can view their own content metrics"
  ON content_metrics FOR SELECT
  USING (auth.uid() = workspace_id);

-- Los usuarios pueden insertar sus propias métricas
CREATE POLICY "Users can insert their own content metrics"
  ON content_metrics FOR INSERT
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden actualizar sus propias métricas
CREATE POLICY "Users can update their own content metrics"
  ON content_metrics FOR UPDATE
  USING (auth.uid() = workspace_id)
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden eliminar sus propias métricas
CREATE POLICY "Users can delete their own content metrics"
  ON content_metrics FOR DELETE
  USING (auth.uid() = workspace_id);

-- =====================================================
-- POLICIES: micro_zones
-- =====================================================

-- Los usuarios solo pueden ver sus propias micro-zonas
CREATE POLICY "Users can view their own micro zones"
  ON micro_zones FOR SELECT
  USING (auth.uid() = workspace_id);

-- Los usuarios pueden insertar sus propias micro-zonas
CREATE POLICY "Users can insert their own micro zones"
  ON micro_zones FOR INSERT
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden actualizar sus propias micro-zonas
CREATE POLICY "Users can update their own micro zones"
  ON micro_zones FOR UPDATE
  USING (auth.uid() = workspace_id)
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden eliminar sus propias micro-zonas
CREATE POLICY "Users can delete their own micro zones"
  ON micro_zones FOR DELETE
  USING (auth.uid() = workspace_id);

-- =====================================================
-- POLICIES: lead_tracking
-- =====================================================

-- Los usuarios solo pueden ver sus propios leads
CREATE POLICY "Users can view their own leads"
  ON lead_tracking FOR SELECT
  USING (auth.uid() = workspace_id);

-- Los usuarios pueden insertar sus propios leads
CREATE POLICY "Users can insert their own leads"
  ON lead_tracking FOR INSERT
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden actualizar sus propios leads
CREATE POLICY "Users can update their own leads"
  ON lead_tracking FOR UPDATE
  USING (auth.uid() = workspace_id)
  WITH CHECK (auth.uid() = workspace_id);

-- Los usuarios pueden eliminar sus propios leads
CREATE POLICY "Users can delete their own leads"
  ON lead_tracking FOR DELETE
  USING (auth.uid() = workspace_id);

-- =====================================================
-- GRANTS DE PERMISOS
-- =====================================================

-- Otorgar permisos a usuarios autenticados
GRANT ALL ON content_sources TO authenticated;
GRANT ALL ON knowledge_chunks TO authenticated;
GRANT ALL ON content_templates TO authenticated;
GRANT ALL ON generated_content TO authenticated;
GRANT ALL ON scheduled_posts TO authenticated;
GRANT ALL ON content_metrics TO authenticated;
GRANT ALL ON micro_zones TO authenticated;
GRANT ALL ON lead_tracking TO authenticated;

-- Otorgar permisos de ejecución de funciones
GRANT EXECUTE ON FUNCTION search_similar_chunks TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_engagement_rate TO authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column TO authenticated;

-- =====================================================
-- COMENTARIOS
-- =====================================================
COMMENT ON POLICY "Users can view their own content sources" ON content_sources IS 'RLS: Aislamiento multi-tenant por workspace_id';
COMMENT ON POLICY "Users can view their own knowledge chunks" ON knowledge_chunks IS 'RLS: Aislamiento multi-tenant por workspace_id';
COMMENT ON POLICY "Users can view their own content templates" ON content_templates IS 'RLS: Aislamiento multi-tenant por workspace_id';
COMMENT ON POLICY "Users can view their own generated content" ON generated_content IS 'RLS: Aislamiento multi-tenant por workspace_id';
COMMENT ON POLICY "Users can view their own scheduled posts" ON scheduled_posts IS 'RLS: Aislamiento multi-tenant por workspace_id';
COMMENT ON POLICY "Users can view their own content metrics" ON content_metrics IS 'RLS: Aislamiento multi-tenant por workspace_id';
COMMENT ON POLICY "Users can view their own micro zones" ON micro_zones IS 'RLS: Aislamiento multi-tenant por workspace_id';
COMMENT ON POLICY "Users can view their own leads" ON lead_tracking IS 'RLS: Aislamiento multi-tenant por workspace_id';
