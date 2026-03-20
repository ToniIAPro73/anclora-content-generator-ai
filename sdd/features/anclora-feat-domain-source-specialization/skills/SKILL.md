# Skill: Domain Source Specialization

Usa esta skill cuando una iteracion de Fase 3 necesite especializar el RAG por dominio y mejorar la auditabilidad del retrieval.

## Objetivos

- Clasificar las fuentes por categoria de negocio
- Mantener compatibilidad con la ingesta existente
- Hacer visible la trazabilidad de retrieval en Studio y RAG

## Guardarrailes

- No romper la gobernanza del dashboard
- No degradar la multi-tenancy basada en `workspace_id`
- Mantener `sourceType` como eje tecnico y `sourceCategory` como eje editorial
