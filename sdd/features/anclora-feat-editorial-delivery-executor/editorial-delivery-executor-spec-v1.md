# Editorial Delivery Executor Spec v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-011
Owner: Anclorabot

## Objetivo

Abrir Fase 6 con una cola de ejecucion editorial real dentro de la app: visible, accionable y trazable, aunque todavia asistida por operador.

## Problema

La programacion existia, pero no habia una capa clara de entrega: no se podia distinguir entre slot pendiente, entrega ejecutada o reintento operativo.

## Alcance

1. Exponer una cola de ejecucion sobre `scheduled_posts`.
2. Permitir ejecutar manualmente una entrega pendiente desde la app.
3. Permitir reintentar entregas fallidas.
4. Hacer visible el estado de entrega en Dashboard y Metrics.
5. Mantener el flujo dentro del cockpit sin depender todavia de integraciones externas.

## Criterios de aceptacion

- `scheduled_posts` se usa como cola operativa visible.
- Dashboard muestra estado de ejecucion y permite lanzar una entrega pendiente.
- Metrics muestra el historial operativo reciente de la cola.
- Ejecutar una entrega mueve la pieza a `published` y deja traza en `scheduled_posts`.
- `lint` y `build` pasan.
