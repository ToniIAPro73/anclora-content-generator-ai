-- Setup script for Neon database
-- Run this in Neon SQL Editor before pushing schema

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify pgvector is installed
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Show database info
SELECT current_database(), current_user, version();
