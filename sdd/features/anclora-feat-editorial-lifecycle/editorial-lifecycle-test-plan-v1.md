# Editorial Lifecycle Test Plan v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-007

## Validaciones funcionales

1. Generar una pieza en Studio y comprobar que nace como `draft`
2. Enviarla a `review`
3. Aprobarla
4. Programarla con fecha futura
5. Publicar una pieza y verificar `publishedAt`
6. Verificar que dashboard y metrics reflejan el nuevo conteo por estados

## Validaciones técnicas

- `npm run lint`
- `npm run build`
- Migración Drizzle para el enum `content_status`

## Riesgos

- Transiciones inválidas desde UI
- Duplicación de `scheduled_posts`
- Desalineación entre `generated_content.status` y `scheduled_posts.status`
