# Scalable RAG Adapters Spec v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-006
Owner: Anclorabot

## Objetivo

Mantener `Neon + pgvector` como backend vectorial operativo y dejar el sistema preparado para una migracion futura a `Pinecone + Gemini embeddings` sin reescribir el pipeline core.

## Decision

- Backend activo actual: `pgvector`
- Backend de embeddings activo actual: `local`
- Escalado preparado mediante adaptadores y configuración:
  - `RAG_VECTOR_BACKEND`
  - `RAG_EMBEDDING_BACKEND`
  - `GOOGLE_AI_API_KEY`
  - `PINECONE_API_KEY`
  - `PINECONE_INDEX_NAME`

## Alcance

1. Crear una capa de configuración de RAG
2. Encapsular el acceso al vector store detrás de un facade
3. Encapsular embeddings detrás de un facade
4. Mantener `pgvector` como única opción soportada en runtime actual
5. Dejar documentación y `.env.example` listos para la evolución futura

## Guardarrailes

- No romper la compatibilidad con el schema actual de `knowledge_chunks`
- No activar Google embeddings sobre `pgvector` mientras la dimensión siga en 384
- No activar Pinecone por defecto

## Criterios de aceptación

- `lint` y `build` pasan
- El comportamiento actual del producto no cambia
- El repositorio documenta claramente cómo quedará el escalado futuro
