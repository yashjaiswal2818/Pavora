# Build Checklist — Backdrop

Execute one step at a time. Each step is tagged with the skill that drives it:
**[impeccable]** craft/design · **[JSM]** engineering process · **[build]** plain implementation.
After each UI component, run **[JSM] /imprint**. At end of session, **[JSM] /remember save**.

Legend: `[x]` done · `[ ]` to do

---

## Phase 0 — Make the toolchain work together (one-time)

- [x] **0.1 [setup]** Install JSM skills into `.claude/skills/` so `/architect`, `/review`,
  `/imprint`, `/recover`, `/remember` are invocable alongside `/impeccable`
  (symlinked from `skills/skills/*`).
- [x] **0.2 [setup]** Confirm combined workflow (this file + ARCHITECTURE.md).

## Phase 1 — Foundation (mostly done during scaffold)

- [x] **1.1 [build]** Scaffold Next.js 16 + Tailwind v4 + TS.
- [x] **1.2 [impeccable]** Write `PRODUCT.md` (register, users, principles, anti-refs).
- [x] **1.3 [impeccable]** Write `DESIGN.md` (OKLCH palette, fonts, components, motion).
- [x] **1.4 [JSM /architect]** Write `ARCHITECTURE.md` (engineering blueprint).
- [x] **1.5 [impeccable]** Design tokens + reset in `app/globals.css` (OKLCH, `@theme`).
- [x] **1.6 [impeccable]** Fonts + provider wiring in `app/layout.tsx`.
- [x] **1.7 [build]** Background contracts in `backgrounds/types.ts`.

> Note: the app will NOT compile until Phase 3 + 4 exist (layout imports components/backgrounds
> not yet created). That's expected; we wire bottom-up next.

## Phase 2 — Background registry

- [x] **2.1 [build]** `backgrounds/_template.tsx` — the copy-me starter for contributors.
- [x] **2.2 [build]** `backgrounds/index.ts` — registry array + `byCategory` / `getBySlug` helpers.

## Phase 3 — Core mechanism (the "apply to whole site" feature)

- [x] **3.1 [build]** `lib/copy.ts` — clipboard + toast trigger.
- [x] **3.2 [build]** `components/Toast.tsx` — Toaster + toast store.
- [x] **3.3 [build]** `components/BackgroundProvider.tsx` — context, `setActive/reset/surprise`,
  auto-contrast effect, global `Esc` handler.
- [x] **3.4 [build]** `components/SiteBackdrop.tsx` — full-viewport layer + crossfade.
- [x] **3.5 [JSM /imprint]** Capture patterns from Toast (first chrome component) → `ui-registry.md`.

## Phase 4 — UI components

- [x] **4.1 [impeccable]** `components/Nav.tsx` — sticky chrome. → imprinted
- [x] **4.2 [impeccable]** `components/PreviewBar.tsx` — floating pill. → imprinted
- [x] **4.3 [impeccable]** `components/SurpriseButton.tsx`.
- [x] **4.4 [impeccable]** `components/BackgroundCard.tsx` — the key component (live preview,
  hover Preview/Copy, credit, badges). → imprinted
- [x] **4.5 [impeccable]** `components/CategorySection.tsx`. → imprinted
- [x] **4.6 [impeccable]** `components/Hero.tsx`. (+ shared `lib/site.ts`, `components/icons.tsx`)

## Phase 5 — Starter backgrounds (8, mix of CSS + JS, light + dark)

- [x] **5.1 [impeccable]** Gradients: `sunset-drift` (dark), `peachy-glow` (light)
- [x] **5.2 [impeccable]** Mesh: `aurora-veil` (dark), `cotton-candy` (light)
- [x] **5.3 [impeccable]** Patterns: `dot-matrix` (light), `blueprint-grid` (light)
- [x] **5.4 [impeccable]** Particles (JS/canvas): `constellation` (dark), `starfield` (dark)
- [x] **5.5 [build]** Register all 8 in `backgrounds/index.ts`. (`tsc --noEmit` clean)

## Phase 6 — Assemble & verify

- [x] **6.1 [build]** `app/page.tsx` — hero + a `CategorySection` per category from the registry.
- [x] **6.2 [impeccable /audit]** Run dev server, screenshot, verify: hover plays, click applies
  full-page, copy+toast, Esc/Reset, auto-contrast on dark, reduced-motion, responsive.
  (Found + fixed a corrupted `.next` cache that blocked hydration; added `app/global-error.tsx`
  + `allowedDevOrigins`. Contrast scan flagged accent-ink-on-accent 2.76, but that pair is never
  used for text — accent is decorative only [logo gradient, dot, icon] — so it's a non-issue.)
- [x] **6.3 [JSM /review]** 3-layer review: plan-alignment, system-integrity, production-readiness.
  (Ran a 6-dimension adversarial review workflow on the shadcn integration: 17 raised →
  11 confirmed → fixed. Production `next build` clean.)
- [x] **6.4 [build]** Fix anything the two reviews surface. (All 7 distinct findings fixed:
  dark-palette text flip, sr-only header placement, Esc-vs-reset guard, swatch perf,
  shadow-float utility, shortcut tracking, keycap color-mix.)

## Phase 6.5 — shadcn surgical integration (user request, mid-build)

- [x] **6.5.1 [architect]** Plan: surgical-elevate, theme shadcn to OKLCH palette, no token renames.
- [x] **6.5.2 [build]** Foundation: deps, `lib/utils.ts`, `components.json`, globals.css bridge
  (`--color-*` → Backdrop tokens; flipping `--sd-*` overlay tokens).
- [x] **6.5.3 [build]** Primitives: `components/ui/{button,dialog,command,tabs,tooltip,sonner}.tsx`.
- [x] **6.5.4 [impeccable]** Features: ⌘K CommandPalette, CodeDialog+Tooltips, Sonner, Tabs filter.
- [x] **6.5.5 [JSM /review]** Adversarial workflow review + fixes (see 6.3/6.4).
- [x] **6.5.6 [JSM /imprint]** Captured shadcn bridge + 5 component patterns → `ui-registry.md`.

## Phase 7 — Open-source readiness

- [x] **7.1 [build]** `README.md` — what it is, screenshot, run locally, how to use a background.
  (Screenshot captured live → `.github/screenshot.png`.)
- [x] **7.2 [build]** `CONTRIBUTING.md` — fork → copy `_template.tsx` → fill 3 exports → add one
  import line → open PR. Include the review/test workflow (`gh pr checkout`).
- [x] **7.3 [build]** LICENSE (MIT), basic issue/PR template (optional). (+ background-idea template.)
- [x] **7.4 [JSM /imprint audit]** Final consistency sweep across all components → `ui-registry.md`.
  (1 deviation fixed: `CommandShortcut` default `tracking-widest` → `tracking-normal`.)

## Phase 8 — Ship

- [x] **8.1 [build]** `git init`, first commit. (Own repo on `main`; skills/.claude/dev-scripts
  gitignored; package renamed `backdrop`.)
- [ ] **8.2 [setup]** Create GitHub repo (`gh repo create`) + push. *(You drive the repo name.)*
  → After creating: update `lib/site.ts` github URL + README clone URL, commit, push.
- [x] **8.3 [JSM /remember save]** Snapshot session state to `memory.md`. (gitignored — local state)

---

## The recurring loop (pin these habits)

```
/architect → build → /imprint (per UI component) → /review → /impeccable audit → ship
   /remember save (end)  ·  /remember restore (start)  ·  /recover (when stuck)
```
