"use client";

import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A field of evenly-spaced dots fading out via a radial mask — the quietest
   workhorse background, the one that sits behind content without ever competing
   with it. Light and dark themes. */

type DotColors = { bg: string; dot: string };

const COLORWAYS: { id: string; name: string; isDark: boolean; props: DotColors }[] = [
  { id: "paper", name: "Paper", isDark: false, props: { bg: "#fbfbfa", dot: "rgba(20, 24, 40, 0.16)" } },
  { id: "slate", name: "Slate", isDark: false, props: { bg: "#f4f6f9", dot: "rgba(40, 60, 90, 0.18)" } },
  { id: "honey", name: "Honey", isDark: false, props: { bg: "#faf6ee", dot: "rgba(120, 90, 40, 0.16)" } },
  { id: "graphite", name: "Graphite", isDark: true, props: { bg: "#0c0e13", dot: "rgba(255, 255, 255, 0.13)" } },
  { id: "cobalt", name: "Cobalt", isDark: true, props: { bg: "#070a14", dot: "rgba(130, 170, 255, 0.24)" } },
];

function Background({ playing = true, className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const c = (variant?.props as DotColors | undefined) ?? COLORWAYS[0].props;
  const vars = { "--dtg-bg": c.bg, "--dtg-dot": c.dot } as CSSProperties;
  return (
    <div className={`dtg-root ${className ?? ""}`} data-playing={playing} style={vars} aria-hidden>
      <style>{`
        .dtg-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: var(--dtg-bg);
        }
        .dtg-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(var(--dtg-dot) 1.2px, transparent 1.6px);
          background-size: 22px 22px;
          -webkit-mask-image: radial-gradient(115% 115% at 50% 0%, #000 38%, transparent 80%);
                  mask-image: radial-gradient(115% 115% at 50% 0%, #000 38%, transparent 80%);
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as DotColors;
  return `/* Dot Grid · ${variant.name} — masked dot field */
.bg-dot-grid {
  position: relative;
  overflow: hidden;
  background: ${c.bg};
}
.bg-dot-grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(${c.dot} 1.2px, transparent 1.6px);
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(115% 115% at 50% 0%, #000 38%, transparent 80%);
          mask-image: radial-gradient(115% 115% at 50% 0%, #000 38%, transparent 80%);
}`;
}

export const family: BackgroundFamily = {
  slug: "dot-grid",
  name: "Dot Grid",
  category: "Patterns",
  tech: "css",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
};
