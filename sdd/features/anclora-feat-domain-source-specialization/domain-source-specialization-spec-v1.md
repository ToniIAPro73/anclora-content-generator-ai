# Domain Source Specialization Spec v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-005
Owner: Anclorabot

## Objetivo

Continuar la Fase 3 del roadmap especializando la Knowledge Base por categorias de dominio y haciendo legible la trazabilidad del retrieval dentro del flujo editorial.

## Problema

La ingesta actual distingue el origen tecnico de una fuente (`document`, `url`, `manual`), pero no su valor de negocio. Para Anclora eso es insuficiente: el operador necesita saber si una fuente alimenta tesis de mercado, regulacion, lifestyle, infraestructuras o criterio editorial.

Ademas, el Studio seguia mostrando trazas opacas basadas en `source_id`, lo que limita la auditabilidad del contenido generado.

## Alcance

1. Introducir `source_category` en `content_sources`
2. Permitir clasificar la ingesta manual, documental y Google Docs por categoria de dominio
3. Mostrar la categoria en `/dashboard/rag`
4. Enriquecer la metadata de retrieval con `title`, `category` y `similarity`
5. Renderizar la traza de retrieval de forma legible en `/dashboard/studio`
6. Rebaselinar README, core spec y tablero multiagente

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
- `lint` y `build` deben pasar
- La migracion SQL correspondiente debe quedar generada

## Fuera de alcance

- Clasificacion automatica por LLM
- Re-ranking por categoria
- Libreria persistida de plantillas Anclora
- Telemetria avanzada por categoria
