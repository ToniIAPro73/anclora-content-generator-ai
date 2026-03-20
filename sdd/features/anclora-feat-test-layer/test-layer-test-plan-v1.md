# Test Layer Test Plan v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-015

## Objetivo

Validar que la nueva capa de test detecta regresiones básicas del producto sin depender de revisión manual.

## Casos

1. Unidad
- Configuración RAG: defaults, fallback y compatibilidades

2. Componente
- `SurfaceCard`: variantes `panel` e `inner`
- `LoginPage`: branding, cambio de modo y error de autenticación mostrado

3. Smoke E2E
- `/` redirige a `/login`
- `/login` renderiza branding y permite alternar a registro

## Validación esperada

- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `npm run test:smoke`
