---
name: anclora-product-ux-guardian
description: Audit, redesign, and improve Anclora Content Generator AI from a product UX/UI perspective. Use this skill whenever the task touches dashboard UX, content workflows, information architecture, empty states, layout governance, mobile navigation, or alignment between Anclora's luxury real-estate strategy and the implemented interface, even if the user only asks for "mejorar la UI", "hacerla mas premium", "analizar el dashboard" or "alinear con el plan".
---

# Anclora Product UX Guardian

Use this skill to keep the product aligned with Anclora's real value proposition:

- content intelligence for luxury real estate
- market signals turned into editorial assets
- premium, calm, high-trust interface
- operational dashboards, not generic AI SaaS screens

## Core rules

1. Start by reading the current product context before proposing UI changes.
2. Prioritize the stack reality over old assumptions.
3. Respect dashboard governance:
   - no global document scroll for `/dashboard/*`
   - use `h-screen` and `overflow-hidden` at shell level
   - place scroll only inside the intended panel
4. Treat Supabase as auth and Neon as data unless the repo clearly says otherwise.
5. Flag mismatches between UI payloads, API contracts, and data models. UX is broken if the workflow looks good but fails in practice.

## Required context to inspect

Read only what you need:

- `README.md`
- `docs/Plan de Desarrollo Anclora Content Generator AI.docx` or the markdown analysis derived from it
- `src/app/dashboard/*`
- `src/components/layout/*`
- `src/app/globals.css`
- relevant API routes under `src/app/api/*`
- relevant data model files under `src/lib/db/*`

## Product lens

When reviewing or redesigning, optimize for these questions:

1. Does this screen feel like a premium control surface for Anclora?
2. Does it help the operator detect, decide, generate, review, or publish?
3. Is the flow grounded in market intelligence, micro-zones, and authority building?
4. Does the interface explain the next best action?
5. Does mobile navigation still preserve access to the workflow?

## Design direction

Favor:

- strong hierarchy
- editorial typography
- restrained but memorable accent usage
- domain-specific labels and examples
- empty states with operational guidance
- system-level consistency via tokens

Avoid:

- generic AI copy
- hardcoded random accent colors across screens
- mock content unrelated to Anclora's domain
- double scroll regions
- controls that imply persistence when nothing is saved

## Output format

When asked for analysis, return:

1. Key findings ordered by severity
2. Product implications
3. Concrete recommendations
4. If relevant, a phased improvement plan

When asked to implement changes, follow this sequence:

1. Fix broken workflow contracts first
2. Fix layout and navigation issues
3. Improve hierarchy and domain alignment
4. Improve empty states and actionability
5. Verify `lint` and `build` if possible

## Change checklist

Before finishing, verify:

- the page still works on mobile and desktop
- the dashboard shell still respects layout governance
- the content examples sound like Anclora, not a demo app
- actions map to real routes or are clearly marked as future work
- API requests still match the backend contract
