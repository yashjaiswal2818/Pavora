# Contributing

The main way to contribute is **adding a background** — one new file and one import line. It makes a great first open-source PR.

## Project structure

```
app/
  layout.tsx     providers, fonts, and the global chrome (nav, preview bar, ⌘K palette)
  page.tsx       hero + the gallery
  globals.css    OKLCH design tokens — the single source for color, spacing, radius
backgrounds/
  types.ts       the BackgroundMeta / BackgroundModule contract
  index.ts       the registry: every background is imported and listed here
  _template.tsx  copy this to start a new background
  <slug>.tsx     one file per background — meta + Background + code
components/       the gallery UI (cards, sections, providers, palette)
  ui/             shadcn primitives, themed to the tokens in globals.css
lib/              small helpers (clipboard, site config)
```

The site renders straight from `backgrounds/index.ts`, so a new background is a one-line diff there plus your file. That's what keeps PRs easy to review.

## Add a background

### 1. Set up

```bash
git clone https://github.com/<you>/Pavora
cd Pavora
npm install
npm run dev        # http://localhost:3000
```

### 2. Copy the template

```bash
cp backgrounds/_template.tsx backgrounds/<your-slug>.tsx
```

Use a short, kebab-case slug (e.g. `midnight-haze`) that matches the filename.

### 3. Fill in the three exports

Each file exports `meta`, a `Background` component, and a `code` string (see [backgrounds/types.ts](backgrounds/types.ts)).

**`meta`**

- `slug` — matches the filename, unique
- `name` — display name, e.g. "Midnight Haze"
- `category` — `Gradients` · `Mesh` · `Patterns` · `Particles`
- `tech` — `"css"` or `"js"` (canvas/JS effects)
- `isDark` — `true` if the background is dark, so the chrome flips to stay readable over it

**`Background`** — a component that fills its container (`position: absolute; inset: 0`).

- Accept `playing` and pause animation when it's `false` — cards stay paused until hover. Static backgrounds can ignore it.
- Keep styles self-contained, and prefix class and keyframe names with your slug so nothing collides.
- Give every animation a `@media (prefers-reduced-motion: reduce)` fallback.

**`code`** — the exact snippet people copy. It must be self-contained and paste-ready, with no imports from this repo. A single CSS class is the simplest shape; a small component is fine for JS effects.

### 4. Register it

Add one import and one array entry in [backgrounds/index.ts](backgrounds/index.ts):

```ts
import * as midnightHaze from "./midnight-haze";

const modules = [
  // ...existing
  midnightHaze,
];
```

Order within a category is the order on the page.

### 5. Check it

- `npx tsc --noEmit` and `npm run lint` pass
- The card plays on hover, clicking applies it full-page, `Esc` resets, and Copy gives working code
- If `isDark`, the nav and preview bar stay readable over it
- Animation stops under reduced motion (DevTools → Rendering → Emulate `prefers-reduced-motion`)

### 6. Open a PR

One background per PR. A screenshot or short clip in the description helps a lot.

## Design tokens

Color, spacing, radius, and shadows live as OKLCH custom properties in [app/globals.css](app/globals.css). Use them (`var(--surface)`, `var(--radius-lg)`, …) instead of hard-coded values so the UI stays consistent. Backgrounds are the exception — they own their own color and are self-contained by design.

## Bigger changes

Bug fixes, accessibility improvements, and docs are all welcome. For anything larger than a background — new UI, a new category, a feature — open an issue first so we can talk it through.

By contributing, you agree your work is released under the [MIT License](LICENSE).
