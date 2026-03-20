# Core Spec v1

Fecha: 2026-03-19
Owner: Anclorabot

## Arquitectura vigente

- Frontend: Next.js 15 + React 19 + TypeScript
- UI: Tailwind CSS v4 + shadcn/ui
- Auth: Better Auth
- DB operativa: Neon PostgreSQL
- ORM: Drizzle
- RAG: pgvector + Transformers.js
- LLMs: Anthropic, Groq, Ollama

## Decisiones vigentes

1. Better Auth se trata como capa de autenticacion y organizaciones.
2. Neon y Drizzle son la fuente de verdad para schema y consultas operativas.
3. El dashboard debe comportarse como cockpit editorial, no como demo generica de IA.
4. La tenancy se modela con `workspace_id`, pero el enforcement fuerte debe pasar al server en Fase 1.
5. El documento estrategico raiz inspira direccion, pero no se usa como blueprint tecnico literal.

## Riesgos conocidos

- Rutas API que aceptan `workspaceId` desde cliente
- Documentacion historica con referencias ambiguas a Supabase Auth y RLS
- Mocks visibles en varias pantallas del dashboard
- Diferencia entre discurso multi-tenant y enforcement real
- RAG todavia demasiado orientado a fuentes crudas y no a conocimiento curado

## Criterios de aceptacion para la siguiente fase

- Resolver workspace desde sesion autenticada
- Reducir contratos inseguros en UI y API
- Mantener gobernanza de layout del dashboard
- Preservar coherencia entre UX, API y modelo de datos
- Evolucionar la Knowledge Base hacia `knowledge packs` curados y trazables
- Especializar las fuentes del RAG por categoria de dominio y hacer legible la trazabilidad de retrieval
- Consolidar una UX premium de cockpit antes de abrir integraciones de ejecucion real
