# Product

## Register

brand

## Users

Frontend developers, designers, and indie hackers who need a striking background for a landing page, portfolio, or app, and want to copy it in seconds instead of building it from scratch. They arrive mid-build, skim a gallery, and judge quality in the first two seconds. They value: it looks great, it's easy to grab, and it's free.

A second audience is **contributors** — developers who want an easy, satisfying way to make their first open-source contribution by adding a single background.

## Product Purpose

An open-source, copy-paste library of UI **backgrounds** (pure-CSS and JS/canvas). Visitors browse backgrounds grouped into categories, preview any one across the *entire site* with one click, and copy the code instantly. Success = a developer lands, finds a background they love, applies it full-screen to feel it at scale, copies it, and ships it the same day — and some of them come back to contribute their own.

The site itself is the product: because it sells visual components, it has to look as good as the components it offers.

## Brand Personality

Playful, friendly, generous — but never childish. A welcoming community project with real craft. The UI is a clean, quiet "gallery wall" so the colorful backgrounds are the stars; warmth comes from a friendly accent color, rounded shapes, generous spacing, friendly copy, and small moments of delight in the interactions. Confident and trustworthy, not cute or amateur.

## Anti-references

- **Generic AI SaaS template**: warm-cream background, purple gradient, identical icon-heading-text card grid, a tiny uppercase tracked eyebrow above every section. The "AI made this" look.
- **Cluttered marketplace / theme store**: dense, ad-heavy, busy chrome competing for attention.
- **Heavy dark dev-tool**: dark-terminal, monospace-everything, heavy-developer aesthetic. (We are intentionally light & minimal.)
- **Childish / toy-like**: cartoonish, bubbly, or amateur styling that undercuts trust.

## Design Principles

1. **The gallery wall is quiet so the art is loud.** The UI must never out-shout the backgrounds. Restraint in the chrome is what lets the colorful work pop.
2. **Feel it at full scale.** The signature interaction (apply any background to the whole site) means people experience a background as a real environment before copying — not trapped in a thumbnail.
3. **Always a way back.** Any full-page change is instantly reversible (floating bar, Esc). The user is never stranded.
4. **Contribution is a first-class flow.** Adding a background is one self-contained folder; credit is visible on every card. Easy to make, easy to review, rewarding to ship.
5. **Friendly, not childish.** Personality lives in motion, copy, and one warm accent — not in cartoon shapes or toy colors.

## Accessibility & Inclusion

- Target **WCAG AA**: body text ≥4.5:1, large text ≥3:1 against its surface.
- **Reduced motion is mandatory**: every animated background and UI animation has a `prefers-reduced-motion: reduce` fallback (static frame / crossfade).
- Full keyboard support for the core flow (preview, copy, reset via Esc); visible focus states.
- Auto-contrast: when a dark background is applied site-wide, UI text/icons flip to remain readable.
