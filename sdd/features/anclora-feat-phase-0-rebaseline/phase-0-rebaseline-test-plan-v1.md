# TEST PLAN - ANCLORA-FEAT-000

Fecha: 2026-03-19

## Validacion documental

1. `README.md` describe `Supabase Auth` como capa de autenticacion.
2. `README.md` describe `Neon + Drizzle` como capa de datos operativa.
3. `README.md` ya no usa `tmp-app` como identidad de producto.
4. `sdd/core/product-spec-v0.md` y `sdd/core/spec-core-v1.md` contienen baseline vigente.

## Validacion de orquestacion

1. `.antigravity/team/tasks.json` arranca en `FASE 0`.
2. `.antigravity/team/broadcast.msg` sustituye la referencia antigua a Fase 2 como baseline.
3. Existen `mailbox`, `locks` y `approvals` bajo `.antigravity/team/`.

## Validacion tecnica

1. `npm run lint`
2. `npm run build`

## Cierre

1. Commit aislado con formato `feat: [ANCLORA-FEAT-000] ...`
2. Push al remoto principal
