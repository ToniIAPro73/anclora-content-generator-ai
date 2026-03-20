# Editorial Lifecycle Spec v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-007
Owner: Anclorabot

## Objetivo

Abrir la Fase 4 del roadmap implementando un ciclo editorial persistido y accionable sobre el contenido generado.

## Problema

La app ya genera contenido y lo persiste como `draft`, pero el operador todavia no puede mover esa pieza a estados intermedios de trabajo editorial ni programarla o publicarla con una trazabilidad clara.

## Alcance

1. Introducir el estado `review` en `generated_content`
2. Exponer un endpoint server-side para listar y actualizar el estado editorial
3. Permitir desde Studio:
   - enviar a revision
   - aprobar
   - publicar ahora
   - programar
4. Exponer señales de ciclo editorial en dashboard y metricas

## Estados de la primera iteracion

- `draft`
- `review`
- `approved`
- `scheduled`
- `published`
- `archived`

## Criterios de aceptacion

- El estado de una pieza cambia de forma persistida en DB
- Programar una pieza crea una entrada en `scheduled_posts`
- Publicar una pieza actualiza `publishedAt`
- Dashboard y Metrics muestran al menos `draft`, `review`, `approved`, `scheduled`, `published`
- `lint` y `build` pasan

## Fuera de alcance

- Scheduler real de ejecución externa
- Publicación automática en canales
- Integración CRM o lead attribution
