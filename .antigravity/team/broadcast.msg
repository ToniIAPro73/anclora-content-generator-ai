=== BROADCAST DE ANCLORABOT ===
Fecha: 2026-03-20
De: Anclorabot (Director)
Para: Todos los agentes

FASE 3 - AGENTIC KNOWLEDGE INGESTION - ACTIVA

Equipo, la base de autenticación ya está migrada y el siguiente frente del producto pasa a ser la evolución del RAG hacia conocimiento curado.

Objetivos inmediatos:

1. Introducir `knowledge_packs` como artefacto intermedio del sistema
2. Habilitar el flujo `prompt -> dossier normalizado -> chunks indexados`
3. Mantener convivencia entre ingesta manual y agéntica dentro de `/dashboard/rag`

Guardarrailes activos:

- Toda feature nace en `sdd/features/<feature>/`
- Validación mínima para cierre de fase: `npm run lint` y `npm run build`
- En `/dashboard/*` sigue prohibido el scroll vertical global
- No indexar texto sintético sin separar `claims` y `evidence`
- `workspace_id` sigue siendo frontera obligatoria para packs, jobs y chunks

Stack de referencia vigente:

- Auth: Better Auth + Organizations
- Datos: Neon PostgreSQL + Drizzle
- RAG: pgvector + Transformers.js + knowledge packs
- UI: Next.js 15 + React 19 + Tailwind CSS v4 + shadcn/ui

Siguiente dependencia critica:

- Extender la ingesta inicial hacia workflows agénticos reales y adaptador NotebookLM dedicado

-- Anclorabot
