# Design

## Theme

A bright, friendly "gallery wall." The site chrome is a clean, near-monochrome white frame with generous spacing and rounded geometry; all saturated color comes from the backgrounds on display, plus a single cobalt primary and a warm coral accent that carry the brand's friendly energy. Light mode only (the backgrounds themselves provide dark variants when applied full-page). Color strategy: **Restrained** — neutral surfaces + two committed brand colors used sparingly.

## Color

OKLCH throughout. Defined as CSS custom properties in `app/globals.css` and exposed to Tailwind v4 via `@theme inline`.

| Role | OKLCH | Use |
|---|---|---|
| `--bg` | `oklch(1 0 0)` | Page background (pure white gallery wall) |
| `--surface` | `oklch(0.976 0.003 256)` | Cards, panels, section bands |
| `--surface-2` | `oklch(0.955 0.004 256)` | Hover/active surface, code block bg |
| `--border` | `oklch(0.916 0.005 256)` | Hairline borders, dividers |
| `--ink` | `oklch(0.21 0.02 256)` | Body + heading text (≥12:1 on white) |
| `--muted` | `oklch(0.52 0.018 256)` | Secondary text, captions (≥4.5:1 on white) |
| `--primary` | `oklch(0.55 0.18 256)` | Cobalt — primary buttons, links, focus rings |
| `--primary-ink` | `oklch(0.99 0.01 256)` | Text on primary fills (white) |
| `--accent` | `oklch(0.70 0.17 38)` | Warm coral — friendly highlights, badges, "new" |
| `--accent-ink` | `oklch(0.99 0.01 38)` | Text on accent fills (white) |

When a **dark** background is applied site-wide, `body[data-theme="dark"]` flips chrome tokens: `--ink` → near-white, `--muted` → light gray, `--surface`/`--border` → translucent white, so nav and the preview bar stay readable over any background.

Text-on-color: primary and accent are saturated mid-luminance → always **white** text on their fills (Helmholtz-Kohlrausch).

## Typography

Three families, each earning its place:

- **Display / headings — Bricolage Grotesque** (variable). Characterful, contemporary, a little playful; carries "friendly but refined" without tipping childish. Weights 600–800. `text-wrap: balance` on h1–h3, letter-spacing ≥ -0.03em.
- **Body / UI — Hanken Grotesk**. Warm, highly readable humanist grotesque with soft terminals = friendliness without cartoon. Weights 400/500/600.
- **Code — JetBrains Mono**. Only inside code snippets/blocks (we literally display code, so mono is functional, not costume). Weight 400/500.

Pairing is on a contrast axis (characterful display vs neutral text vs functional mono), not two lookalike grotesques. Reflex-reject fonts (Inter, DM Sans, Geist default, Space/IBM Plex Mono, etc.) avoided.

Fluid modular scale via `clamp()`, ≥1.25 ratio. Hero display max ≈ 4.5rem (friendly, not shouting). Body ~16–18px, line length capped 65–72ch.

## Layout & Shape

- Responsive grid for cards: `repeat(auto-fit, minmax(300px, 1fr))`, fluid gaps.
- Generous, varied `clamp()` spacing; tight groupings within a card, generous separation between sections.
- **Rounded geometry** for friendliness: cards `--radius-lg: 20px`; buttons are full pills (`--radius-full`); inputs/code `--radius-md: 12px`.
- Each card: subtle `--border` + soft shadow so even pale backgrounds read as distinct tiles on the white wall.
- Z-index scale (named): backdrop `-1` → base `0` → sticky-nav `20` → preview-bar `40` → toast `60`.

## Components

- **SiteBackdrop** — `fixed inset-0 -z-10` layer; renders the active background component full-viewport.
- **Nav** — sticky, translucent, minimal: wordmark + GitHub link + "Surprise me".
- **Hero** — friendly headline + one-line value prop + count of backgrounds.
- **CategorySection** — section heading + responsive `BackgroundCard` grid.
- **BackgroundCard** — live mini-preview (animation paused until hover), hover-revealed **Preview** + **Copy** actions, author credit + GitHub link, tech/animated badges. Uniform 4:3 preview ratio.
- **PreviewBar** — floating bottom-center pill, appears only when a background is applied: `Previewing "<name>"` · Copy code · Reset. Glass only here, purposefully.
- **Toast** — bottom toast, "Copied!" confirmation, auto-dismiss.
- **SurpriseButton** — applies a random background site-wide.

## Motion

- Card hover: preview animation unpauses; card lifts (translateY + shadow), ~180ms ease-out-quart.
- Apply background: 400ms crossfade of the backdrop layer.
- Preview bar / toast: slide-up + fade, ease-out-expo.
- Staggered entrance on the first row of cards on load; not every section.
- `@media (prefers-reduced-motion: reduce)`: backgrounds render a static frame; transitions become instant crossfades; no transforms.

## Accessibility

- WCAG AA verified for all chrome text on both light and dark-applied states.
- Keyboard: cards are focusable; Enter = preview, dedicated Copy button; Esc resets; visible cobalt focus ring.
- All interactive controls have discernible labels; badges/credits have text equivalents.
