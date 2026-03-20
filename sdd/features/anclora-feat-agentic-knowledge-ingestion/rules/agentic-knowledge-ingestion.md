# Rule - Agentic Knowledge Ingestion

Usa esta regla cuando una feature afecte la creación, normalización o vectorización de conocimiento curado.

## Guardrails

1. No indexar directamente al RAG texto sintético sin `claims` y `evidence`.
2. Mantener `workspace_id` como frontera obligatoria de aislamiento.
3. Separar siempre:
   - input crudo
   - payload normalizado
   - chunks vectorizados
4. El artefacto intermedio oficial será `knowledge_pack`.
5. La UI de RAG debe mostrar trazabilidad, no solo volumen de datos.

## Prioridades

1. Trazabilidad antes que automatización completa.
2. Calidad editorial antes que cantidad de chunks.
3. Workflows incrementales antes que una orquestación monolítica.
