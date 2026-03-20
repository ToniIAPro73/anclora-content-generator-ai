# Domain Source Specialization Spec v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-005
Owner: Anclorabot

## Objetivo

Cerrar la Fase 3 del roadmap especializando la Knowledge Base por categorias de dominio, conectando el Studio a los activos persistidos del workspace y haciendo explotable la capa de micro-zonas.

## Problema

La ingesta actual distingue el origen tecnico de una fuente (`document`, `url`, `manual`), pero no su valor de negocio. Para Anclora eso es insuficiente: el operador necesita saber si una fuente alimenta tesis de mercado, regulacion, lifestyle, infraestructuras o criterio editorial.

Ademas, el Studio seguia mostrando trazas opacas basadas en `source_id`, lo que limita la auditabilidad del contenido generado.

## Alcance

1. Introducir `source_category` en `content_sources`
2. Permitir clasificar la ingesta manual, documental y Google Docs por categoria de dominio
3. Mostrar la categoria en `/dashboard/rag`
4. Enriquecer la metadata de retrieval con `title`, `category` y `similarity`
5. Renderizar la traza de retrieval de forma legible en `/dashboard/studio`
6. Persistir `micro_zone_id` en `generated_content`
7. Exponer `GET/POST /api/micro-zones` para que el workspace gobierne su mapa hiperlocal
8. Conectar el Studio a plantillas reales de `/api/content/templates`
9. Conectar el Studio y Settings a micro-zonas persistidas
10. Rebaselinar README, core spec y tablero multiagente

## Categorias iniciales

- `market`
- `regulation`
- `lifestyle`
- `infrastructure`
- `editorial`
- `general`

## Criterios de aceptacion

- Toda nueva fuente creada desde UI o endpoint debe persistir `source_category`
- La tabla de fuentes en RAG debe exponer la categoria de dominio
- El Studio no debe mostrar ids tecnicos como unica referencia de retrieval
- El Studio debe listar plantillas persistidas filtradas por canal
- Cada nueva pieza puede vincularse a una micro-zona real y la relación queda persistida
- Settings debe permitir crear y visualizar micro-zonas del workspace
- `lint` y `build` deben pasar
- La migracion SQL correspondiente debe quedar generada

## Estado de cierre

La fase queda cerrada cuando el operador puede:

- clasificar fuentes por dominio
- auditar retrieval con trazas legibles
- reutilizar plantillas persistidas por canal
- vincular cada pieza a una micro-zona gobernada por el workspace
