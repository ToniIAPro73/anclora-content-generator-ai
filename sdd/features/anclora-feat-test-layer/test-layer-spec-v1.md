# Test Layer Spec v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-015
Owner: Anclorabot

## Objetivo

Crear una capa de test reutilizable para validar la app en tres niveles: unidad, componente y smoke E2E.

## Problema

La aplicación ya tiene bastante superficie funcional, pero la validación sigue dependiendo sobre todo de `lint`, `build` y prueba manual. Eso deja demasiado riesgo de regresión en auth pública, UI base y configuración RAG.

## Alcance

1. Añadir utilidades de test reutilizables para componentes React
2. Añadir tests de unidad para configuración RAG
3. Añadir tests de componente para superficies UI clave
4. Añadir smoke tests E2E para rutas públicas
5. Añadir configuración Playwright operativa para local y CI
6. Exponer scripts claros para `test:unit` y `test:smoke`

## Criterios de aceptación

- `npm run test:unit` pasa
- `npm run test:smoke` puede arrancar la app y validar `/` y `/login`
- la configuración de Playwright no depende de rutas hardcoded a Node del equipo
- existe una utilidad común para render de componentes

## Fuera de alcance

- cobertura exhaustiva de todas las APIs
- fixtures de base de datos completas
- pruebas de autenticación privada end-to-end contra Better Auth real
