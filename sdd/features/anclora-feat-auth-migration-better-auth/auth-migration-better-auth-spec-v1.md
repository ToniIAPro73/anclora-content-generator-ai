# ANCLORA-FEAT-003 - Auth Migration to Better Auth + Neon

Fecha: 2026-03-20
Estado: in-progress

## Objetivo

Sustituir `Supabase Auth` por `Better Auth` usando `Neon` como base de datos unica para identidad, sesiones y organizaciones, preservando el modelo multi-tenant del producto.

## Motivacion

- `Supabase` solo se estaba usando para autenticacion.
- El producto ya opera sobre `Neon` para el dominio principal.
- Unificar auth y dominio en la misma base reduce complejidad y dependencias.
- El modelo de `organization` de Better Auth encaja con la necesidad de `workspace` activo.

## Alcance de la feature

- Instalar y preparar `Better Auth` en el repo.
- Crear la base server/client para Next.js App Router.
- Diseñar la migracion de `workspace -> organization`.
- Reescribir gradualmente login, logout, proteccion server-side y resolucion de tenancy.
- Retirar `Supabase Auth` cuando el nuevo flujo este validado.

## Fases de implementacion

1. Skeleton coexistente de Better Auth sin romper el flujo actual.
2. Creacion de tablas de auth en Neon y contrato de organizations.
3. Migracion de login y logout del cliente.
4. Migracion de lectura de sesion en dashboard y APIs.
5. Retirada final de Supabase Auth y limpieza de variables de entorno.

## Modelo de transicion de tenancy

- `organization` sera la entidad auth equivalente al `workspace` funcional.
- Mientras el dominio siga usando `workspace_id uuid`, se mantiene una tabla puente `workspace_organizations`.
- La sesion de Better Auth aporta `activeOrganizationId`.
- El server resolvera `workspaceId` buscando el mapping `activeOrganizationId -> workspace_id`.

## Decisiones

1. `Neon` sera la unica base de datos de identidad y negocio.
2. `Better Auth` sera la capa de autenticacion, sesiones y organizaciones.
3. `organization.id` sera la fuente de verdad futura para `workspaceId`.
4. La proteccion de dashboard y APIs se movera a validacion server-side antes de reconsiderar middleware.
5. La migracion se hara por coexistencia temporal para no bloquear el desarrollo del producto.

## Riesgos y notas

- La migracion de usuarios desde Supabase puede requerir recreacion manual o flujo de reset de password.
- El contrato exacto de tablas auth se cerrara en la siguiente iteracion con el esquema Drizzle definitivo.
- Mientras coexistan ambos sistemas, Supabase seguira operativo solo como fallback temporal.

## Criterio de salida de la feature

- `/login` opera con Better Auth.
- `/dashboard/*` y APIs internas resuelven sesion desde Better Auth.
- `workspace` se deriva desde organizacion activa.
- Dependencias y utilidades de `Supabase Auth` quedan retiradas.
