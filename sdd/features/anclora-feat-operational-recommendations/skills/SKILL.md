# Operational Recommendations Skill

## Objetivo

Abrir Fase 5 con una capa de recomendaciones operativas auditables para que Dashboard actue como cockpit y no solo como espejo de metricas.

## Flujo

1. Leer señales reales del pipeline editorial, la cola programada, el rendimiento por pieza y la densidad del RAG.
2. Traducir esas señales a recomendaciones concretas y justificadas.
3. Priorizar bloqueos de operacion antes que optimizaciones secundarias.
4. Enlazar cada recomendacion a una accion existente dentro del producto.
5. Validar `lint` y `build` antes de cerrar la iteracion.
