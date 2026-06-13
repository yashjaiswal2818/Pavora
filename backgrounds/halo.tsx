"use client";

import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* One soft glow off-center on near-black, vignetted at the edges with a fine
   grain over the top so it reads as lit space, not a flat radial. The most
   shipped hero backdrop there is — the whole job is the falloff. */

type HaloColors = { bg: string; glow: string; glow2: string };

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23g)'/%3E%3C/svg%3E\")";

const COLORWAYS: { id: string; name: string; isDark: boolean; props: HaloColors }[] = [
  { id: "cobalt", name: "Cobalt", isDark: true, props: { bg: "#060810", glow: "80 120 255", glow2: "60 80 200" } },
  { id: "violet", name: "Violet", isDark: true, props: { bg: "#08060f", glow: "150 90 255", glow2: "110 70 220" } },
  { id: "emerald", name: "Emerald", isDark: true, props: { bg: "#04100c", glow: "60 210 150", glow2: "40 160 130" } },
  { id: "ember", name: "Ember", isDark: true, props: { bg: "#0f0805", glow: "255 140 70", glow2: "220 90 50" } },
  { id: "rose", name: "Rose", isDark: true, props: { bg: "#0d0509", glow: "255 90 150", glow2: "210 70 130" } },
  { id: "mono", name: "Mono", isDark: true, props: { bg: "#0a0a0c", glow: "200 210 230", glow2: "150 160 180" } },
  { id: "citrus", name: "Citrus", isDark: true, props: { bg: "#0c0b05", glow: "255 244 150", glow2: "240 210 90" } },
  { id: "amber", name: "Amber", isDark: true, props: { bg: "#0d0703", glow: "255 150 60", glow2: "230 110 40" } },
];

function Background({ playing = true, className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const c = (variant?.props as HaloColors | undefined) ?? COLORWAYS[0].props;
  const vars = { "--hal-bg": c.bg, "--hal-glow": c.glow, "--hal-glow2": c.glow2 } as CSSProperties;
  return (
    <div className={`hal-root ${className ?? ""}`} data-playing={playing} style={vars} aria-hidden>
      <style>{`
        .hal-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: var(--hal-bg);
          box-shadow: inset 0 0 160px 50px rgba(0, 0, 0, 0.55);
        }
        .hal-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(55% 50% at 28% 24%, rgb(var(--hal-glow) / 0.5), transparent 62%),
            radial-gradient(48% 44% at 80% 78%, rgb(var(--hal-glow2) / 0.32), transparent 66%);
          animation: hal-drift 16s ease-in-out infinite alternate;
        }
        .hal-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: ${GRAIN};
          opacity: 0.06;
        }
        .hal-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes hal-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(2%, -1.5%) scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hal-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as HaloColors;
  return `/* Halo · ${variant.name} — one soft glow on near-black, vignetted */
.bg-halo {
  position: relative;
  overflow: hidden;
  background: ${c.bg};
  box-shadow: inset 0 0 160px 50px rgba(0, 0, 0, 0.55);
}
.bg-halo::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(55% 50% at 28% 24%, rgb(${c.glow} / 0.5), transparent 62%),
    radial-gradient(48% 44% at 80% 78%, rgb(${c.glow2} / 0.32), transparent 66%);
  animation: halo-drift 16s ease-in-out infinite alternate;
}
/* Fine grain */
.bg-halo::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23g)'/%3E%3C/svg%3E");
  opacity: 0.06;
}
@keyframes halo-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(2%, -1.5%) scale(1.06); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-halo::before { animation: none; }
}`;
}

export const family: BackgroundFamily = {
  slug: "halo",
  name: "Halo",
  category: "Gradients",
  tech: "css",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "glow", label: "Glow", format: "triplet" },
    { key: "glow2", label: "Accent", format: "triplet" },
  ],
};
