"use client";

import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A single shaft of light raking across a dark room from a bright source in the
   top-left, swaying a few degrees as if the source were alive. A vignette pulls
   the corners down so the beam is the only thing lit. */

type BeamColors = { bg: string; beam: string };

const COLORWAYS: { id: string; name: string; isDark: boolean; props: BeamColors }[] = [
  { id: "daybreak", name: "Daybreak", isDark: true, props: { bg: "#070707", beam: "255 244 220" } },
  { id: "cobalt", name: "Cobalt", isDark: true, props: { bg: "#05070f", beam: "120 160 255" } },
  { id: "gold", name: "Gold", isDark: true, props: { bg: "#0a0703", beam: "255 210 130" } },
  { id: "mint", name: "Mint", isDark: true, props: { bg: "#04100c", beam: "140 240 200" } },
  { id: "violet", name: "Violet", isDark: true, props: { bg: "#08050d", beam: "180 140 255" } },
];

function Background({ playing = true, className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const c = (variant?.props as BeamColors | undefined) ?? COLORWAYS[0].props;
  const vars = { "--bem-bg": c.bg, "--bem-beam": c.beam } as CSSProperties;
  return (
    <div className={`bem-root ${className ?? ""}`} data-playing={playing} style={vars} aria-hidden>
      <style>{`
        .bem-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: var(--bem-bg);
        }
        .bem-root::before {
          content: "";
          position: absolute;
          top: -30%;
          left: -10%;
          width: 70%;
          height: 160%;
          background: linear-gradient(105deg, transparent 38%, rgb(var(--bem-beam) / 0.22) 50%, transparent 62%);
          filter: blur(20px);
          transform-origin: top left;
          animation: bem-sway 12s ease-in-out infinite alternate;
        }
        .bem-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(30% 26% at 12% 0%, rgb(var(--bem-beam) / 0.4), transparent 60%),
            radial-gradient(120% 100% at 50% 62%, transparent 52%, rgba(0, 0, 0, 0.55));
        }
        .bem-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes bem-sway {
          from { transform: rotate(-3deg); }
          to   { transform: rotate(3deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bem-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as BeamColors;
  return `/* Beam · ${variant.name} — a raking shaft of light from a bright source */
.bg-beam {
  position: relative;
  overflow: hidden;
  background: ${c.bg};
}
.bg-beam::before {
  content: "";
  position: absolute;
  top: -30%;
  left: -10%;
  width: 70%;
  height: 160%;
  background: linear-gradient(105deg, transparent 38%, rgb(${c.beam} / 0.22) 50%, transparent 62%);
  filter: blur(20px);
  transform-origin: top left;
  animation: beam-sway 12s ease-in-out infinite alternate;
}
/* Source glow + vignette */
.bg-beam::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(30% 26% at 12% 0%, rgb(${c.beam} / 0.4), transparent 60%),
    radial-gradient(120% 100% at 50% 62%, transparent 52%, rgba(0, 0, 0, 0.55));
}
@keyframes beam-sway {
  from { transform: rotate(-3deg); }
  to   { transform: rotate(3deg); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-beam::before { animation: none; }
}`;
}

export const family: BackgroundFamily = {
  slug: "beam",
  name: "Beam",
  category: "Gradients",
  tech: "css",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "beam", label: "Beam", format: "triplet" },
  ],
};
