# Anclora Content Generator AI

Motor editorial y de inteligencia de contenido para Anclora Private Estates.

## Baseline actual

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- Auth: Better Auth con email/password y organizations
- Datos operativos: Neon PostgreSQL con Drizzle ORM
- RAG: pgvector + Transformers.js para embeddings locales
- Modelos: Anthropic, Groq y Ollama
- Shell de dashboard con gobernanza de layout sin scroll global en `/dashboard/*`

## Estado del producto

La aplicacion ya cubre una base funcional de dashboard, studio, knowledge base, metricas y primeras rutas API para generacion e ingesta. Aun asi, el producto esta en una fase de rebaseline:

- La vision estrategica es una plataforma de content intelligence para real estate de lujo, no un generador generico.
- La tenancy sigue necesitando hardening: varias rutas todavia aceptan `workspaceId` desde el cliente.
- La documentacion historica mezcla Supabase Auth, Neon y RLS como si fueran una sola capa cerrada.

Este repositorio usa desde ahora una narrativa unica:

- Better Auth resuelve autenticacion y organizaciones.
- Neon + Drizzle resuelven persistencia operativa.
- El dashboard resuelve operacion editorial.

Estado del roadmap a 2026-03-20:

- Fase 0 completada
- Fase 1 completada en su baseline operativo con Better Auth + `workspace_organizations`
- Fase 2 parcialmente avanzada desde UX, pero pendiente de cerrar el ciclo editorial completo
- Fase 3 activa, con foco actual en especializacion de fuentes, trazabilidad de retrieval y activos editoriales

## Principios no negociables

- En `/dashboard/*` no se permite scroll vertical global del documento.
- El shell del dashboard debe ajustarse al viewport con `h-screen` y `overflow-hidden`.
- Si una vista necesita scroll, debe vivir dentro de su panel interno.
- Ningun cambio de UI debe aparentar persistencia real si la accion aun no existe.

## Roadmap activo

### Fase 0. Rebaseline documental

- Alinear README, specs y gobernanza con el stack real
- Renombrar la identidad del paquete
- Preparar la base SDD y multiagente para siguientes fases

### Fase 1. Hardening de identidad y tenancy

- Resolver `workspaceId` desde sesion autenticada en server
- Reducir dependencia de IDs enviados por cliente
- Formalizar el modelo de tenancy real para Neon

### Fase 2. UX operativa

- Extender la narrativa mission control a todo el dashboard
- Diferenciar mocks de datos persistidos
- Hacer accionables estados vacios y flujos editoriales

### Fase 3. RAG de dominio

- Especializar fuentes, micro-zonas, trazabilidad y plantillas Anclora

### Fase 4. Telemetria editorial

- Cerrar el ciclo draft, review, approved, scheduled, published

### Fase 5. Automatizacion y agentes

- Formalizar agentes sobre procesos confiables y auditables

## Setup local

### Requisitos

- Node.js 20+
- npm
- Base de datos Neon PostgreSQL

### Variables de entorno

Configura `.env.local` con:

```bash
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/database?sslmode=require
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=change-me
BETTER_AUTH_ENABLED=true
NEXT_PUBLIC_BETTER_AUTH_ENABLED=true
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
```

### Instalacion

```bash
npm install
npm run dev
```

## Comandos utiles

```bash
npm run dev
npm run lint
npm run build
npm run test
npm run db:generate
npm run db:push
npm run db:studio
npm run db:migrate
```

## Estructura relevante

```text
src/
  app/
    api/                  # Endpoints de contenido, metricas y RAG
    dashboard/            # Shell y vistas del dashboard
  components/             # UI y layout
  lib/
    ai/                   # Clientes y adaptadores LLM
    db/                   # Schema Drizzle, cliente Neon y tipos
    rag/                  # Chunking, embeddings, retrieval y pipeline
    auth/                 # Better Auth, tenancy y helpers de sesion
supabase/migrations/      # SQL historico y bootstrap
sdd/                      # Core specs y specs por feature
.antigravity/             # Rules, skills y orquestacion del equipo
docs/                     # Analisis y documentacion de apoyo
```

## Contratos API actuales

### `POST /api/content/generate`

Payload actual:

```json
{
  "templateId": "uuid",
  "opportunityId": "uuid",
  "contentType": "blog",
  "title": "Informe editorial Q2",
  "userPrompt": "Redacta una pieza orientada a compradores internacionales",
  "ragQuery": "tendencias de demanda en Bendinat",
  "microZoneId": "uuid"
}
```

Notas:

- `contentType` valido: `blog`, `linkedin`, `instagram`, `facebook`, `newsletter`, `custom`.
- La resolucion autentica de `workspaceId` se hace en server via Better Auth + `workspace_organizations`.

### `POST /api/content/ingest`

Payload actual:

```json
{
  "title": "Informe de mercado",
  "sourceType": "manual",
  "sourceCategory": "market",
  "content": "Texto base para la knowledge base"
}
```

### `GET /api/metrics/dashboard`

Notas:

- Si `DATABASE_URL` no existe, devuelve metricas vacias de forma segura.
- La resolucion server-side del workspace ya no depende de Supabase.

## Base de datos y tenancy

La persistencia operativa vive en Neon y se modela con Drizzle. Las migraciones SQL historicas bajo `supabase/migrations/` siguen siendo utiles como referencia y bootstrap, pero no deben leerse como garantia de aislamiento efectivo por si mismas.

Hoy la multi-tenancy esta definida a nivel de modelo mediante `workspace_id`, pero su enforcement todavia no esta completamente endurecido. Esa es la prioridad principal de la Fase 1.

En Fase 3, las fuentes del RAG ya empiezan a especializarse por categoria de dominio:

- `market`
- `regulation`
- `lifestyle`
- `infrastructure`
- `editorial`
- `general`

## SDD y forma de trabajo

- Toda feature empieza en `sdd/features/<feature>/`
- Cada feature debe incluir su spec y, cuando aplique, reglas o habilidades locales
- Validacion minima antes de cerrar una fase: `npm run lint` y `npm run build`
- Convencion de commit: `feat: [ANCLORA-FEAT-XXX] Descripcion`

## Documentos clave

- `docs/anclora-analisis-y-plan-de-mejora-2026-03-19.md`
- `sdd/core/product-spec-v0.md`
- `sdd/core/spec-core-v1.md`
- `.antigravity/skills/anclorabot-multiagente-system/SKILL.md`
- `.antigravity/skills/anclora-product-ux-guardian/SKILL.md`

## Nota de Fase 0

Este README refleja el baseline vigente tras la migracion operativa de auth a Better Auth + Neon. Si encuentras referencias a Supabase Auth o a narrativas antiguas en specs historicas, tratalas como trazabilidad o deuda documental a limpiar.
