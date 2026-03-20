# Operational Recommendations Spec v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-008
Owner: Anclorabot

## Objetivo

Abrir Fase 5 con una capa de automatización prudente y auditable: recomendaciones operativas generadas desde señales reales del pipeline editorial, sin ejecutar acciones automáticamente.

## Problema

La app ya muestra métricas, cola programada y rendimiento por pieza, pero el operador todavía tiene que interpretar esas señales manualmente para decidir qué hacer después.

## Alcance

1. Crear un endpoint server-side de recomendaciones operativas
2. Generar heurísticas explicables a partir de:
   - backlog en `review`
   - backlog en `approved` sin programar
   - cola programada vacía
   - piezas publicadas con alto negocio
   - piezas con mucho tráfico pero baja eficiencia comercial
   - base de conocimiento demasiado delgada
3. Mostrar esas recomendaciones en Dashboard como capa superior de cockpit
4. Enlazar cada recomendación a una acción real dentro del producto
5. Abrir Studio en modo de accion asistida cuando la recomendacion implique revisar, refrescar, derivar o programar una pieza
6. Explicar tambien el impacto esperado para que el operador entienda por que merece ejecutar la accion

## Criterios de aceptación

- Dashboard muestra recomendaciones automáticas si existen señales suficientes
- Cada recomendación explica el porqué con lenguaje operativo y no opaco
- Cada recomendación tiene CTA navegable dentro de la app
- Las recomendaciones editoriales abren Studio con un plan de accion visible y contexto precargado cuando aplica
- Cada recomendacion explicita tambien el impacto esperado de ejecutar esa accion
- No se ejecuta ninguna automatización destructiva sin confirmación humana
- `lint` y `build` pasan

## Fuera de alcance

- Auto-publicación sin intervención humana
- Reescritura automática de contenido
- Scheduling autónomo sin aprobación
- Integración con herramientas externas de publicación
