# Workspace Config Persistence Spec v1

Fecha: 2026-03-20
Feature: ANCLORA-FEAT-012
Owner: Anclorabot

## Objetivo

Cerrar Fase 6 dejando persistencia real para la configuracion editorial del workspace y para la libreria de plantillas usada por el cockpit.

## Problema

La UX de `Settings` ya era coherente, pero parte de su valor seguia siendo efimero: postura del workspace y plantillas editoriales no estaban consolidadas en base de datos.

## Alcance

1. Crear `workspace_settings` en Neon.
2. Exponer API server-side para leer y actualizar la configuracion del workspace.
3. Exponer API server-side para listar y crear plantillas editoriales.
4. Conectar `Settings` a esas APIs.
5. Usar el `editorialSystemPrompt` del workspace como fallback real en generación.

## Criterios de aceptacion

- `Settings` carga datos persistidos del workspace.
- Guardar identidad o postura del modelo actualiza Neon.
- Crear una plantilla desde `Settings` la deja disponible en la libreria del workspace.
- La generación puede usar el system prompt persistido del workspace cuando no hay plantilla explícita.
- `lint` y `build` pasan.
