"use client";

import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* Wet-on-wet watercolour: each wash is lighter at its core and pools to a
   darker rim where the pigment settles, the way real paint dries on cold-press
   paper. The pooled rims are the trick — without them it's just soft blobs.
   Only the pigments change between variants; the paper and the pooling stay. */

type PigmentColors = {
  paper: string;
  c1: string; c1d: string;
  c2: string; c2d: string;
  c3: string; c3d: string;
  c4: string; c4d: string;
};

const PAPER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.3 0 0 0 0 0.26 0 0 0 0 0.2 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23p)'/%3E%3C/svg%3E\")";

const COLORWAYS: { id: string; name: string; isDark: boolean; props: PigmentColors }[] = [
  {
    id: "meadow", name: "Meadow", isDark: false,
    props: {
      paper: "#f6f4ee",
      c1: "212 118 126", c1d: "188 84 94",
      c2: "210 166 90", c2d: "184 138 62",
      c3: "120 162 128", c3d: "90 138 102",
      c4: "96 140 170", c4d: "68 114 148",
    },
  },
  {
    id: "tide", name: "Tide", isDark: false,
    props: {
      paper: "#eef3f4",
      c1: "92 150 190", c1d: "52 110 156",
      c2: "96 178 168", c2d: "54 138 130",
      c3: "126 172 200", c3d: "82 134 170",
      c4: "142 158 200", c4d: "98 118 168",
    },
  },
  {
    id: "petal", name: "Petal", isDark: false,
    props: {
      paper: "#f8f1f2",
      c1: "224 120 150", c1d: "196 80 116",
      c2: "236 150 120", c2d: "208 104 78",
      c3: "196 134 196", c3d: "158 92 162",
      c4: "240 188 120", c4d: "212 150 78",
    },
  },
];

function Background({ playing = true, className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const c = (variant?.props as PigmentColors | undefined) ?? COLORWAYS[0].props;
  const vars = {
    "--pig-paper": c.paper,
    "--pig-c1": c.c1, "--pig-c1d": c.c1d,
    "--pig-c2": c.c2, "--pig-c2d": c.c2d,
    "--pig-c3": c.c3, "--pig-c3d": c.c3d,
    "--pig-c4": c.c4, "--pig-c4d": c.c4d,
  } as CSSProperties;

  return (
    <div className={`pig-root ${className ?? ""}`} data-playing={playing} style={vars} aria-hidden>
      <style>{`
        .pig-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: var(--pig-paper);
        }
        .pig-root::before {
          content: "";
          position: absolute;
          inset: -12%;
          background:
            radial-gradient(circle at 26% 30%, rgb(var(--pig-c1) / 0.1) 0, rgb(var(--pig-c1) / 0.16) 26%, rgb(var(--pig-c1d) / 0.34) 46%, rgb(var(--pig-c1d) / 0) 53%),
            radial-gradient(circle at 73% 25%, rgb(var(--pig-c2) / 0.1) 0, rgb(var(--pig-c2) / 0.15) 28%, rgb(var(--pig-c2d) / 0.32) 48%, rgb(var(--pig-c2d) / 0) 55%),
            radial-gradient(circle at 66% 73%, rgb(var(--pig-c3) / 0.1) 0, rgb(var(--pig-c3) / 0.15) 27%, rgb(var(--pig-c3d) / 0.3) 47%, rgb(var(--pig-c3d) / 0) 54%),
            radial-gradient(circle at 28% 75%, rgb(var(--pig-c4) / 0.1) 0, rgb(var(--pig-c4) / 0.14) 28%, rgb(var(--pig-c4d) / 0.3) 48%, rgb(var(--pig-c4d) / 0) 55%);
          filter: blur(6px);
          animation: pig-bleed 32s ease-in-out infinite alternate;
        }
        .pig-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: ${PAPER};
          opacity: 0.12;
        }
        .pig-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes pig-bleed {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(1.5%, -1%) scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pig-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as PigmentColors;
  return `/* Pigment · ${variant.name} — wet-on-wet watercolour washes with pooled rims */
.bg-pigment {
  position: relative;
  overflow: hidden;
  background: ${c.paper};
}
.bg-pigment::before {
  content: "";
  position: absolute;
  inset: -12%;
  background:
    radial-gradient(circle at 26% 30%, rgb(${c.c1} / 0.1) 0, rgb(${c.c1} / 0.16) 26%, rgb(${c.c1d} / 0.34) 46%, rgb(${c.c1d} / 0) 53%),
    radial-gradient(circle at 73% 25%, rgb(${c.c2} / 0.1) 0, rgb(${c.c2} / 0.15) 28%, rgb(${c.c2d} / 0.32) 48%, rgb(${c.c2d} / 0) 55%),
    radial-gradient(circle at 66% 73%, rgb(${c.c3} / 0.1) 0, rgb(${c.c3} / 0.15) 27%, rgb(${c.c3d} / 0.3) 47%, rgb(${c.c3d} / 0) 54%),
    radial-gradient(circle at 28% 75%, rgb(${c.c4} / 0.1) 0, rgb(${c.c4} / 0.14) 28%, rgb(${c.c4d} / 0.3) 48%, rgb(${c.c4d} / 0) 55%);
  filter: blur(6px);
  animation: pigment-bleed 32s ease-in-out infinite alternate;
}
/* Paper tooth */
.bg-pigment::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.3 0 0 0 0 0.26 0 0 0 0 0.2 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23p)'/%3E%3C/svg%3E");
  opacity: 0.12;
}
@keyframes pigment-bleed {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(1.5%, -1%) scale(1.04); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-pigment::before { animation: none; }
}`;
}

export const family: BackgroundFamily = {
  slug: "pigment",
  name: "Pigment",
  category: "Mesh",
  tech: "css",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
};
