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
   - reprogramar sin duplicar slots
   - cancelar programacion
4. Exponer señales de ciclo editorial en dashboard y metricas
5. Mostrar la cola editorial programada como vista operativa de la fase
6. Introducir una primera capa de telemetria por pieza y por canal usando `content_metrics`

## Estados de la primera iteracion

- `draft`
- `review`
- `approved`
- `scheduled`
- `published`
- `archived`

## Criterios de aceptacion

- El estado de una pieza cambia de forma persistida en DB
- Programar una pieza crea o actualiza una unica entrada activa en `scheduled_posts`
- Cancelar una programacion marca el slot pendiente como `cancelled` y devuelve la pieza a `approved`
- Publicar una pieza actualiza `publishedAt`
- Dashboard y Metrics muestran al menos `draft`, `review`, `approved`, `scheduled`, `published`
- Dashboard y Metrics hacen visible la cola programada proxima
- Metrics expone al menos rendimiento por canal y ranking basico de piezas con traccion
- `lint` y `build` pasan

## Fuera de alcance

- Scheduler real de ejecución externa
- Publicación automática en canales
- Integración CRM o lead attribution
