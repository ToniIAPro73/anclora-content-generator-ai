# Domain Source Specialization Test Plan v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-005

## Validaciones funcionales

1. Crear una fuente manual con categoria `editorial`
2. Importar un PDF con categoria `market`
3. Importar un Google Doc con categoria `regulation`
4. Verificar que `/api/rag/sources` devuelve `category`
5. Verificar que `/dashboard/rag` renderiza badges de categoria
6. Generar una pieza con RAG y comprobar que el Studio muestra `title`, `category` y similitud de las fuentes recuperadas

## Validaciones tecnicas

- `npm run lint`
- `npm run build`
- Generacion de migracion Drizzle para `source_category`

## Riesgos a vigilar

- Valores de categoria no validos enviados por cliente
- Incompatibilidad con fuentes antiguas sin categoria
- Metadata de retrieval demasiado verbosa en el panel de Studio
