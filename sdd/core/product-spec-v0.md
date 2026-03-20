# Product Spec v0

Fecha: 2026-03-19
Estado: vigente tras rebaseline de Fase 0

## Producto

Anclora Content Generator AI es el motor editorial y de inteligencia de contenido de Anclora Private Estates. Su objetivo no es solo generar textos, sino convertir senales de mercado, micro-zonas y activos de conocimiento en piezas editoriales de alta autoridad para real estate de lujo.

## Usuario operador

- Equipo interno de marketing y direccion
- Operadores editoriales que detectan oportunidades, generan piezas, revisan, aprueban y distribuyen

## Propuesta de valor

- Traducir inteligencia inmobiliaria hiperlocal en contenido util y premium
- Unificar research, generacion, contexto RAG y seguimiento editorial
- Reducir dependencia de herramientas dispersas para briefing, redaccion y contexto

## Capacidades actuales

- Dashboard operativo con shell propio
- Studio de generacion de contenido
- Knowledge base y primeras rutas de ingesta
- Metricas basicas
- RAG local con embeddings y almacenamiento vectorial

## Capacidades pendientes prioritarias

- Hardening de tenancy e identidad
- Persistencia y flujos editoriales mas claros
- Especializacion de fuentes y micro-zonas
- Telemetria por contenido, canal y territorio

## Restricciones clave

- En `/dashboard/*` no puede haber scroll global del documento
- La autenticacion depende de Better Auth sobre Neon
- La persistencia operativa depende de Neon + Drizzle
- La seguridad multi-tenant aun requiere cierre adicional en server
