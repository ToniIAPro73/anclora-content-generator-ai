# ANCLORA-FEAT-001 - Tenancy Hardening

Fecha: 2026-03-19
Estado: implemented-incremental

## Objetivo

Dejar de confiar en `workspaceId` enviado por cliente para los flujos principales del dashboard y resolver el contexto de tenancy desde la sesion autenticada en server.

## Alcance de esta iteracion

- Resolver `workspaceId` desde Supabase Auth en rutas server
- Usar `user.id` como fallback temporal de workspace si no existe metadata especifica
- Eliminar `workspaceId` hardcodeado de los fetch principales del dashboard
- Endurecer rutas de contenido, metricas y knowledge base

## Rutas cubiertas

- `POST /api/content/generate`
- `POST /api/content/ingest`
- `GET /api/metrics/dashboard`
- `GET /api/rag/sources`
- `POST /api/rag/sources`
- `DELETE /api/rag/sources/[id]`

## Decisiones

1. La sesion autenticada es ahora la fuente de verdad para la resolucion de workspace.
2. Si el usuario tiene `workspace_id` en `app_metadata` o `user_metadata`, ese valor manda.
3. Si no existe metadata, el sistema usa `user.id` como fallback temporal.
4. El cliente deja de enviar `workspaceId` en los flujos principales.

## Riesgos pendientes

- Aun no existe una tabla de workspaces formalizada en Neon con membresias explicitas.
- Varias pantallas de configuracion y partes del dominio siguen modelando `workspace` de forma conceptual, no relacional.
- Las migraciones SQL historicas siguen describiendo un modelo RLS centrado en Supabase Postgres.

## Siguiente paso recomendado

Formalizar el modelo `workspaces + memberships` y migrar metadata/auth para que el fallback `user.id` deje de ser necesario.
