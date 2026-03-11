# Anclora Content Generator AI - Ecosistema de Agentes

## Objetivo del repositorio
Anclora Content Generator AI es el motor autónomo de autoridad de marca de Anclora Private Estates. Aplicación web para generación de contenido hiper-optimizado (SEO, LinkedIn, Instagram, Newsletters) con arquitectura Next.js + TypeScript + Supabase + RAG Local.

## Stack actual
- Next.js 15 + React 19
- TypeScript + Tailwind CSS v4 + shadcn/ui
- Supabase (`@supabase/supabase-js`, PostgreSQL, pgvector)
- Embeddings: Transformers.js (Ejecución edge/node local zero-cost)
- LLMs: Ollama (parsing local), Groq (velocidad), Anthropic Claude (razonamiento profundo)

## Estructura relevante
- `src/app/`: App Router y endpoints API.
- `src/components/`: Componentes UI y layouts (Shell, Sidebar, Content).
- `lib/agents/`: Orquestador de agentes de redacción y RAG.
- `supabase/migrations/`: Esquema SQL y RLS (Tenant aislado).
- `sdd/`: Data Specs, Arquitectura, y Planes por Feature (Spec-Driven Development).
- `.antigravity/`: Prompts maestros, rules y skills para agentes autónomos.

## Convenciones de trabajo (Metodología SDD)
- Todo desarrollo de feature inicia con su especificación en `sdd/features/<feature>/<feature>-spec-v1.md`.
- El código se implementa incrementalmente.
- Cada feature requiere validación de `lint`, `type-check` y `build` antes del PR/commit final.
- **Commit History:** Obligatorio aislar commits por feature (`feat: [ANCLORA-FEAT-XXX] ...`).

## Gobernanza de layout (obligatoria)
- En rutas `/dashboard/*` no se permite scroll vertical global del documento (`body/html`).
- El shell debe ajustarse al viewport (`h-screen`) y usar `overflow-hidden` a nivel contenedor principal.
- Si una vista en el content studio necesita desplazamiento (ej: un editor Markdown largo), debe ser interno al panel/slot (`overflow-y-auto`).
- Cualquier cambio de UI que reintroduzca scroll vertical global en dashboard implica `Decision=NO-GO`.

## Supabase Blueprint
- Se utilizará Supabase local/cloud para desarrollo. Todo el schema (`content_sources`, `knowledge_chunks`, `generated_content`) asume entorno multi-tenant mediante columna `workspace_id`.
- Reglas RLS obligatorias vinculadas al `workspace_id` del usuario autenticado.

## Comandos útiles
- `npm run dev`: desarrollo local.
- `npm run build`: build de producción.
- `npm run lint`: validación ESLint.
