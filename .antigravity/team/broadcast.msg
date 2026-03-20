=== BROADCAST DE ANCLORABOT ===
Fecha: 2026-03-19
De: Anclorabot (Director)
Para: Todos los agentes

FASE 1 - HARDENING DE IDENTIDAD Y TENANCY - ACTIVA

Equipo, esta difusion sustituye el arranque anterior de Fase 2 como baseline operativo del repo.

Objetivos inmediatos:

1. Resolver `workspaceId` desde sesion autenticada en server
2. Retirar dependencias de tenancy enviadas libremente desde cliente
3. Preparar el salto a un modelo explicito de workspaces en Neon

Guardarrailes activos:

- Toda feature nace en `sdd/features/<feature>/`
- Antes de cambios significativos, plan y aprobacion
- Validacion minima para cierre de fase: `npm run lint` y `npm run build`
- En `/dashboard/*` sigue prohibido el scroll vertical global
- La tenancy actual debe endurecerse en server antes de seguir ampliando superficie funcional

Stack de referencia vigente:

- Auth: Supabase SSR
- Datos: Neon PostgreSQL + Drizzle
- RAG: pgvector + Transformers.js
- UI: Next.js 15 + React 19 + Tailwind CSS v4 + shadcn/ui

Siguiente dependencia critica:

- Tras este endurecimiento inicial, el siguiente hito es formalizar `workspaces + memberships`

-- Anclorabot
