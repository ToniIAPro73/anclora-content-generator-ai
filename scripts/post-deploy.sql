-- =====================================================
-- ANCLORA CONTENT GENERATOR AI
-- Post-Deployment SQL Script
-- =====================================================
-- Run this in Neon SQL Editor after deploying
-- =====================================================

-- Step 1: Verify pgvector extension
SELECT * FROM pg_extension WHERE extname = 'vector';
-- Should return 1 row

-- Step 2: Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
-- Should return 8 tables:
--   analytics_events
--   content_sources
--   content_templates
--   generated_content
--   knowledge_chunks
--   micro_zones
--   scheduled_posts
--   workspaces

-- Step 3: Verify seed data
SELECT COUNT(*) as template_count FROM content_templates;
-- Should be 2

SELECT COUNT(*) as microzone_count FROM micro_zones;
-- Should be 3

-- Step 4: Create your first workspace (REPLACE VALUES)
-- IMPORTANT: Get your user ID from Supabase Auth → Users
INSERT INTO workspaces (name, slug, owner_id, settings)
VALUES (
  'Production Workspace',           -- Workspace name
  'production',                      -- URL slug
  'YOUR_SUPABASE_USER_ID_HERE',     -- ⚠️ REPLACE THIS
  '{}'::jsonb                        -- Default settings
)
RETURNING id, name, slug;
-- Save the returned ID!

-- Step 5: Verify workspace created
SELECT id, name, slug, owner_id, created_at
FROM workspaces
ORDER BY created_at DESC
LIMIT 5;

-- Step 6: Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
-- Should see policies for each table

-- Step 7: Test vector search (with sample embedding)
-- This verifies pgvector is working
SELECT
  id,
  content,
  1 - (embedding <=> '[0.1,0.2,0.3]'::vector) as similarity
FROM knowledge_chunks
WHERE workspace_id = (SELECT id FROM workspaces LIMIT 1)
ORDER BY embedding <=> '[0.1,0.2,0.3]'::vector
LIMIT 1;
-- If no chunks yet, this will return empty (that's OK)

-- =====================================================
-- Optional: Create additional workspaces
-- =====================================================

-- Staging workspace
-- INSERT INTO workspaces (name, slug, owner_id, settings)
-- VALUES (
--   'Staging Workspace',
--   'staging',
--   'YOUR_SUPABASE_USER_ID_HERE',
--   '{"environment": "staging"}'::jsonb
-- );

-- Development workspace
-- INSERT INTO workspaces (name, slug, owner_id, settings)
-- VALUES (
--   'Development Workspace',
--   'dev',
--   'YOUR_SUPABASE_USER_ID_HERE',
--   '{"environment": "development"}'::jsonb
-- );

-- =====================================================
-- Troubleshooting Queries
-- =====================================================

-- Check database size
SELECT
  pg_size_pretty(pg_database_size(current_database())) as database_size;

-- Check table sizes
SELECT
  schemaname as schema,
  tablename as table,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check for any errors in recent queries
-- (Neon-specific, may vary)
-- Check Neon dashboard for query logs

-- =====================================================
-- Done!
-- =====================================================
-- ✅ Your database is ready for production
--
-- Next steps:
-- 1. Save the workspace ID from Step 4
-- 2. Test login at your Vercel URL
-- 3. Verify dashboard loads
-- 4. Test content generation (if AI keys configured)
