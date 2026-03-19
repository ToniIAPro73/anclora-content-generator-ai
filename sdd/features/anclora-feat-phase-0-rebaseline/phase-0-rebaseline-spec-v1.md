# ANCLORA-FEAT-000 - Phase 0 Rebaseline

Fecha: 2026-03-19
Estado: implemented

## Objetivo

Realinear el repositorio con el estado real del producto para eliminar ambiguedad documental antes de endurecer tenancy, seguridad y flujos editoriales.

## Problema

- README y documentos historicos mezclaban Supabase DB con Neon + Drizzle
- La identidad del paquete seguia en estado bootstrap (`tmp-app`)
- Los specs core estaban vacios
- La orquestacion del equipo seguia apuntando a una Fase 2 antigua como baseline

## Decision

1. Establecer una narrativa unica: Supabase Auth + Neon + Drizzle.
2. Documentar que la tenancy actual todavia necesita hardening.
3. Renombrar el paquete al nombre real del producto.
4. Rebaselinar la carpeta `sdd/` y `.antigravity/team/`.

## Entregables

- README actualizado y coherente
- Specs core de producto y arquitectura rellenos
- Feature spec de Fase 0
- Estado del equipo actualizado
- Identidad del paquete corregida

## No objetivos

- Resolver tenancy en server
- Reescribir contratos API inseguros
- Cambiar UX del dashboard mas alla de su gobernanza documental

## Validacion

- `npm run lint`
- `npm run build`
- commit por feature con convencion Anclora
