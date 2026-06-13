"use client";

import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* Light cresting a dark planet: a crisp ice rim on the horizon with a bloom
   breathing behind it, faint stars above. The sharp rim against the soft bloom
   is the whole trick — only the colour changes between variants, so the form
   reads the same in every colourway. */

type EclipseColors = {
  sky: string;    // deep background
  planet: string; // the dark disc
  star: string;   // "r g b" — star dots
  bloom: string;  // "r g b" — bloom core
  bloom2: string; // "r g b" — bloom mid
  rim: string;    // "r g b" — ice rim + near glow
  glow: string;   // "r g b" — far rim glow
};

const COLORWAYS: { id: string; name: string; isDark: boolean; props: EclipseColors }[] = [
  { id: "cobalt", name: "Cobalt", isDark: true, props: { sky: "#04060d", planet: "#020409", star: "199 214 255", bloom: "96 130 255", bloom2: "56 70 180", rim: "205 222 255", glow: "99 138 255" } },
  { id: "ember", name: "Ember", isDark: true, props: { sky: "#0c0604", planet: "#090402", star: "255 224 199", bloom: "255 138 70", bloom2: "180 70 40", rim: "255 226 200", glow: "255 150 90" } },
  { id: "aurora", name: "Aurora", isDark: true, props: { sky: "#03090a", planet: "#020706", star: "200 255 235", bloom: "70 220 170", bloom2: "36 150 130", rim: "205 255 238", glow: "90 230 190" } },
  { id: "violet", name: "Violet", isDark: true, props: { sky: "#07040d", planet: "#050309", star: "224 210 255", bloom: "150 100 255", bloom2: "96 56 180", rim: "226 210 255", glow: "150 110 255" } },
  { id: "mono", name: "Mono", isDark: true, props: { sky: "#08090b", planet: "#050608", star: "220 224 230", bloom: "180 190 205", bloom2: "90 96 110", rim: "230 234 240", glow: "160 168 182" } },
  { id: "gold", name: "Gold", isDark: true, props: { sky: "#0b0703", planet: "#080502", star: "255 236 200", bloom: "255 196 96", bloom2: "180 130 40", rim: "255 240 205", glow: "255 205 120" } },
];

function Background({ playing = true, className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const c = (variant?.props as EclipseColors | undefined) ?? COLORWAYS[0].props;
  const vars = {
    "--ec-sky": c.sky,
    "--ec-planet": c.planet,
    "--ec-star": c.star,
    "--ec-bloom": c.bloom,
    "--ec-bloom2": c.bloom2,
    "--ec-rim": c.rim,
    "--ec-glow": c.glow,
  } as CSSProperties;

  return (
    <div className={`ec-root ${className ?? ""}`} data-playing={playing} style={vars} aria-hidden>
      {/* Colours come from inline CSS vars, so the shared .ec-root rules below
          never collide when several colourways render on the same page. */}
      <style>{`
        .ec-root {
          position: absolute;
          inset: 0;
          background-color: var(--ec-sky);
          background-image:
            radial-gradient(rgb(var(--ec-star) / 0.8) 1px, transparent 1.4px),
            radial-gradient(rgb(var(--ec-star) / 0.45) 1px, transparent 1.4px);
          background-size: 290px 290px, 190px 190px;
          background-position: 40px 60px, 130px 20px;
          overflow: hidden;
        }
        .ec-root::before {
          content: "";
          position: absolute;
          left: -20%;
          right: -20%;
          top: 30%;
          bottom: -30%;
          background: radial-gradient(50% 42% at 50% 62%, rgb(var(--ec-bloom) / 0.55), rgb(var(--ec-bloom2) / 0.22) 48%, transparent 72%);
          filter: blur(26px);
          animation: ec-breathe 8.5s ease-in-out infinite alternate;
        }
        .ec-root::after {
          content: "";
          position: absolute;
          left: -35%;
          width: 170%;
          top: 68%;
          height: 110%;
          border-radius: 50%;
          background: var(--ec-planet);
          border-top: 2px solid rgb(var(--ec-rim) / 0.9);
          box-shadow: 0 -2px 12px rgb(var(--ec-rim) / 0.55), 0 -12px 48px rgb(var(--ec-glow) / 0.4);
        }
        .ec-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes ec-breathe {
          from { opacity: 0.7; transform: scale(1); }
          to   { opacity: 1; transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ec-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as EclipseColors;
  return `/* Eclipse · ${variant.name} — crisp horizon rim with a breathing bloom */
.bg-eclipse {
  position: relative;
  background-color: ${c.sky};
  background-image:
    radial-gradient(rgb(${c.star} / 0.8) 1px, transparent 1.4px),
    radial-gradient(rgb(${c.star} / 0.45) 1px, transparent 1.4px);
  background-size: 290px 290px, 190px 190px;
  background-position: 40px 60px, 130px 20px;
  overflow: hidden;
}
/* Bloom behind the horizon */
.bg-eclipse::before {
  content: "";
  position: absolute;
  left: -20%;
  right: -20%;
  top: 30%;
  bottom: -30%;
  background: radial-gradient(50% 42% at 50% 62%, rgb(${c.bloom} / 0.55), rgb(${c.bloom2} / 0.22) 48%, transparent 72%);
  filter: blur(26px);
  animation: eclipse-breathe 8.5s ease-in-out infinite alternate;
}
/* The planet: dark disc with an ice rim */
.bg-eclipse::after {
  content: "";
  position: absolute;
  left: -35%;
  width: 170%;
  top: 68%;
  height: 110%;
  border-radius: 50%;
  background: ${c.planet};
  border-top: 2px solid rgb(${c.rim} / 0.9);
  box-shadow: 0 -2px 12px rgb(${c.rim} / 0.55), 0 -12px 48px rgb(${c.glow} / 0.4);
}
@keyframes eclipse-breathe {
  from { opacity: 0.7; transform: scale(1); }
  to   { opacity: 1; transform: scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-eclipse::before { animation: none; }
}`;
}

export const family: BackgroundFamily = {
  slug: "eclipse",
  name: "Eclipse",
  category: "Gradients",
  tech: "css",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "sky", label: "Sky", format: "hex" },
    { key: "bloom", label: "Glow", format: "triplet" },
    { key: "rim", label: "Rim", format: "triplet" },
  ],
};
