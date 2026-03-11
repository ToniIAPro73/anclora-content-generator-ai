# ANCLORA-FEAT-AUTH: Autenticación, Middleware y Preparación Multi-Tenant

## Descripción General
Esta feature asienta la base de Identidad y Accesos (IAM) de Anclora Content Generator AI. Utiliza `@supabase/ssr` para soportar Next.js App Router y define el modelo base de `workspaces` para aislar datos de inquilinos.

## Requisitos
1. **Supabase SSR:** Clientes de servidor, cliente y middleware configurados.
2. **Middleware Protector:** Todo el contenido bajo `/dashboard/*` debe redirigir a `/login` si no hay sesión activa.
3. **Página de Login Básica:** Interfaz UI minimalista con soporte para Email/Password.
4. **Metodología SDD:** Documentación de Specs, Planes de test e inicialización del entorno seguro.

## Reglas de Gobernanza
- Las variables de Supabase deben apuntar al `project_ref` designado en las environment variables (desarrollo local de inicio).
- No deben filtrarse llaves secretas al cliente (solo `NEXT_PUBLIC_*`).
- Rutas no protegidas permitidas: `/login`, `/auth/callback`, `/`.

## Criterio de Aceptación (Definition of Done)
- [ ] Construidos `server.ts`, `client.ts` y `middleware.ts` en `src/utils/supabase/`.
- [ ] Configurado `src/middleware.ts` para interceptar rutas de dashboard.
- [ ] Construida la página `/login`.
- [ ] Validaciones `npm run lint` y `npm run build` en verde.
- [ ] Commits aislados bajo el patrón `feat: [ANCLORA-FEAT-AUTH]`.
