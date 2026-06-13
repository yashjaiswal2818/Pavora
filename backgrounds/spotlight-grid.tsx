"use client";

import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A faint grid fading out toward the edges with a glow pooled at the top
   centre — the restrained version of the "AI startup hero". The radial mask on
   the grid is what keeps it from reading as graph paper. */

type SpotColors = { bg: string; line: string; glow: string };

const COLORWAYS: { id: string; name: string; isDark: boolean; props: SpotColors }[] = [
  { id: "cobalt", name: "Cobalt", isDark: true, props: { bg: "#060810", line: "120 150 230", glow: "90 130 255" } },
  { id: "violet", name: "Violet", isDark: true, props: { bg: "#08060f", line: "160 130 230", glow: "150 100 255" } },
  { id: "emerald", name: "Emerald", isDark: true, props: { bg: "#04100c", line: "100 200 170", glow: "60 210 150" } },
  { id: "mono", name: "Mono", isDark: true, props: { bg: "#0a0a0c", line: "190 200 220", glow: "200 210 235" } },
  { id: "ember", name: "Ember", isDark: true, props: { bg: "#0f0805", line: "230 160 120", glow: "255 150 90" } },
];

function Background({ playing = true, className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const c = (variant?.props as SpotColors | undefined) ?? COLORWAYS[0].props;
  const vars = { "--spg-bg": c.bg, "--spg-line": c.line, "--spg-glow": c.glow } as CSSProperties;
  return (
    <div className={`spg-root ${className ?? ""}`} data-playing={playing} style={vars} aria-hidden>
      <style>{`
        .spg-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: var(--spg-bg);
        }
        .spg-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgb(var(--spg-line) / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgb(var(--spg-line) / 0.5) 1px, transparent 1px);
          background-size: 44px 44px;
          -webkit-mask-image: radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%);
                  mask-image: radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%);
        }
        .spg-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(60% 45% at 50% 0%, rgb(var(--spg-glow) / 0.45), transparent 65%);
          animation: spg-pulse 7s ease-in-out infinite alternate;
        }
        .spg-root[data-playing="false"]::after { animation-play-state: paused; }
        @keyframes spg-pulse {
          from { opacity: 0.78; }
          to   { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .spg-root::after { animation: none; }
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as SpotColors;
  return `/* Spotlight Grid · ${variant.name} — masked grid with a top-centre glow */
.bg-spotlight-grid {
  position: relative;
  overflow: hidden;
  background: ${c.bg};
}
.bg-spotlight-grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(${c.line} / 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgb(${c.line} / 0.5) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%);
          mask-image: radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%);
}
.bg-spotlight-grid::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 45% at 50% 0%, rgb(${c.glow} / 0.45), transparent 65%);
  animation: spotlight-grid-pulse 7s ease-in-out infinite alternate;
}
@keyframes spotlight-grid-pulse {
  from { opacity: 0.78; }
  to   { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-spotlight-grid::after { animation: none; }
}`;
}

export const family: BackgroundFamily = {
  slug: "spotlight-grid",
  name: "Spotlight Grid",
  category: "Patterns",
  tech: "css",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "line", label: "Grid", format: "triplet" },
    { key: "glow", label: "Glow", format: "triplet" },
  ],
};
