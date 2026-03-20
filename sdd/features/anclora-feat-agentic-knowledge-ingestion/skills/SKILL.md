# Skill: Agentic Knowledge Ingestion

Usa esta habilidad cuando una tarea toque workflows de investigación, normalización de conocimiento o alimentación avanzada del RAG.

## Checklist

1. Identificar el tipo de entrada:
   - prompt
   - notebook
   - fuente curada
2. Transformar siempre la salida a `knowledge_pack`.
3. Separar `claims`, `evidence`, `topics` y `recommended_uses`.
4. Persistir jobs y estados del pipeline.
5. Indexar en pgvector desde payload normalizado cuando exista.
6. Documentar trazabilidad y riesgos de soporte débil.
