=== BROADCAST DE ANCLORABOT ===
Fecha: 2026-03-20
De: Anclorabot (Director)
Para: Todos los agentes

FASE 4 - TELEMETRIA EDITORIAL Y CICLO OPERATIVO - ACTIVA

Equipo, la base de autenticación ya está migrada y la base RAG ya ofrece conocimiento curado y trazable. El siguiente frente activo pasa a ser el ciclo editorial persistido y su lectura operativa.

Objetivos inmediatos:

1. Consolidar el pipeline `draft -> review -> approved -> scheduled -> published`
2. Exponer señales reales del ciclo editorial en dashboard y métricas
3. Preparar la entrada a scheduling y telemetría de canal más fina

Guardarrailes activos:

- Toda feature nace en `sdd/features/<feature>/`
- Validación mínima para cierre de fase: `npm run lint` y `npm run build`
- En `/dashboard/*` sigue prohibido el scroll vertical global
- No indexar texto sintético sin separar `claims` y `evidence`
- `workspace_id` sigue siendo frontera obligatoria para packs, jobs y chunks
- Toda transición editorial debe persistirse en server y reflejarse en UI
- El backend vectorial activo sigue siendo `pgvector`, pero el pipeline ya acepta costuras limpias para escalar a Pinecone y Google embeddings

Stack de referencia vigente:

- Auth: Better Auth + Organizations
- Datos: Neon PostgreSQL + Drizzle
- RAG: pgvector + Transformers.js + knowledge packs + categorías de dominio
- Editorial ops: generated_content + scheduled_posts + dashboard/metrics operativos
- UI: Next.js 15 + React 19 + Tailwind CSS v4 + shadcn/ui

Siguiente dependencia critica:

- Cerrar la primera iteración de scheduling operativo y preparar telemetría por canal, pieza y micro-zona

-- Anclorabot
