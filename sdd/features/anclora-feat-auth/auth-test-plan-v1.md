# TEST PLAN: ANCLORA-FEAT-AUTH

## Entorno Local
1. `npm run dev` sin errores.
2. Navegar a `/dashboard` sin sesión activa debe redirigir inmediatamente a `/login`.
3. El login con credenciales válidas redirige a `/dashboard`.
4. El logout desde el dashboard limpia la sesión y redirige a `/login`.
5. Los tokens JWT persisten correctamente al recargar la página.

## Verificación de Código Estático
1. `npm run lint` ejecuta sin errores de uso inadecudado de `any` en los helpers de Supabase.
2. `npm run build` compila correctamente el middleware y las rutas API.

## Criterios de Seguridad
1. El archivo `src/middleware.ts` no permite el bypass del dashboard.
2. Ningún key de tipo `service_role` o secreto filtrado en el cliente (inspeccionar Network).
