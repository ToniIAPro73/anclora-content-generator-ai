---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of visually stunning, production-grade frontend interfaces. Every output must feel handcrafted — the kind of design that earns a "how did you do this?" reaction. Avoid anything that looks auto-generated, template-based, or generic.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

---

## Phase 1: Design Intent (Before Any Code)

Before writing a single line, define the design DNA of this interface. This is non-negotiable.

### 1. Establish Context
- **Who uses this?** A busy developer? A creative director? A customer browsing at 2am on mobile?
- **What emotion should it trigger?** Confidence? Curiosity? Calm? Delight?
- **What's the single unforgettable detail** — the thing someone screenshots and shares?

### 2. Choose an Aesthetic Archetype

Commit to ONE strong direction. Do not blend carelessly — contrast is intentional, not accidental.

| Archetype | Signature Qualities |
|-----------|-------------------|
| **Noir Editorial** | High contrast black/cream, serif headlines, horizontal rules, editorial spacing |
| **Kinetic Brutalism** | Raw grids, clashing type scales, utility-first but purposefully broken |
| **Soft Futurism** | Muted gradients, glassmorphism with restraint, generous whitespace, thin sans-serif |
| **Warm Artisan** | Earthy palette, hand-drawn accents, variable-weight type, textured backgrounds |
| **Cold Systems** | Monospace everywhere, terminal-green or steel-blue, data-dense, zero decoration |
| **Luxe Minimal** | Single accent color, extreme whitespace, oversized type, precise kerning |
| **Neo Organic** | Blobby shapes, nature-derived colors, playful but not childish, fluid borders |
| **Retro Digital** | Pixel-adjacent, CRT glow, limited palette, 80s/90s grid systems reinterpreted |

Choose one, then break one rule from it intentionally. That's the signature.

### 3. Define the Color System (Before Touching CSS)

Never pick colors randomly. Build a system:

```
Base (background): ___________
Surface (cards, modals): ___________
Accent 1 (primary action, highlight): ___________
Accent 2 (contrast or complement): ___________
Text primary: ___________
Text muted: ___________
Border / divider: ___________
```

**Rules:**
- Maximum 5 named colors. Everything else is opacity variations.
- One color must be unexpected — the one that makes the palette alive.
- Test the palette mentally: does it work in dark? in light? at small sizes?
- Avoid: purple-on-white, teal-on-dark-gray, orange-on-black (overused tropes).

### 4. Typography Contract

Set this before coding:

- **Display font**: The personality. Dramatic, characterful, high optical impact. (e.g., Playfair Display, DM Serif Display, Instrument Serif, Syne, Bebas Neue, Cabinet Grotesk)
- **Body font**: The workhorse. Readable at 14-16px, harmonizes with display. (e.g., Literata, Lora, DM Sans, Nunito, Fraunces, Bricolage Grotesque)
- **Mono font** (if needed): Code, labels, data. (e.g., JetBrains Mono, Fira Code, Berkeley Mono)

**Scale with purpose** — not every heading needs to be large. Use scale to direct attention, not to fill space.

**FORBIDDEN**: Inter, Roboto, Arial, Helvetica Neue as primary fonts. These are infrastructure, not personality.

---

## Phase 2: Spatial & Layout Principles

### Composition Over Symmetry

Great layouts have tension. Use these deliberately:

- **The anchor** — one dominant element (massive type, hero image, bold block) that everything else orbits
- **The breathe zone** — intentional whitespace that makes the anchor feel powerful, not lonely
- **The surprise** — one element that breaks the grid: overlapping columns, rotated text, full-bleed edge element
- **The rhythm** — repeating visual motif (a line, a dot, a spacing unit) that creates cohesion

### Spacing System

Use a consistent base unit (8px recommended). Every spacing value is a multiple: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Never use arbitrary values like 13px or 37px.

### Responsive Intent

Define how the layout *feels* at different sizes, not just how it reflows:
- Mobile: One column, focal hierarchy, reduced decoration
- Tablet: Reveal a second column, hint at the desktop layout
- Desktop: Full spatial composition, all visual details activated

---

## Phase 3: Motion & Interaction Design

Motion communicates, it doesn't decorate. Every animation must have a reason.

### Principles

1. **Entrance choreography**: Elements don't just appear — they arrive. Staggered reveals (80-120ms delay between items) with `opacity + translateY` or `scale` create perceived polish at zero cost.
2. **State transitions**: Hover, focus, active states must be smooth (`transition: all 200ms ease`). Never jump.
3. **Scroll storytelling**: Elements that animate on scroll feel alive. Use `IntersectionObserver` or CSS scroll-driven animations for this.
4. **Micro-interactions**: Button presses compress slightly (`scale: 0.97`). Inputs glow on focus. Icons rotate or morph on toggle. Small, precise, satisfying.
5. **Performance first**: Animate `transform` and `opacity` only. Never animate `width`, `height`, `top`, `left` — they trigger layout recalculation.

### Timing Reference

| Feel | Duration | Easing |
|------|----------|--------|
| Instant feedback | 80-120ms | ease-out |
| State change | 150-250ms | ease-in-out |
| Panel/modal open | 250-350ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Page transition | 400-600ms | ease-in-out |
| Ambient / looping | 2000ms+ | linear or ease-in-out |

---

## Phase 4: Texture, Depth & Atmosphere

Flat is boring. Dimensionality is achieved through:

### Background Treatments
- **Gradient mesh**: Multiple radial gradients overlapping at different opacities — creates depth without noise
- **Noise overlay**: `filter: url(#noise)` or SVG noise texture at 3-8% opacity adds grain/physicality
- **Grid/dot pattern**: `background-image: radial-gradient(circle, color 1px, transparent 1px)` — clean, geometric, versatile
- **Blurred blobs**: Large blurred color masses behind content create soft ambient glow
- **CSS `backdrop-filter: blur()`**: Glassmorphism — use sparingly, only on floating surfaces

### Shadow Language

Shadows should be designed, not defaulted:
```css
/* Realistic ambient + key light */
box-shadow:
  0 1px 2px rgba(0,0,0,0.04),
  0 4px 8px rgba(0,0,0,0.06),
  0 12px 24px rgba(0,0,0,0.08);

/* Colored shadow (brand-aware) */
box-shadow: 0 8px 32px rgba(var(--accent-rgb), 0.3);

/* Inner depth */
box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2);
```

### Border as Design Element

Borders are not just separators — they can be:
- Single-side accents (`border-left: 3px solid var(--accent)`)
- Gradient borders via `border-image` or pseudo-element tricks
- Animated via `outline` or `box-shadow` on interaction

---

## Phase 5: Component Craft

Every component must be designed, not assembled. For each UI element:

### Cards
- Define the card's "ground level" — is it elevated (shadow), embedded (inset), or floating (glassmorphism)?
- Header/content/footer zones should have clear visual weight differences
- Hover state must feel intentional: lift (translateY -2px + larger shadow) or glow (colored border or shadow)

### Buttons
- Primary: High contrast, full background fill, slight border-radius that matches design language
- Secondary: Outlined or ghost — must be clearly interactive without competing with primary
- Tertiary: Text-only, subtle underline or color change on hover
- All buttons: `active:scale-[0.97]` press feedback, minimum 44px touch target on mobile

### Forms & Inputs
- Floating labels are overdone — use clear label-above-field with proper spacing instead
- Focus states must be visible and beautiful (colored ring, not default browser outline)
- Validation states: success (green left border), error (red with helper text), loading (shimmer or spinner)
- Group related fields visually — borders, background sections, or spacing clusters

### Navigation
- Mobile nav: Full-screen overlay OR compact bottom bar — never a hamburger without thought
- Desktop nav: Decide between sticky (always present), static (scroll away), or hybrid (scrolls away, returns on scroll up)
- Active states must be unambiguous

### Data Display (Tables, Lists, Charts)
- Tables: Alternate row backgrounds subtly, sticky header on long tables, clear column alignment (numbers right-aligned)
- Empty states: Always design the empty state — it's a first impression for new users
- Loading states: Skeleton screens over spinners — they feel faster and more intentional

---

## Phase 6: Personality Details

These are what separate "good" from "remarkable":

- **Custom scrollbar** matching the palette (`scrollbar-color: var(--accent) transparent`)
- **Selection color** (`::selection { background: var(--accent); color: var(--bg); }`)
- **Cursor customization** for interactive zones (pointer, grab, crosshair — not just default)
- **Focus-visible** styles that are beautiful, not just functional (`outline: 2px solid var(--accent); outline-offset: 3px`)
- **Print styles** if the content might be printed (optional but impressive)
- **Reduced motion respect** (`@media (prefers-reduced-motion: reduce)` — disable animations gracefully)
- **Dark mode token system** — define CSS vars at `:root` and override at `[data-theme="dark"]` or `@media (prefers-color-scheme: dark)`

---

## Anti-Patterns: Never Do These

| Pattern | Why It Fails | Alternative |
|---------|-------------|-------------|
| Purple gradient hero on white | Seen 10,000 times, signals no design thought | Pick an unexpected base color |
| Card grid with identical spacing everywhere | No visual hierarchy | Vary card sizes, add featured slots |
| Centered everything | Predictable, lacks tension | Anchor to a side, create asymmetry |
| Shadow on everything | Loses meaning | Reserve shadows for interactive/elevated elements |
| Animations on every element | Visually exhausting | Choreograph 2-3 key moments only |
| 6+ font weights in use | Chaotic hierarchy | 3 weights max: regular, medium, bold |
| Generic icon sets (Font Awesome defaults) | Cookie-cutter | Use Lucide, Phosphor, or custom SVG |
| Placeholder lorem ipsum left in | Destroys credibility | Always use realistic content |

---

## Execution Checklist

Before submitting any design implementation:

- [ ] Is the color palette a deliberate system, not random picks?
- [ ] Is the typography using a characterful display font, not a default?
- [ ] Does the layout have ONE dominant focal element?
- [ ] Is there at least one "unexpected" detail that creates personality?
- [ ] Do all interactive elements have hover AND focus AND active states?
- [ ] Are animations using only `transform` and `opacity`?
- [ ] Is there a designed empty/loading state for dynamic content?
- [ ] Does it respect `prefers-reduced-motion`?
- [ ] Does it work at 375px mobile width?
- [ ] Is every spacing value a multiple of 4 or 8?

---

**Philosophy**: The best interfaces feel inevitable in retrospect — as if they couldn't have been designed any other way. That's the standard. Not "looks good for AI output." Looks good, period.
