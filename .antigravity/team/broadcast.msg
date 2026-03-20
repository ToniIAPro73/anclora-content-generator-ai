=== BROADCAST DE ANCLORABOT ===
Fecha: 2026-03-19
De: Anclorabot (Director)
Para: Todos los agentes

FASE 2 - MIGRACION DE AUTH A BETTER AUTH + NEON - ACTIVA

Equipo, entramos en la fase de sustitucion gradual de Supabase Auth por Better Auth usando Neon como base unica.

Objetivos inmediatos:

1. Preparar Better Auth en coexistencia segura con el flujo actual
2. Crear tablas auth y organizaciones en Neon
3. Conectar `organization` con el tenancy historico mediante `workspace_organizations`

Guardarrailes activos:

- Toda feature nace en `sdd/features/<feature>/`
- Antes de cambios significativos, plan y aprobacion
- Validacion minima para cierre de fase: `npm run lint` y `npm run build`
- En `/dashboard/*` sigue prohibido el scroll vertical global
- La migracion debe ser incremental; no se rompe dashboard mientras coexistan ambos sistemas
- La resolucion de tenancy debe converger a `activeOrganizationId -> workspace_id`

Stack de referencia vigente:

- Auth objetivo: Better Auth + Organizations
- Datos: Neon PostgreSQL + Drizzle
- RAG: pgvector + Transformers.js
- UI: Next.js 15 + React 19 + Tailwind CSS v4 + shadcn/ui

Siguiente dependencia critica:

- Tras el schema auth, el siguiente hito es migrar login/logout y proteccion server-side a Better Auth

-- Anclorabot
