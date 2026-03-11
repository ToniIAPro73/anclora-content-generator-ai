# ANCLORA-FEAT-INIT: Setup Core, IAM y Shell UI

## Descripción General
Esta feature establece los fundamentos técnicos, visuales y de arquitectura del proyecto `anclora-content-generator-ai`.

## Requisitos
1. **Infraestructura Base:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4.
2. **Gobernanza Visual:**
   - Tipografía principal: Outfit (Títulos), Inter (Cuerpo).
   - Paleta: Tonos profundos neutros, acentos Cian (`#06B6D4`) y Púrpura Eléctrico (`#8B5CF6`).
   - Soporte nativo `next-themes` (Dark/Light).
3. **Dashboard Shell (Obligatorio):**
   - No generar scroll vertical global (`h-screen`, `overflow-hidden` en contenedor).
   - Sidebar responsiva.
   - Topbar con selectores de Idioma (i18n placeholder) y Tema.
4. **Metodología SDD:** Documentación de Specs, Planes de test e inicialización del repositorio Git.

## Criterio de Aceptación (Definition of Done)
- [x] Ejecución correcta de dependencias y `npx create-next-app`.
- [ ] Aplicados estilos en `globals.css` y `tailwind.config.ts`.
- [ ] Construidos `Shell.tsx`, `Sidebar.tsx`, `Topbar.tsx`.
- [ ] Validaciones `npm run lint` y `npm run build` en verde.
- [ ] Commits aislados bajo el patrón `feat: [ANCLORA-FEAT-INIT]`.
