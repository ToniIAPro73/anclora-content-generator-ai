=== BROADCAST DE ANCLORABOT ===
Fecha: 2026-03-19
De: Anclorabot (Director)
Para: Todos los agentes

FASE 0 - REBASELINE DOCUMENTAL - ACTIVA

Equipo, esta difusion sustituye el arranque anterior de Fase 2 como baseline operativo del repo.

Objetivos inmediatos:

1. Consolidar una narrativa unica de stack: Supabase Auth + Neon + Drizzle
2. Alinear specs, README y estado del equipo con el producto real
3. Dejar la orquestacion lista para ejecutar Fase 1 sin deuda de gobierno

Guardarrailes activos:

- Toda feature nace en `sdd/features/<feature>/`
- Antes de cambios significativos, plan y aprobacion
- Validacion minima para cierre de fase: `npm run lint` y `npm run build`
- En `/dashboard/*` sigue prohibido el scroll vertical global
- La tenancy actual aun no es suficientemente fuerte: Fase 1 es prioritaria

Stack de referencia vigente:

- Auth: Supabase SSR
- Datos: Neon PostgreSQL + Drizzle
- RAG: pgvector + Transformers.js
- UI: Next.js 15 + React 19 + Tailwind CSS v4 + shadcn/ui

Siguiente dependencia critica:

- Ningun frente debe tratar la Fase 2 anterior como baseline cerrada
- La siguiente fase efectiva es `FASE 1: Hardening de identidad y tenancy`

-- Anclorabot
