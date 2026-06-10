# Architecture — Backdrop

> Working title "Backdrop" (rename when you pick the repo name). This is the engineering
> blueprint, the artifact a `/architect` session would produce. Design/visual decisions
> live in `DESIGN.md`; product/strategy in `PRODUCT.md`.

## What we are building

A free, open-source, **copy-paste** library of UI backgrounds (CSS + JS/canvas). Visitors
browse backgrounds grouped into categories, **preview any one across the entire site** with
one click, and **copy its code** instantly. Contributors add a background as a single
self-contained file.

## Language we agreed on

- **Background** — one reusable visual effect. In code: one file exporting `meta`, a
  `Background` React component, and a `code` string.
- **Preview** — applying a background to the *whole site* as a live, full-page demo (not a
  thumbnail). Reversible via the floating bar or `Esc`.
- **Copy** — putting the background's `code` string on the clipboard (quick copy + toast).
- **Registry** — the central array of all backgrounds (`backgrounds/index.ts`).
- **Chrome** — the site's own UI (nav, preview bar) that floats over whatever background is
  applied; flips to light when a dark background is active (auto-contrast).

## Tech stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind v4** (`@theme` tokens)
- No backend, no database. Static site. Distribution model: copy-paste (no npm publish).
- Fonts via `next/font`: Bricolage Grotesque (display), Hanken Grotesk (body), JetBrains Mono (code).

## Folder structure

```
app/
  layout.tsx            # providers, fonts, SiteBackdrop, Nav, PreviewBar, Toaster
  page.tsx              # hero + category sections (reads the registry)
  globals.css           # OKLCH design tokens + Tailwind @theme
backgrounds/
  types.ts              # BackgroundMeta / BackgroundProps / BackgroundModule contracts
  index.ts              # registry: imports every background, exports array + helpers
  _template.tsx         # copy-me starter for contributors
  <slug>.tsx            # one file per background (meta + Background + code)
components/
  BackgroundProvider.tsx  # context: activeBackground, setActive, reset, surprise
  SiteBackdrop.tsx        # fixed full-viewport layer that renders the active background
  Nav.tsx                 # sticky chrome: wordmark, GitHub, Surprise me
  Hero.tsx                # headline + value prop + count
  CategorySection.tsx     # section heading + responsive card grid
  BackgroundCard.tsx      # live preview, hover Preview/Copy, author credit, badges
  PreviewBar.tsx          # floating pill when a background is applied
  Toast.tsx               # Toaster + toast store for "Copied!" feedback
  SurpriseButton.tsx      # applies a random background
lib/
  copy.ts                 # clipboard helper + toast trigger
PRODUCT.md · DESIGN.md · ui-registry.md   # context + as-built UI registry
README.md · CONTRIBUTING.md               # contributor docs
```

## Contracts (the core design decision)

Every background is **one file** `backgrounds/<slug>.tsx` exporting exactly three things
(see `backgrounds/types.ts`):

```ts
export const meta: BackgroundMeta;          // slug, name, category, tech, animated, isDark, author, github, tags
export function Background(p: BackgroundProps): JSX.Element;  // fills its container; { playing } gates animation
export const code: string;                  // exact text the Copy button copies
```

`backgrounds/index.ts` imports each file into a typed array. **Adding a background = create one
file + add one import line.** That one-line diff is what makes PRs trivial to review.

### Background component rules
- Fills its container (`absolute inset-0` / `100%`), never sets page layout.
- Accepts `playing?: boolean`. In the grid it's `false` until hover (cheap idle); applied
  full-page it's `true`. Static backgrounds ignore it.
- **CSS backgrounds**: self-contained scoped styles, slug-prefixed class + keyframe names.
- **JS backgrounds**: `"use client"`, canvas + `requestAnimationFrame`, loop gated on `playing`
  AND `prefers-reduced-motion`; tear down on unmount / pause.

## State & data flow

```
BackgroundProvider (React context)
  state: activeSlug | null
  actions: setActive(slug) · reset() · surprise()
  effect: sets <html data-theme="dark"> when active background's meta.isDark === true
     │
     ├── SiteBackdrop      reads activeSlug → renders <Background playing /> with crossfade
     ├── PreviewBar        visible when activeSlug !== null → Copy / Reset
     ├── BackgroundCard    calls setActive(slug) on Preview; copy(code) on Copy
     ├── SurpriseButton    calls surprise()
     └── global keydown    Esc → reset()
```

## Cross-cutting concerns

- **Performance**: live-on-hover via `playing`; canvas effects lazy-init and stop when not
  playing; backdrop uses transform/opacity only.
- **Accessibility (WCAG AA)**: keyboard path (focus card → Enter previews, Copy button, Esc
  resets), visible focus ring, reduced-motion fallbacks, auto-contrast for dark backgrounds.
- **Theming**: chrome tokens (`--chrome-*`) flip under `[data-theme="dark"]`; background tokens
  never change — backgrounds own their own color.

## Out of scope (v1)

Code-format tabs (CSS/Tailwind/React), search + tag filters, favorites, auto-discovery
registry, fonts section, npm package. Tracked for later.

## Build order

See `CHECKLIST.md` — the step-by-step execution list, tagged by which skill (impeccable / JSM /
build) drives each step.
