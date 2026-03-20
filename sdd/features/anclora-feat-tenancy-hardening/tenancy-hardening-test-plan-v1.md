# TEST PLAN - ANCLORA-FEAT-001

Fecha: 2026-03-19

## Validacion funcional

1. Usuario autenticado puede abrir dashboard y consultar metricas sin enviar `workspaceId`.
2. Studio genera contenido sin enviar `workspaceId` en el body.
3. Knowledge Base lista, crea y elimina fuentes sin `workspaceId` en query/body.
4. Usuario sin sesion recibe `401` en rutas endurecidas.

## Validacion tecnica

1. `src/lib/auth/workspace.ts` resuelve `workspaceId` desde metadata o `user.id`.
2. Las vistas principales del dashboard ya no contienen UUID hardcodeados para tenancy.
3. Los endpoints cubiertos no aceptan `workspaceId` del cliente como fuente de verdad.

## Validacion pendiente en entorno completo

1. `npm run lint`
2. `npm run build`
3. Flujo autenticado end-to-end con Supabase configurado
