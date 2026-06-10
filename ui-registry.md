# UI Registry — Backdrop

The as-built record of visual patterns. Every new component should match what's
already here. Captured via `/imprint` after each UI component.

> **Note on format:** Backdrop's own chrome (nav, cards, hero, preview bar) is
> styled with scoped `<style>` + design tokens (`var(--…)` from
> `app/globals.css`). As of the shadcn integration, the `components/ui/*`
> primitives (command palette, dialog, tabs, tooltip, sonner) use Tailwind
> utility classes — but those resolve to the **same tokens** via the shadcn
> bridge (see "shadcn bridge" below). So `bg-popover` and `var(--sd-popover)`
> are the same surface. Source of truth: `DESIGN.md` + `app/globals.css`.

## Token quick-reference (from globals.css)

| Token | Value | Meaning |
| --- | --- | --- |
| `--bg` | `oklch(1 0 0)` | page base (white) |
| `--surface` | `oklch(0.976 0.003 256)` | cards/panels |
| `--surface-2` | `oklch(0.955 0.004 256)` | hover/code bg |
| `--border` | `oklch(0.916 0.005 256)` | hairlines |
| `--ink` | `oklch(0.21 0.02 256)` | text |
| `--muted` | `oklch(0.52 0.018 256)` | secondary text |
| `--primary` | `oklch(0.55 0.18 256)` | cobalt — buttons/links |
| `--accent` | `oklch(0.7 0.17 38)` | coral — highlights |
| `--radius-md` / `--radius-lg` / `--radius-full` | `12px` / `20px` / `999px` | radii |
| `--shadow-card` / `--shadow-lift` / `--shadow-float` | — | elevation steps |
| chrome tokens `--chrome-*` | flip under `[data-theme="dark"]` | floating UI over backgrounds |

---

### Toast (Sonner)

File: `components/ui/sonner.tsx` (replaced the old hand-rolled `Toast.tsx`)
Last updated: 2026-06-10

| Property | Value |
| --- | --- |
| Background | `var(--sd-popover)` (via `--normal-bg`) — flips dark with chrome |
| Text — primary | `var(--sd-popover-foreground)`, `font-weight: 600`, `var(--font-sans)` |
| Border | `var(--sd-border)` (via `--normal-border`) |
| Border radius | `var(--radius-full)` (via `--border-radius`) |
| Shadow | `var(--shadow-float)` (arbitrary utility `shadow-[var(--shadow-float)]`) |
| Position | `bottom-right`, `offset={24}` |
| Success icon | Sonner default check (green) |

**Pattern notes:**
- Toasts are fired from `lib/copy.ts` via `toast.success()` / `toast.error()`.
- Unlike the old solid-`--ink` pill, the Sonner toast uses the **`--sd-*` overlay
  tokens** so it flips with `[data-theme="dark"]` like the rest of the floating
  shadcn UI (command palette, dialog, tooltip). This is the canonical floating
  surface now — match it for any new transient.
- A bare design token is NOT a Tailwind shadow utility. To use `--shadow-float`
  on a shadcn component, use `shadow-[var(--shadow-float)]`, not `shadow-float`.

---

### Card (BackgroundCard)

File: `components/BackgroundCard.tsx`
Last updated: 2026-06-08

| Property | Value |
| --- | --- |
| Background | `var(--surface)` — opaque tile (stays readable over any applied site background) |
| Border | `1px solid var(--border)` |
| Border radius | `var(--radius-lg)` (20px), `overflow: hidden` |
| Text — primary | `var(--ink)`, display font, 1rem / 700 (card title) |
| Text — secondary | `var(--muted)`, 0.8rem (author credit) |
| Spacing | media `aspect-ratio: 4/3`; meta padding `0.85rem 1rem` |
| Hover state | `translateY(-4px)` + `var(--shadow-lift)`; reveals hint + copy button |
| Shadow | rest `var(--shadow-card)` → hover `var(--shadow-lift)` |
| Accent usage | preview hint pill uses `var(--primary)` |

**Pattern notes:**
- **Cards are opaque `--surface` tiles** using FIXED tokens (not chrome tokens),
  so the gallery reads as white tiles even when a dark background is applied
  site-wide. Any future card/panel must match: `--surface` bg, `--border`,
  `--radius-lg`, `--shadow-card` at rest.
- Two sibling buttons (full-area Preview + corner Copy), never nested, for clean
  keyboard a11y. Hover/`:focus-within` reveals overlays via opacity+transform.

### Button — primary (pill)

Files: `components/PreviewBar.tsx` (`.preview-bar__copy`), `BackgroundCard.tsx` (`.card__hint`)

| Property | Value |
| --- | --- |
| Background | `var(--primary)` → hover `var(--primary-hover)` |
| Text | `var(--primary-ink)` (white), 0.875rem / 600 |
| Border | none |
| Border radius | `var(--radius-full)` |
| Spacing | `~0.55rem 1rem`, icon gap `0.45rem` |

**Pattern notes:** the one filled CTA style. White text on cobalt (saturated
mid-tone → white text per H-K). Every primary action matches this.

### Button — ghost / secondary (pill)

Files: `components/SurpriseButton.tsx`, `PreviewBar.tsx` (`.preview-bar__reset`)

| Property | Value |
| --- | --- |
| Background | transparent → hover `var(--chrome-surface)` |
| Text | `var(--chrome-ink)`, 0.875rem / 600 |
| Border | `1px solid var(--chrome-border)` (or none for inline reset) |
| Border radius | `var(--radius-full)` |
| Active | `scale(0.97)` |

**Pattern notes:** secondary actions that float over the backdrop use **chrome
tokens** so they flip on dark backgrounds.

### Badge

File: `components/BackgroundCard.tsx` (`.badge`)

| Property | Value |
| --- | --- |
| Background | `oklch(1 0 0 / 0.92)` (frosted white — readable over any preview) |
| Text | `var(--ink)`, 0.7rem / 600 |
| Border radius | `var(--radius-full)` |
| Spacing | `0.2rem 0.55rem` |
| Shadow | `var(--shadow-card)` |

**Pattern notes:** badges over imagery/backgrounds use a frosted-white pill, not
a brand color, so they stay legible on any preview. `pointer-events: none`.

### Floating chrome (Nav, PreviewBar)

Files: `components/Nav.tsx`, `components/PreviewBar.tsx`

| Property | Value |
| --- | --- |
| Background | `var(--chrome-surface)` (translucent) |
| Backdrop | `blur(12–16px) saturate(1.4–1.5)` |
| Border | `1px solid var(--chrome-border)` |
| Text | `var(--chrome-ink)` / `var(--chrome-muted)` |

**Pattern notes:** anything that floats *over* the page backdrop (nav, preview
bar, section headings, hero text) uses **chrome tokens** + optional blur, so it
auto-flips to light over dark backgrounds. This is the project's one sanctioned
use of glass — it's purposeful (UI sits over arbitrary backgrounds), not decorative.

### Section heading / Hero

Files: `components/CategorySection.tsx`, `components/Hero.tsx`

| Property | Value |
| --- | --- |
| Heading text | `var(--chrome-ink)`, display font |
| Count / meta pill | `var(--chrome-surface)` bg, `--chrome-border`, `--chrome-muted` text, `--radius-full` |
| Container | `max-width: 1200px`, `padding: clamp(...)` fluid |

**Pattern notes:** page-level text sits on the backdrop → chrome tokens. Content
max-width is 1200px across hero + sections.

---

## shadcn bridge (the consistency rule for `components/ui/*`)

Added: 2026-06-10. shadcn primitives are themed entirely through `app/globals.css`
— there is **no separate shadcn palette**. Every shadcn color utility maps to a
Backdrop token:

| shadcn utility | resolves to | meaning |
| --- | --- | --- |
| `bg-primary` / `text-primary-foreground` | `--primary` / `--primary-ink` | the cobalt CTA (same as `.preview-bar__copy`) |
| `bg-popover` / `text-popover-foreground` | `--sd-popover` / `--sd-popover-foreground` | **floating surface** (dialog, command, tooltip) — **flips dark** |
| `bg-card` | `--sd-card` | flips dark |
| `bg-muted` / `text-muted-foreground` | `--sd-muted` (=`--surface-2`) / `--muted` | subtle surface / secondary text |
| `bg-accent` / `text-accent-foreground` | `--sd-accent` (=`--surface-2`) / `--ink` | **hover surface — NOT Backdrop's coral** |
| `border-border` | `--sd-border` | flips dark |
| `ring-ring` | `--sd-ring` (=`--primary`) | focus ring |

**Pattern notes (must-match for any new shadcn component):**
- The `--sd-*` tokens are **overlay surfaces that flip** under `[data-theme="dark"]`
  (defined twice in `globals.css`: `:root` light + `[data-theme="dark"]` dark).
  Anything that floats over the page backdrop must use them so it coheres with
  the chrome flip.
- **shadcn `accent` ≠ Backdrop `accent`.** shadcn `accent` is a hover surface
  (`--surface-2`); Backdrop's brand coral lives on the bare `--accent` prop,
  consumed only via inline `var(--accent)` (nav logo gradient, preview-bar dot,
  surprise icon). Never wire shadcn `bg-accent` to the coral.
- A `text-foreground` (=`--ink`, fixed) on a flipping overlay is a TRAP — it does
  not flip and goes invisible on the dark surface. On overlays use
  `text-popover-foreground`. (This is exactly the bug the review caught in
  CommandGroup.)

### Command palette (⌘K)

Files: `components/CommandPalette.tsx`, `components/ui/command.tsx`, `components/CommandTrigger.tsx`

| Property | Value |
| --- | --- |
| Surface | `bg-popover` + `text-popover-foreground` (flips dark) |
| Item — rest | inherits `text-popover-foreground`; padding `px-2 py-1.5`; `rounded-md` |
| Item — selected | `data-[selected=true]:bg-accent` + `text-accent-foreground` |
| Group heading | `text-muted-foreground`, `text-xs`, uppercase, `tracking-wide` |
| Leading swatch | `h-[18px] w-7` `rounded-[5px]` `border-border`; live `<Background>` for CSS, static chip for JS |
| Trailing meta | `CommandShortcut` with `tracking-normal` (NOT `tracking-widest` — that's for keycaps) |
| Overlay | `bg-black/55` + `backdrop-blur-sm` |

**Pattern notes:**
- Opens on `⌘K`/`Ctrl+K` (global keydown) or the `backdrop:command` window event
  (dispatched by the nav `CommandTrigger`). The two stay decoupled via the event.
- `CommandDialog` keeps the sr-only `DialogTitle`/`DialogDescription` **inside**
  `DialogContent` so they mount/unmount with the dialog (no phantom heading).
- Don't mount live canvas (`<Background>`) for JS backgrounds in tiny swatches —
  use a static chip; canvas contexts + resize listeners aren't worth a 28px box.

### Dialog / Code viewer

Files: `components/ui/dialog.tsx`, `components/CodeDialog.tsx`

| Property | Value |
| --- | --- |
| Surface | `bg-popover` + `text-popover-foreground`, `border-border` (flips dark) |
| Border radius | `rounded-xl` |
| Shadow | `shadow-2xl` |
| Title | `text-lg`, `font-bold`, display font (`--font-display`) |
| Description | `text-muted-foreground`, `text-sm` |
| Code block | `bg-muted`, `font-mono`, `text-[13px]`, `text-popover-foreground` |
| Overlay | `bg-black/55` + `backdrop-blur-sm` |

**Pattern notes:**
- `CodeDialog` is a single shared dialog mounted once (via `CodeDialogProvider`);
  cards + preview bar call `useCodeDialog().openCode(module)` rather than each
  mounting their own. The primary action is a cobalt `Button` (→ clipboard +
  Sonner toast).

### Tabs (category filter)

Files: `components/ui/tabs.tsx`, `components/Gallery.tsx`

| Property | Value |
| --- | --- |
| List (track) | `bg-muted`, `rounded-full`, `p-[3px]`, `h-9` |
| Trigger — rest | `text-muted-foreground`, `rounded-full`, `font-semibold`, `text-sm` |
| Trigger — active | `data-[state=active]:bg-background` + `text-foreground` + `shadow-sm` |

**Pattern notes:** used as a segmented **filter** (no `TabsContent`) — the active
value drives which `CategorySection`s render; "All" shows every section. The track
sits on the always-light gallery, so its tokens don't flip.

### Tooltip

File: `components/ui/tooltip.tsx`

| Property | Value |
| --- | --- |
| Surface | `bg-popover` + `text-popover-foreground`, `border-border` (flips dark) |
| Border radius | `rounded-md` |
| Text | `text-xs`, `font-medium` |
| Shadow | `shadow-md` |

**Pattern notes:** used on icon-only buttons (card copy → "View & copy code"). Same
flipping overlay surface as dialog/command/sonner.

### Nav search pill (CommandTrigger)

File: `components/CommandTrigger.tsx`

| Property | Value |
| --- | --- |
| Background | `var(--chrome-surface)` (chrome token — flips) |
| Border | `1px solid var(--chrome-border)` |
| Text | `var(--chrome-muted)` → hover `var(--chrome-ink)` |
| Border radius | `var(--radius-full)` |
| Keycap (`kbd`) | `color-mix(in oklch, var(--chrome-ink) 8%, transparent)` (tints in both themes) |

**Pattern notes:** scoped-`<style>` chrome component (matches Nav/PreviewBar), not a
shadcn primitive — it's part of the nav, so it uses **chrome tokens** to flip.
Collapses to icon-only under 640px. Keycap fills must derive from `--chrome-ink`,
never a hardcoded white alpha (invisible on light chrome).

---

## Final consistency audit — 2026-06-11 (pre-ship, checklist 7.4)

Full sweep of `components/*`, `components/ui/*`, `app/*` against this registry.

**Result: 1 deviation found and fixed; everything else baseline-compliant.**

- **Fixed:** `CommandShortcut` base default was `tracking-widest` (shadcn default)
  while the registry mandates `tracking-normal` (widest is reserved for keycaps).
  Changed the default in `components/ui/command.tsx` and removed the per-usage
  overrides in `CommandPalette.tsx` that were papering over it.
- **Documented as intentional (not deviations):** the frosted-white badge
  `oklch(1 0 0 / 0.92)`; the preview-bar dot's coral halo
  `oklch(0.7 0.17 38 / 0.2)`; the static JS-swatch gradient in CommandPalette.
- **Cosmetic, allowed:** two small one-off radii — nav brand chip `9px`
  (`Nav.tsx`) and keycap `7px` (`CommandTrigger.tsx`). Sub-`--radius-md`
  micro-elements; not worth new tokens.
- **Verified:** chrome-token flip usage, `--sd-*` overlay usage,
  `text-popover-foreground` on all flipping overlays, coral confined to its three
  sanctioned spots, reduced-motion fallbacks everywhere, `Toast.tsx` fully
  replaced by Sonner, no stale paths in this registry.
