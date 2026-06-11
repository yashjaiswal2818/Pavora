/* Background template — copy this to backgrounds/<your-slug>.tsx to start a new
   one. Fill in `meta`, build the `Background` component, and write the `code`
   string people copy, then register it in backgrounds/index.ts. This file isn't
   shown on the site; it's a working reference. See CONTRIBUTING.md. */

"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

// 1) METADATA — describes your background to the gallery.
export const meta: BackgroundMeta = {
  slug: "template", // must equal the filename (without .tsx) and be unique
  name: "Template",
  category: "Gradients", // "Gradients" | "Mesh" | "Patterns" | "Particles"
  tech: "css", // "css" for pure CSS, "js" for canvas/JS effects
  isDark: true, // true if the background is dark (flips the site UI to light)
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
