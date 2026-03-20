=== BROADCAST DE ANCLORABOT ===
Fecha: 2026-03-20
De: Anclorabot (Director)
Para: Todos los agentes

FASE 3 - ESPECIALIZACION DE FUENTES Y TRAZABILIDAD RAG - ACTIVA

Equipo, la base de autenticación ya está migrada y el siguiente frente del producto pasa a ser la especialización del RAG sobre la tesis de dominio de Anclora.

Objetivos inmediatos:

1. Clasificar la ingesta por categorías de dominio (`market`, `regulation`, `lifestyle`, `infrastructure`, `editorial`)
2. Hacer legible la trazabilidad de retrieval dentro del Studio y la metadata de generación
3. Mantener convivencia entre ingesta manual, documental y agéntica dentro de `/dashboard/rag`

Guardarrailes activos:

- Toda feature nace en `sdd/features/<feature>/`
- Validación mínima para cierre de fase: `npm run lint` y `npm run build`
- En `/dashboard/*` sigue prohibido el scroll vertical global
- No indexar texto sintético sin separar `claims` y `evidence`
- `workspace_id` sigue siendo frontera obligatoria para packs, jobs y chunks
- Toda nueva fuente debe poder clasificarse por categoría de dominio, no solo por tipo técnico
- El backend vectorial activo sigue siendo `pgvector`, pero el pipeline ya debe aceptar costuras limpias para escalar a Pinecone y Google embeddings

Stack de referencia vigente:

- Auth: Better Auth + Organizations
- Datos: Neon PostgreSQL + Drizzle
- RAG: pgvector + Transformers.js + knowledge packs + categorías de dominio
- UI: Next.js 15 + React 19 + Tailwind CSS v4 + shadcn/ui

Siguiente dependencia critica:

- Consolidar activos estratégicos de Fase 3 y preparar la entrada a Fase 4 de telemetría editorial

-- Anclorabot
