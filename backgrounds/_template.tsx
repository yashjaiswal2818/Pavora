/* ============================================================================
   BACKGROUND TEMPLATE — copy this file to create a new background.
   ----------------------------------------------------------------------------
   1. Copy this file to `backgrounds/<your-slug>.tsx` (e.g. "midnight-haze.tsx").
   2. Fill in `meta`, build the `Background` component, and write the `code`
      string (the exact code the Copy button gives people).
   3. Register it: add one line to `backgrounds/index.ts`.
   That's the whole contribution. See CONTRIBUTING.md for the full walkthrough.

   This file is NOT shown on the site — it's only a reference. It is kept valid
   and self-contained so you can see a working example.
============================================================================ */

"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

// 1) METADATA — describes your background to the gallery.
export const meta: BackgroundMeta = {
  slug: "template", // must equal the filename (without .tsx) and be unique
  name: "Template",
  category: "Gradients", // "Gradients" | "Mesh" | "Patterns" | "Particles"
  tech: "css", // "css" for pure CSS, "js" for canvas/JS effects
  animated: true, // does it move?
  isDark: true, // true if the background is dark (flips the site UI to light)
  author: "your-name",
  github: "https://github.com/your-username",
  tags: ["example", "gradient"],
};

// 2) COMPONENT — must fill its container (the card preview AND the full page).
//    - Accept `playing`: pause animation when false (the grid does this until
//      hover). Static backgrounds can ignore it.
//    - Keep all styles self-contained. Prefix class + keyframe names with your
//      slug so two backgrounds never collide.
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`tpl-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .tpl-root {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1e3a8a, #6d28d9, #be185d);
          background-size: 200% 200%;
          animation: tpl-pan 12s ease-in-out infinite;
        }
        .tpl-root[data-playing="false"] { animation-play-state: paused; }
        @keyframes tpl-pan {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tpl-root { animation: none; }
        }
      `}</style>
    </div>
  );
}

// 3) CODE — the exact snippet copied to the clipboard. Make it self-contained
//    and paste-ready (no imports from this project). A single CSS class is the
//    simplest shape; component code is fine too.
export const code = `/* Template background */
.bg-template {
  position: relative;
  background: linear-gradient(135deg, #1e3a8a, #6d28d9, #be185d);
  background-size: 200% 200%;
  animation: bg-template-pan 12s ease-in-out infinite;
}
@keyframes bg-template-pan {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-template { animation: none; }
}`;
