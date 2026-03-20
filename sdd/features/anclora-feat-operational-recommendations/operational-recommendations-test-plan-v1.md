# Operational Recommendations Test Plan v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-008
Owner: Anclorabot

## Objetivo

Validar que la primera capa de automatizacion prudente traduzca senales reales del sistema en recomendaciones navegables, sin ejecutar acciones automaticas.

## Casos

1. `GET /api/automation/recommendations` devuelve `200` y lista vacia si no hay señales suficientes.
2. Si existe backlog en `review`, la API devuelve una recomendacion `review_backlog` con CTA al Studio.
3. Si existe backlog en `approved` y la cola programada esta vacia, la API devuelve `schedule_gap`.
4. Si una pieza tiene leads o conversiones, la API puede proponer `repurpose_winner`.
5. Si una pieza tiene views altas y cero leads, la API puede proponer `cta_optimization`.
6. Si la base de conocimiento es delgada, la API devuelve `knowledge_gap` con CTA a RAG.
7. Dashboard renderiza las recomendaciones si existen y cae al bloque de senales de mercado si no existen.
8. Ninguna recomendacion ejecuta cambios persistentes sin accion humana explicita.
9. `npm run lint` pasa.
10. `npm run build` pasa.
