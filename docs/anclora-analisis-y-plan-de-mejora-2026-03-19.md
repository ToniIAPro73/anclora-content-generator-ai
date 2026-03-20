# Analisis y Plan de Mejora

Fecha: 2026-03-19

Actualizacion de estado: 2026-03-20

## Resumen ejecutivo

El documento `docs/Plan de Desarrollo Anclora Content Generator AI.docx` define una vision potente: convertir Anclora en un motor de inteligencia de mercado y autoridad de marca, apoyado en agentes, RAG profundo, distribucion multicanal y una interfaz de control de mision. Esa vision sigue siendo valida como norte estrategico, pero hoy existe una brecha importante entre el relato del plan y el estado real del producto.

La app actual ya tiene una base util:

- Next.js 15 + React 19 + TypeScript.
- Better Auth para autenticacion y organizaciones.
- Neon + Drizzle como base de datos operativa.
- Primeras rutas API para generacion, ingesta, metricas y fuentes RAG.
- Un dashboard funcional con shell propio.

Sin embargo, el producto todavia se percibe como un MVP generico de generacion de contenido, no como una plataforma de content intelligence premium para real estate de lujo. La mayor oportunidad de mejora no es solo tecnica: es de coherencia entre estrategia, arquitectura, datos y experiencia.

## Lectura del plan raiz

### Lo que el plan hace bien

- Define un posicionamiento claro: inteligencia inmobiliaria hiperlocal, no simple “AI writer”.
- Enfatiza un motor RAG ligado a micro-zonas, tendencias, regulacion e infraestructura.
- Marca una direccion valida para el producto: analisis, distribucion multicanal, telemetria y automatizacion.
- Da mucha importancia a la orquestacion multiagente y a la velocidad de ejecucion.

### Lo que hoy esta desalineado

- El `.docx` asume Supabase como capa de base de datos relacional/vectorial; el stack real ya es `Supabase Auth + Neon DB`.
- El plan describe una plataforma mucho mas cercana a un “mission control” editorial y operativo que la UI implementada.
- La documentacion mezcla conceptos de OpenClaw, MCP, Claude Code teams y automatizacion avanzada que aun no estan aterrizados en una arquitectura ejecutable dentro del repo.

Conclusión: el documento sigue siendo valioso como vision, pero no debe tratarse como especificacion de implementacion literal. Hace falta una rebaselinizacion del roadmap sobre el stack real.

## Hallazgos principales del repositorio

### 1. Arquitectura real vs documentacion

- `README.md` y varias descripciones internas mezclan Supabase DB, Neon y Drizzle sin una narrativa unica.
- `package.json` sigue con nombre `tmp-app`, señal de bootstrap no terminado.
- El `README.md` menciona estructura `drizzle/` que no existe en el repo actual.
- `src/lib/db/types.ts` se presenta como “Auto-generated TypeScript types from Supabase schema”, pero el stack operativo es Neon + Drizzle.

### 2. Riesgo critico de multi-tenancy y seguridad

- La app usa Supabase Auth, pero muchas rutas server aceptan `workspaceId` desde el cliente.
- El aislamiento real no depende de la sesion del usuario sino de un ID enviado en requests.
- Las migraciones SQL y politicas RLS en `supabase/migrations/003_rls_policies.sql` dependen de `auth.uid()` y tablas `auth.users`, lo cual no aplica directamente a Neon de la misma forma que a Supabase Postgres.

Implicacion: hoy la narrativa de “multi-tenant con RLS” esta mas documentada que garantizada en la practica.

### 3. Gap funcional entre UI y API

- El `Content Studio` anterior trabajaba con tipos como `blog_post`, `social_post` y `email`, pero la API real espera `blog`, `linkedin`, `instagram`, `facebook`, `newsletter` o `custom`.
- La API `POST /api/content/generate` esperaba `userPrompt`, mientras que la UI no lo enviaba correctamente.

Esto implicaba riesgo de fallo real en la generacion. Quedo corregido en la mejora UX/UI realizada en esta iteracion.

### 4. Gap UX/UI respecto al valor de Anclora

- La interfaz anterior comunicaba “SaaS generico de IA”.
- El plan estrategico habla de micro-zonas, oportunidades, market intelligence y autoridad de marca.
- Habia ejemplos y copies genericos que rompian la narrativa de negocio.

### 5. Gobernanza de layout

- La regla raiz exige que el bloqueo de scroll global solo aplique dentro de `/dashboard/*`.
- La app tenia `overflow-hidden` global en `html, body`, afectando tambien rutas fuera del dashboard.

Esto ya se ha corregido para que el dashboard siga siendo un shell contenido, sin imponer esa restriccion a toda la app.

## Mejoras UX/UI aplicadas en esta iteracion

### Dashboard shell

- Se ha refinado el shell para mantener el comportamiento `h-screen` y `overflow-hidden` en dashboard, con scroll interno solo en el panel principal.
- Se ha mejorado el `Topbar` con contexto de pagina, narrativa de producto y navegacion movil.
- Se ha rehecho la sidebar para que se sienta mas sistema de producto y menos lista de links.

### Navegacion movil

- El dashboard no tenia una navegacion funcional en movil.
- Ahora hay una navegacion horizontal contextual en `Topbar` para las vistas principales.

### Overview

- Se ha sustituido el dashboard generico por una vista mas cercana a un “mission control”.
- Ahora aparecen oportunidades detectadas, cadencia editorial, acciones prioritarias y un hero enfocado en autoridad de marca.

### Content Studio

- Se ha reestructurado en tres zonas: briefing, contexto/sistema y output.
- Se han introducido presets estrategicos alineados con Anclora.
- Se ha corregido el payload para que coincida con la API real.
- El panel de salida ahora funciona como mesa editorial, no solo como textarea aislado.

### Knowledge Base

- Se ha corregido el riesgo de doble scroll interno en la vista RAG.

## Estado del roadmap a 2026-03-20

- Fase 0 completada: rebaseline documental, naming y narrativa unica de stack.
- Fase 1 completada en baseline operativo: Better Auth + `workspace_organizations` y resolucion server-side de `workspaceId`.
- Fase 2 avanzada parcialmente: shell, sidebar, studio, dashboard y RAG ya operan con una narrativa menos generica.
- Fase 3 muy avanzada: knowledge packs, ingesta documental, oportunidades editoriales, trazabilidad `oportunidad -> studio -> draft` y especializacion por categoria de fuente.
- Fase 4 abierta: primera iteracion del ciclo editorial persistido con `draft`, `review`, `approved`, `scheduled` y `published`.

## Roadmap recomendado

## Fase 0. Rebaseline documental

Objetivo: alinear vision, stack y roadmap.

- Actualizar `README.md` para reflejar sin ambiguedad: `Supabase Auth + Neon + Drizzle`.
- Sustituir referencias legacy o ambiguas a Supabase DB si ya no aplica.
- Crear una especificacion raiz breve y vigente para el producto actual.
- Renombrar `package.json` a un nombre real del producto.

## Fase 1. Hardening de identidad y tenancy

Objetivo: que la seguridad deje de estar solo en el discurso.

- Resolver el `workspaceId` desde la sesion autenticada en server.
- Eliminar dependencia de IDs enviados libremente por el cliente para acceso a datos.
- Definir el modelo de tenancy real para Neon.
- Replantear las “RLS policies” documentadas si Neon es la base operativa definitiva.

## Fase 2. UX de producto orientada a operacion

Objetivo: que el dashboard sirva para trabajar, no solo para demostrar.

- Llevar la narrativa “mission control” a `Metrics`, `RAG` y `Settings`.
- Marcar claramente datos mock vs datos persistidos.
- Introducir estados vacios accionables y onboarding operacional.
- Incorporar acciones reales de flujo: guardar draft, aprobar, programar, derivar por canal.

## Fase 3. RAG de dominio y activos estrategicos

Objetivo: especializar el producto donde realmente gana.

- Modelo de fuentes por categoria: mercado, regulacion, lifestyle, infraestructuras.
- Micro-zonas con metadata consistente y explotable.
- Trazabilidad de fuentes utilizadas en cada pieza generada.
- Libreria de plantillas Anclora por canal y objetivo.

Estado actual:

- `knowledge packs`, jobs y oportunidades editoriales ya estan implementados.
- La importacion documental ya soporta PDF, DOCX, Google Docs, TXT y Markdown.
- La trazabilidad ya enlaza `fuente -> oportunidad -> studio -> borrador`.
- Esta iteracion continua la fase con categorias de fuente de dominio y retrieval legible para operadores.

## Fase 4. Telemetria y ciclo editorial completo

Objetivo: cerrar el loop de valor.

- Metricas por canal, por pieza y por micro-zona.
- Estado editorial: draft, review, approved, scheduled, published.
- Integracion de scheduling y alertas.
- Vinculacion futura con CRM/lead tracking.

Estado actual:

- Studio ya permite mover una pieza entre `review`, `approved`, `scheduled` y `published`.
- El dashboard ya refleja pipeline editorial reciente.
- Metrics ya incorpora lectura de `review` y `approved`.
- Sigue pendiente una capa de scheduling ejecutor real y telemetria por canal.

## Fase 5. Automatizacion y agentes

Objetivo: volver a la vision del `.docx`, pero con base real.

- Formalizar tareas agenciales sobre procesos claros y auditables.
- Separar agentes de datos, UX, API y verificacion.
- Introducir automatizacion solo cuando el flujo core ya sea confiable.

## Decisiones de producto recomendadas

- Tratar el `.docx` como documento estrategico inspirador, no como blueprint tecnico literal.
- Consolidar una historia unica: Better Auth resuelve auth y organizaciones; Neon resuelve datos; el dashboard resuelve operacion editorial.
- Hacer que toda decision de UI pase por una pregunta: “Esto parece un generador generico o una plataforma de inteligencia inmobiliaria premium?”
- Priorizar seguridad de tenancy y persistencia real por encima de nuevas pantallas.

## Riesgos abiertos

- Persisten mocks visibles en varias vistas del dashboard.
- El acoplamiento entre UI, API y modelo de datos sigue necesitando limpieza adicional.
- La estrategia RLS historica ya no debe leerse como control efectivo del sistema actual sobre Neon.
- Siguen existiendo mocks visibles y contratos editoriales no totalmente cerrados en `Metrics` y `Settings`.
- Falta la libreria de plantillas Anclora persistida y gobernada desde base de datos.

## Recomendacion final

La app ya tiene suficiente base como para dejar atras la fase de demo generica. El siguiente salto de valor viene de combinar tres movimientos: endurecer tenancy, especializar el producto en la tesis Anclora y transformar el dashboard en un verdadero cockpit editorial con contexto, decisiones y trazabilidad.
