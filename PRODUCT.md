# Product

## Register

brand

## Users

Frontend developers and designers hunting for a ready-made background for a landing page, portfolio, or app. They arrive mid-build, evaluate by eye in seconds, and want paste-ready code with zero setup. A second audience is first-time open-source contributors: adding a background is designed to be an easy, satisfying first PR.

## Product Purpose

Pavora is a free, MIT-licensed gallery of copy-paste UI backgrounds (CSS and JS/canvas). Its differentiator is full-scale preview: click any card and the background applies to the entire site, so you feel it as a real environment instead of judging a thumbnail. Success = a visitor finds a background they genuinely want, copies it, and it works first paste.

## Brand Personality

Craft-first, generous, playful-but-precise. The gallery is a quiet white "gallery wall"; all the color and drama belongs to the exhibits. It should feel like a curated print shop, not an asset dump.

## Anti-references

- The infinite-scroll asset dump (uiverse-style volume over curation): fifty near-identical purple gradient blobs.
- AI-generated background packs: default cobalt/violet blurred blobs, generic "aurora" #47, particle network on every dark page.
- Component megasites whose chrome shouts louder than the content it frames.

## Design Principles

1. **Practice what you preach.** A backgrounds site is judged by its own backgrounds. Every exhibit must survive the "would I ship this?" test.
2. **Feel it at full scale.** Backgrounds are environments; every design decision must hold both at card size and full-viewport.
3. **What you copy is what you saw.** The `code` export must reproduce the preview exactly: self-contained, no repo imports, paste-ready.
4. **Accessible by default.** Every animated background ships a `prefers-reduced-motion` fallback; chrome auto-flips contrast over dark backgrounds.
5. **Every background earns its slot.** One memorable idea per exhibit, executed well. No filler variants, no recolors padding the count.

## Accessibility & Inclusion

WCAG AA for all site chrome in both light and dark chrome states. Animated backgrounds pause under `prefers-reduced-motion` (static fallback must still look complete). Backgrounds are `aria-hidden` decoration; they never carry meaning. Canvas effects cap devicePixelRatio at 2 to keep low-end devices smooth.
