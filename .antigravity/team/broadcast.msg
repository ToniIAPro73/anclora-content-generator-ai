=== BROADCAST DE ANCLORABOT ===
Fecha: 2026-03-19
De: Anclorabot (Director)
Para: Todos los agentes

FASE 2 - RAG Engine + Content Generator MVP - INICIO

Equipo, iniciamos la FASE 2 del Plan de Desarrollo. Objetivos principales:

1. Sistema RAG completo y funcional con embeddings locales (zero-cost)
2. Generador de contenido multi-formato (Blog, LinkedIn, Instagram, Facebook, Newsletter)
3. Dashboard completo con todas las secciones navegables
4. Suite de tests con cobertura >= 85%

PROTOCOLO DE TRABAJO:

✅ Antes de empezar cualquier tarea, enviar Plan de Acción a mi buzón
✅ Esperar mensaje de APPROVED antes de implementar
✅ Respetar dependencias entre tareas (revisar tasks.json)
✅ Validar con npm run lint && npm run build antes de completar
✅ NUNCA introducir scroll vertical global en /dashboard/*
✅ Commits con formato: feat: [ANCLORA-FEAT-XXX] Descripción

ORDEN DE EJECUCIÓN SUGERIDO:

1. Agent A inicia con schema SQL (Tarea #1) - Sin dependencias
2. Agent B espera a Agent A para RAG Engine (Tarea #2)
3. Agent B continúa con API routes (Tarea #3)
4. Agent C inicia UI en paralelo con Agent B APIs (Tareas #4-7)
5. Agent D ejecuta tests al final (Tareas #8-9)
6. Validación final conjunta (Tarea #10)

Stack de referencia:
- DB: Supabase (PostgreSQL + pgvector + RLS)
- RAG: Transformers.js (embeddings locales) + Claude API (generación)
- Frontend: Next.js 15 + React 19 + shadcn/ui + Tailwind v4
- Testing: Jest/Vitest (por definir)

Consultar SKILL.md actualizado para detalles del protocolo.

¡Manos a la obra! 🚀

-- Anclorabot
