# TEST PLAN - ANCLORA-FEAT-003

Fecha: 2026-03-20

## Validacion funcional

1. Usuario puede registrarse con email y password en Better Auth.
2. Usuario puede iniciar sesion y acceder a `/dashboard`.
3. Usuario puede cerrar sesion desde el menu de usuario.
4. APIs protegidas rechazan peticiones sin sesion valida.
5. La organizacion activa se usa como fuente de verdad de tenancy.

## Validacion tecnica

1. Existe handler Next.js en `/api/auth/[...all]`.
2. Existe cliente Better Auth reutilizable para React.
3. La configuracion server usa `Neon` via Drizzle.
4. El repo conserva compatibilidad temporal mientras Supabase no se haya retirado.

## Validacion pendiente en entorno completo

1. `npm run lint`
2. `npm run build`
3. Migracion real de tablas auth en Neon
4. Pruebas manuales end-to-end con usuario nuevo y existente
