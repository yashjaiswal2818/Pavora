"use client";

import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* Drifting light curtains, not blobs: two layers of soft near-vertical streaks
   (built by multiplying a streak mask against a vertical colour sheet) glow over
   a near-black sky via `screen`, then drift in opposite directions so the
   curtains shimmer past each other. Bottom-to-top colour ramp = the real aurora
   reading (a bright base fading to a magenta/gold crown), so only the four
   colours change between variants and the form stays identical. */

type BorealisColors = {
  sky: string; // near-black backdrop
  c1: string;  // curtain base (low)
  c2: string;  // curtain body
  c3: string;  // curtain upper
  c4: string;  // crown (high)
};

const COLORWAYS: { id: string; name: string; isDark: boolean; props: BorealisColors }[] = [
  // True northern lights: green body, magenta crown.
  { id: "boreal", name: "Boreal", isDark: true, props: { sky: "#03070a", c1: "#10d6a8", c2: "#37ef83", c3: "#b6f59a", c4: "#e25ad0" } },
  // Warm aurora: amber base climbing to a gold crown.
  { id: "ember", name: "Ember", isDark: true, props: { sky: "#0a0605", c1: "#ff7a2f", c2: "#ff5566", c3: "#ff7eb0", c4: "#ffd17a" } },
  // Electric full-spectrum curtain: lime, cyan, indigo, magenta.
  { id: "spectral", name: "Spectral", isDark: true, props: { sky: "#06060f", c1: "#74f048", c2: "#23e0d2", c3: "#5b7bff", c4: "#d65cff" } },
];

function Background({ playing = true, className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const c = (variant?.props as BorealisColors | undefined) ?? COLORWAYS[0].props;
  const vars = {
    "--au-sky": c.sky,
    "--au-c1": c.c1,
    "--au-c2": c.c2,
    "--au-c3": c.c3,
    "--au-c4": c.c4,
  } as CSSProperties;

  return (
    <div className={`au-root ${className ?? ""}`} data-playing={playing} style={vars} aria-hidden>
      {/* Colours arrive as inline CSS vars, so the shared .au-root rules never
          collide when several colourways render on the same page. */}
      <style>{`
        .au-root {
          position: absolute;
          inset: 0;
          background-color: var(--au-sky);
          overflow: hidden;
        }
        /* Two curtain layers. Each = a streak mask (layer 1) multiplied against a
           vertical colour sheet (layer 2); screen lets it glow over the sky. */
        .au-root::before,
        .au-root::after {
          content: "";
          position: absolute;
          inset: -18% -12%;
          background-image:
            repeating-linear-gradient(100deg,
              #000 0%, #000 0.7%,
              #4a4a4a 1.5%, #ffffff 2.5%, #4a4a4a 3.5%,
              #000 4.6%, #000 7.6%),
            linear-gradient(to top,
              #000 0%,
              var(--au-c1) 14%, var(--au-c2) 40%,
              var(--au-c3) 64%, var(--au-c4) 88%,
              #000 100%);
          background-repeat: repeat, no-repeat;
          background-blend-mode: multiply;
          mix-blend-mode: screen;
          will-change: background-position, opacity;
        }
        .au-root::before {
          background-size: 200% 100%, 100% 100%;
          background-position: 0% 50%, 50% 50%;
          filter: blur(20px) saturate(1.4) brightness(1.1);
          animation: au-drift 28s linear infinite, au-breathe 8s ease-in-out infinite;
        }
        .au-root::after {
          background-size: 128% 100%, 100% 100%;
          background-position: 0% 50%, 50% 50%;
          opacity: 0.55;
          filter: blur(15px) saturate(1.3);
          animation: au-drift-rev 22s linear infinite, au-breathe 11s ease-in-out infinite;
        }
        .au-root[data-playing="false"]::before,
        .au-root[data-playing="false"]::after { animation-play-state: paused; }

        @keyframes au-drift {
          from { background-position: 0% 50%, 50% 50%; }
          to   { background-position: 200% 50%, 50% 50%; }
        }
        @keyframes au-drift-rev {
          from { background-position: 0% 50%, 50% 50%; }
          to   { background-position: -128% 50%, 50% 50%; }
        }
        @keyframes au-breathe {
          0%, 100% { opacity: 0.72; }
          50%      { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .au-root::before, .au-root::after { animation: none; }
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as BorealisColors;
  return `/* Borealis · ${variant.name} — drifting aurora curtains over night sky.
   Apply .bg-borealis to a position: relative container. */
.bg-borealis {
  position: relative;
  overflow: hidden;
  background-color: ${c.sky};
}
.bg-borealis::before,
.bg-borealis::after {
  content: "";
  position: absolute;
  inset: -18% -12%;
  background-image:
    repeating-linear-gradient(100deg,
      #000 0%, #000 0.7%,
      #4a4a4a 1.5%, #ffffff 2.5%, #4a4a4a 3.5%,
      #000 4.6%, #000 7.6%),
    linear-gradient(to top,
      #000 0%,
      ${c.c1} 14%, ${c.c2} 40%,
      ${c.c3} 64%, ${c.c4} 88%,
      #000 100%);
  background-repeat: repeat, no-repeat;
  background-blend-mode: multiply;
  mix-blend-mode: screen;
}
.bg-borealis::before {
  background-size: 200% 100%, 100% 100%;
  background-position: 0% 50%, 50% 50%;
  filter: blur(20px) saturate(1.4) brightness(1.1);
  animation: borealis-drift 28s linear infinite, borealis-breathe 8s ease-in-out infinite;
}
.bg-borealis::after {
  background-size: 128% 100%, 100% 100%;
  background-position: 0% 50%, 50% 50%;
  opacity: 0.55;
  filter: blur(11px) saturate(1.3);
  animation: borealis-drift-rev 22s linear infinite, borealis-breathe 11s ease-in-out infinite;
}
@keyframes borealis-drift {
  from { background-position: 0% 50%, 50% 50%; }
  to   { background-position: 200% 50%, 50% 50%; }
}
@keyframes borealis-drift-rev {
  from { background-position: 0% 50%, 50% 50%; }
  to   { background-position: -128% 50%, 50% 50%; }
}
@keyframes borealis-breathe {
  0%, 100% { opacity: 0.85; }
  50%      { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-borealis::before, .bg-borealis::after { animation: none; }
}`;
}

export const family: BackgroundFamily = {
  slug: "borealis",
  name: "Borealis",
  category: "Gradients",
  tech: "css",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "sky", label: "Sky", format: "hex" },
    { key: "c2", label: "Body", format: "hex" },
    { key: "c4", label: "Crown", format: "hex" },
  ],
};
