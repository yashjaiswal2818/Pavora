# Contributing to Backdrop

Thanks for being here! The main way to contribute is **adding a background** — it's one file plus one import line, and your name + GitHub link appear on the card. A perfect first open-source PR.

## Add a background (the 10-minute walkthrough)

### 1. Fork & set up

```bash
# fork on GitHub, then:
git clone https://github.com/<your-username>/backdrop
cd backdrop
npm install
npm run dev   # http://localhost:3000
```

### 2. Copy the template

```bash
cp backgrounds/_template.tsx backgrounds/<your-slug>.tsx
```

Pick a short, kebab-case slug (e.g. `midnight-haze`). The slug must match the filename.

### 3. Fill in the 3 exports

Every background module exports exactly three things (see [backgrounds/types.ts](backgrounds/types.ts)):

1. **`meta`** — describes your background to the gallery:
   - `slug` — must equal the filename (without `.tsx`) and be unique
   - `name` — display name, e.g. "Midnight Haze"
   - `category` — `"Gradients" | "Mesh" | "Patterns" | "Particles"`
   - `tech` — `"css"` for pure CSS, `"js"` for canvas/JS effects
   - `animated` — does it move?
   - `isDark` — `true` flips the site chrome to light when applied full-page
   - `author` + `github` — your credit on the card
   - `tags` — a few descriptive words

2. **`Background`** — a React component that fills its container (`position: absolute; inset: 0`). Rules:
   - Accept `playing` and pause animations when it's `false` (the grid pauses cards until hover). Static backgrounds can ignore it.
   - Keep styles self-contained; prefix class and keyframe names with your slug so backgrounds never collide.
   - **Reduced motion is mandatory**: every animation needs a `@media (prefers-reduced-motion: reduce)` fallback (static frame is fine).

3. **`code`** — the exact snippet the Copy button gives people. It must be **self-contained and paste-ready**: no imports from this repo. A single CSS class is the simplest shape; component code is fine for JS effects.

### 4. Register it (one line, well, two)

In [backgrounds/index.ts](backgrounds/index.ts):

```ts
import * as midnightHaze from "./midnight-haze";

const modules: BackgroundModule[] = [
  // ...existing entries
  midnightHaze,
];
```

Order within a category = order on the page.

### 5. Check it

- `npx tsc --noEmit` passes
- `npm run lint` passes
- In the browser: the card plays on hover, clicking applies it full-page, `Esc` resets, Copy gives working code
- If `isDark: true`, confirm the nav/preview bar flip to light and stay readable
- Animations stop under reduced motion (toggle it in DevTools → Rendering → Emulate CSS `prefers-reduced-motion`)

### 6. Open a PR

One background per PR, please. Include a screenshot or short clip of the background in the PR description.

## What we look for in review

- The background looks great at **full-page scale**, not just in a thumbnail (that's the whole product).
- The copied code works when pasted into a fresh project.
- Reduced-motion fallback exists.
- Reasonable performance: no layout thrash; canvas effects use `requestAnimationFrame` and stop when `playing` is `false`.

## Reviewing / testing someone's PR locally

```bash
gh pr checkout <number>
npm install
npm run dev
```

Try the full flow: hover → preview full-page → copy → Esc.

## Other contributions

Bug fixes, accessibility improvements, and docs are all welcome. For anything bigger than a background (new UI, new category, new feature), open an issue first so we can talk it through.

## House rules

- Be kind; this is a beginner-friendly repo.
- Match the existing code style (TypeScript, self-contained styles, design tokens in `app/globals.css`).
- By contributing you agree your work is released under the [MIT License](LICENSE).
