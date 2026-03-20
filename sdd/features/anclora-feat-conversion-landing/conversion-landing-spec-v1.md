# ANCLORA-FEAT-016 — Conversion Landing

## Objetivo
Reemplazar la redirección actual de `/` por una landing page pública y premium que presente `Anclora Content Generator AI` como un sistema editorial de autoridad y convierta hacia acceso al producto.

## Alcance
- Reescribir `DESIGN.md` con directrices específicas de landing y conversión.
- Crear una skill especializada en creación de landings premium.
- Implementar una nueva home pública en `src/app/page.tsx`.
- Mantener `/login` como ruta de activación.

## Requisitos funcionales
- La home debe renderizar una narrativa de conversión completa sin depender del dashboard.
- Debe existir un CTA principal hacia `/login`.
- Debe existir como máximo un CTA secundario.
- Debe comunicar:
  - autoridad editorial
  - RAG curado
  - workflow operativo
  - medición y recomendación

## Requisitos UX
- Estética minimalista, cálida, contemporánea y premium.
- Hero memorable y fuerte.
- No apariencia de template SaaS.
- Layout mobile-first con buen comportamiento en desktop.

## Requisitos técnicos
- Reutilizar componentes del sistema cuando aporte consistencia.
- Mantener `lint` y `build` en verde.
- No introducir regresiones en login o dashboard.

## Criterios de aceptación
- `/` deja de redirigir a `/login`.
- La landing carga correctamente en local y en build.
- El CTA principal dirige al producto.
- Existe una skill reutilizable bajo `.antigravity/skills/`.
