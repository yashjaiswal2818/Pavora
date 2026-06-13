"use client";

import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A plain line grid that fades out toward the bottom and edges via a radial
   mask — the workhorse you put behind a hero or a section of content. Light and
   dark themes; the mask is the difference between "designed" and "graph paper". */

type GridColors = { bg: string; line: string };

const COLORWAYS: { id: string; name: string; isDark: boolean; props: GridColors }[] = [
  { id: "paper", name: "Paper", isDark: false, props: { bg: "#fbfbfa", line: "rgba(20, 24, 40, 0.08)" } },
  { id: "slate", name: "Slate", isDark: false, props: { bg: "#f4f6f9", line: "rgba(40, 60, 90, 0.09)" } },
  { id: "graphite", name: "Graphite", isDark: true, props: { bg: "#0c0e13", line: "rgba(255, 255, 255, 0.07)" } },
  { id: "cobalt", name: "Cobalt", isDark: true, props: { bg: "#070a14", line: "rgba(120, 160, 255, 0.12)" } },
  { id: "blueprint", name: "Blueprint", isDark: true, props: { bg: "#0a2a5e", line: "rgba(180, 210, 255, 0.18)" } },
];

function Background({ playing = true, className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const c = (variant?.props as GridColors | undefined) ?? COLORWAYS[0].props;
  const vars = { "--grd-bg": c.bg, "--grd-line": c.line } as CSSProperties;
  return (
    <div className={`grd-root ${className ?? ""}`} data-playing={playing} style={vars} aria-hidden>
      <style>{`
        .grd-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: var(--grd-bg);
        }
        .grd-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--grd-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grd-line) 1px, transparent 1px);
          background-size: 40px 40px;
          -webkit-mask-image: radial-gradient(115% 115% at 50% 0%, #000 38%, transparent 80%);
                  mask-image: radial-gradient(115% 115% at 50% 0%, #000 38%, transparent 80%);
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as GridColors;
  return `/* Grid · ${variant.name} — masked line grid */
.bg-grid {
  position: relative;
  overflow: hidden;
  background: ${c.bg};
}
.bg-grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(${c.line} 1px, transparent 1px),
    linear-gradient(90deg, ${c.line} 1px, transparent 1px);
  background-size: 40px 40px;
  -webkit-mask-image: radial-gradient(115% 115% at 50% 0%, #000 38%, transparent 80%);
          mask-image: radial-gradient(115% 115% at 50% 0%, #000 38%, transparent 80%);
}`;
}

export const family: BackgroundFamily = {
  slug: "grid",
  name: "Grid",
  category: "Patterns",
  tech: "css",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
};
