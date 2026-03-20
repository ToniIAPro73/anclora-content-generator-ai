# ANCLORA-FEAT-004 - Agentic Knowledge Ingestion

Fecha: 2026-03-20
Estado: in-progress

## Objetivo

Extender la Knowledge Base de Anclora para que no dependa solo de ingesta manual de texto o fuentes crudas, sino que pueda incorporar paquetes de conocimiento generados por workflows agénticos capaces de investigar, sintetizar, verificar y estructurar contexto reusable para el motor RAG.

## Motivacion

- El RAG actual admite fuentes, pero no distingue bien entre contenido crudo y conocimiento curado.
- Para Anclora importa más la calidad editorial y la trazabilidad del contexto que la mera cantidad de chunks.
- Un workflow agéntico permite transformar un prompt, una investigación web o un cuaderno de NotebookLM en un activo de conocimiento de alto valor.
- El producto gana una capa estratégica: no solo "almacena documentos", también produce inteligencia accionable lista para reutilización editorial.

## Resultado esperado

La app debe poder ingerir:

1. `manual_source`
   Texto, URL o documento aportado por el usuario.
2. `agentic_research_pack`
   Paquete de conocimiento producido por un workflow agéntico a partir de un prompt.
3. `notebooklm_notebook`
   Material exportado o transformado desde un cuaderno de NotebookLM.
4. `curated_brief`
   Dossier breve preparado por un agente especializado para un caso de uso editorial concreto.

## Principio de producto

El RAG de Anclora no debe indexar texto indiscriminado.

Debe indexar conocimiento con:

- estructura
- metadata editorial
- trazabilidad de evidencias
- utilidad concreta para contenido de autoridad

## Problema actual

- La Knowledge Base mezcla fuentes sin una jerarquía clara de calidad.
- No existe un contrato fuerte para distinguir entre evidencia, resumen, tesis y notas auxiliares.
- La UI actual de RAG está orientada a CRUD de fuentes, no a orquestar conocimiento curado.
- No hay pipeline intermedio entre "prompt" y "chunk vectorizado".

## Vision funcional

La feature introduce un nuevo pipeline:

1. `request`
   El usuario inicia una ingesta desde prompt, desde NotebookLM o desde otra fuente estructurada.
2. `agentic orchestration`
   Un workflow usa skills, MCP y herramientas de investigación para recopilar y depurar información.
3. `normalization`
   El resultado se transforma a un schema interno común.
4. `knowledge pack`
   Se persiste un artefacto curado y trazable.
5. `chunking + enrichment`
   Se generan chunks optimizados para retrieval, manteniendo metadata editorial.
6. `vector indexing`
   Los chunks se indexan en pgvector.
7. `retrieval`
   El motor puede priorizar fuentes curadas frente a fuentes crudas.

## Entidades nuevas propuestas

### 1. `knowledge_packs`

Representa un activo de conocimiento ya curado y listo para trocearse o reutilizarse.

Campos iniciales propuestos:

- `id`
- `workspace_id`
- `source_id` nullable
- `source_type`
- `title`
- `summary`
- `status`
- `pack_type`
- `input_prompt` nullable
- `created_by_user_id`
- `created_at`
- `updated_at`
- `freshness_date` nullable
- `confidence_score` nullable
- `tags` jsonb
- `topics` jsonb
- `entities` jsonb
- `recommended_uses` jsonb
- `raw_payload` jsonb
- `normalized_payload` jsonb

### 2. `knowledge_pack_evidence`

Representa trazas de soporte verificable para el pack.

Campos:

- `id`
- `knowledge_pack_id`
- `title`
- `url` nullable
- `source_label`
- `excerpt`
- `evidence_type`
- `published_at` nullable
- `confidence_score` nullable
- `position`

### 3. `knowledge_pack_claims`

Permite separar afirmaciones, tesis y recomendaciones.

Campos:

- `id`
- `knowledge_pack_id`
- `claim_type`
- `statement`
- `support_level`
- `evidence_refs` jsonb
- `position`

### 4. `knowledge_ingestion_jobs`

Persistencia del pipeline agéntico.

Campos:

- `id`
- `workspace_id`
- `trigger_type`
- `status`
- `input_payload` jsonb
- `orchestrator`
- `error_message` nullable
- `started_at` nullable
- `finished_at` nullable
- `created_at`

## Contrato del `knowledge pack`

Todo workflow agéntico debe producir un objeto normalizado con esta forma conceptual:

```json
{
  "title": "string",
  "summary": "string",
  "topics": ["string"],
  "entities": ["string"],
  "claims": [
    {
      "type": "market_signal | thesis | recommendation | risk",
      "statement": "string",
      "supportLevel": "high | medium | low",
      "evidenceRefs": ["ev_1", "ev_2"]
    }
  ],
  "evidence": [
    {
      "id": "ev_1",
      "title": "string",
      "sourceLabel": "string",
      "url": "string",
      "excerpt": "string",
      "publishedAt": "ISO date"
    }
  ],
  "recommendedUses": [
    "blog_post",
    "linkedin_post",
    "newsletter_brief"
  ],
  "freshnessDate": "ISO date",
  "confidenceScore": 0.0
}
```

## Modos de ingesta

### A. Prompt -> Agentic Research Pack

Input:

- prompt de investigación
- objetivo editorial
- audiencia
- nivel de profundidad

Output:

- `knowledge_pack` listo para indexación

Este es el primer modo recomendado para implementar.

### B. NotebookLM -> Knowledge Pack

Input:

- export o payload transformado del cuaderno
- opcionalmente resumen, notas o Q&A del cuaderno

Output:

- `knowledge_pack` trazable con las fuentes originales

### C. Curated Brief

Input:

- prompt corto
- contexto de negocio
- enfoque de contenido

Output:

- mini-dossier priorizado para generación rápida

## Orquestación agéntica propuesta

El workflow debe permitir agentes con responsabilidades separadas:

1. `Research Agent`
   Investiga y recoge material base.
2. `Verification Agent`
   Filtra ruido, detecta afirmaciones débiles y mejora trazabilidad.
3. `Normalization Agent`
   Convierte el resultado al contrato `knowledge_pack`.
4. `Indexing Agent`
   Ejecuta chunking, embeddings e inserción.

## Integraciones previstas

- Skills locales de Codex para workflows especializados.
- MCP para navegación, extracción o conectores de investigación.
- OpenClaw como agente externo/orquestador, si se valida como runtime operativo estable.

## Decisiones

1. La ingesta agéntica será una capa por encima del RAG, no un reemplazo del RAG.
2. `knowledge_pack` será el artefacto intermedio obligatorio.
3. Se prioriza `prompt -> agentic research pack` como primera entrega.
4. `NotebookLM` se trata como adaptador de entrada, no como fuente de verdad del sistema.
5. Los chunks para pgvector se generarán desde el payload normalizado, no desde texto crudo siempre que exista `knowledge_pack`.

## UX esperada

La pantalla RAG deberá evolucionar desde "CRUD de fuentes" hacia tres caminos claros:

1. `Añadir fuente`
2. `Crear dossier con IA`
3. `Importar notebook`

Cada flujo debe dejar visible:

- estado del job
- nivel de confianza
- trazabilidad de evidencias
- usos recomendados del pack

## Riesgos

- Riesgo de indexar contenido sintético sin suficiente soporte.
- Riesgo de acoplar demasiado el pipeline a un único agente externo.
- Riesgo de complejidad UX si se mezclan demasiados modos de ingesta en una sola vista.
- Riesgo de costes o latencia si el workflow investiga demasiado antes de normalizar.

## Mitigaciones

- El schema obliga a separar `claims` y `evidence`.
- El motor puede marcar `confidence_score` y `support_level`.
- Se mantiene la ingesta manual como fallback simple.
- La primera iteración se limita a un solo modo agéntico principal.

## Fases de implementación

### Fase 1

- Spec cerrada
- Schema Drizzle para `knowledge_packs` y jobs
- Endpoint de creación de job desde prompt

### Fase 2

- Worker/orquestador agéntico
- Normalización a `knowledge_pack`
- Persistencia y observabilidad básica

### Fase 3

- Chunking desde `knowledge_pack`
- Indexación pgvector
- Retrieval policy priorizando conocimiento curado

### Fase 4

- UI dedicada en `/dashboard/rag`
- Importador de NotebookLM
- Skills especializadas por tipo de dossier

## Criterio de salida de la feature

- Existe un flujo usable `prompt -> knowledge_pack -> chunks indexados`.
- El sistema persiste trazabilidad de evidencias.
- La UI permite lanzar el job y ver su estado.
- El retrieval puede distinguir entre fuentes manuales y conocimiento curado.
