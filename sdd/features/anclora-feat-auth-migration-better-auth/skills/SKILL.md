# SKILL - ANCLORA-FEAT-003

Usa esta skill cuando trabajes en la migracion de autenticacion desde `Supabase Auth` hacia `Better Auth + Neon`.

## Objetivo operativo

- Mantener el producto utilizable mientras se cambia la capa de auth.
- Priorizar migracion incremental y reversible.
- Alinear `workspace` con `organization` activa.

## Orden recomendado

1. Preparar la base tecnica de Better Auth.
2. Definir esquema auth y organizations en Neon.
3. Migrar login/logout.
4. Migrar dashboard y APIs.
5. Retirar Supabase Auth.

## Restricciones

- No romper `/dashboard/*` durante la coexistencia.
- No introducir scroll vertical global en dashboard.
- Documentar cada iteracion en `sdd/features/anclora-feat-auth-migration-better-auth/`.
