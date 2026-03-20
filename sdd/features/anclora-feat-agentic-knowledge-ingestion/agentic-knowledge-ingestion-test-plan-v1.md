# Test Plan - ANCLORA-FEAT-004

Fecha: 2026-03-20
Estado: draft

## Objetivo

Validar que la ingesta agéntica produce activos de conocimiento trazables, reutilizables y seguros para el RAG.

## Cobertura

### 1. Creación de job

- Crear job desde prompt válido.
- Rechazar job sin prompt o sin contexto mínimo.
- Aislar `workspace_id` por sesión autenticada.

### 2. Normalización

- Persistir `knowledge_pack` con `summary`, `claims`, `evidence` y `topics`.
- Rechazar payloads sin estructura mínima.
- Mantener coherencia entre `evidenceRefs` y evidencias reales.

### 3. Persistencia

- Crear `knowledge_pack`, `knowledge_pack_claims` y `knowledge_pack_evidence`.
- Crear `knowledge_ingestion_jobs` con estados válidos.
- Confirmar que el pack se asocia al workspace correcto.

### 4. Chunking e indexación

- Generar chunks desde `normalized_payload`.
- Mantener metadata editorial por chunk.
- Confirmar inserción en la capa vectorial.

### 5. Retrieval

- Recuperar chunks de `knowledge_pack` relevantes para una query editorial.
- Priorizar resultados curados frente a fuente manual equivalente cuando aplique policy.

### 6. UX

- Lanzar un job desde la UI de RAG.
- Ver estado: `queued`, `running`, `completed`, `failed`.
- Mostrar evidencia y nivel de confianza del pack resultante.

## Validaciones automáticas

- `npm run lint`
- `npm run build`
- tests unitarios del normalizer
- tests de integración del endpoint/job

## Validaciones manuales

- Probar creación de dossier desde prompt real de negocio.
- Revisar que el pack resultante sea útil para generar un artículo de autoridad.
- Verificar que la UI no reintroduce scroll vertical global en `/dashboard/*`.
