"use client";

import { useId } from "react";
import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* Gooey metaballs: solid colour blobs drift past each other under an SVG
   threshold filter (blur, then a hard alpha cutoff) so they fuse and split like
   liquid instead of merely overlapping. The fusing is the whole effect — the
   filter id is per-instance so several can share a page without colliding. */

type MetaColors = { bg: string; c1: string; c2: string; c3: string };

const COLORWAYS: { id: string; name: string; isDark: boolean; props: MetaColors }[] = [
  { id: "lava", name: "Lava", isDark: true, props: { bg: "#0a0605", c1: "#ff5a2c", c2: "#ff8a3d", c3: "#d4341f" } },
  { id: "plasma", name: "Plasma", isDark: true, props: { bg: "#06080f", c1: "#5b7cff", c2: "#b15bff", c3: "#4ad6ff" } },
  { id: "acid", name: "Acid", isDark: true, props: { bg: "#05090a", c1: "#8fff4a", c2: "#4affc4", c3: "#3dd6ff" } },
  { id: "bubblegum", name: "Bubblegum", isDark: false, props: { bg: "#fff0f6", c1: "#ff7eb6", c2: "#ff9ec9", c3: "#c08cff" } },
  { id: "citrus", name: "Citrus", isDark: false, props: { bg: "#fffaf0", c1: "#ffb02e", c2: "#ff7a45", c3: "#ffd23d" } },
];

function Background({ playing = true, className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const fid = `mtb-goo-${useId().replace(/:/g, "")}`;
  const c = (variant?.props as MetaColors | undefined) ?? COLORWAYS[0].props;
  const vars = { "--mtb-bg": c.bg, "--mtb-c1": c.c1, "--mtb-c2": c.c2, "--mtb-c3": c.c3 } as CSSProperties;
  return (
    <div className={`mtb-root ${className ?? ""}`} data-playing={playing} style={vars} aria-hidden>
      <div className="mtb-field" style={{ filter: `url(#${fid})` }}>
        <span /><span /><span /><span /><span /><span />
      </div>
      <svg className="mtb-defs" width="0" height="0" aria-hidden focusable="false">
        <defs>
          <filter id={fid}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <style>{`
        .mtb-root { position: absolute; inset: 0; overflow: hidden; background: var(--mtb-bg); }
        .mtb-defs { position: absolute; width: 0; height: 0; }
        .mtb-field { position: absolute; inset: 0; }
        .mtb-field span { position: absolute; aspect-ratio: 1; border-radius: 50%; }
        .mtb-field span:nth-child(1) { width: 42%; left: 12%; top: 18%; background: var(--mtb-c1); animation: mtb-a 13s ease-in-out infinite alternate; }
        .mtb-field span:nth-child(2) { width: 36%; left: 58%; top: 46%; background: var(--mtb-c2); animation: mtb-b 16s ease-in-out infinite alternate; }
        .mtb-field span:nth-child(3) { width: 30%; left: 24%; top: 60%; background: var(--mtb-c3); animation: mtb-c 11s ease-in-out infinite alternate; }
        .mtb-field span:nth-child(4) { width: 38%; left: 62%; top: 8%;  background: var(--mtb-c2); animation: mtb-a 15s ease-in-out infinite alternate-reverse; }
        .mtb-field span:nth-child(5) { width: 26%; left: 40%; top: 38%; background: var(--mtb-c1); animation: mtb-b 9s  ease-in-out infinite alternate; }
        .mtb-field span:nth-child(6) { width: 32%; left: 70%; top: 70%; background: var(--mtb-c3); animation: mtb-c 14s ease-in-out infinite alternate-reverse; }
        .mtb-root[data-playing="false"] .mtb-field span { animation-play-state: paused; }
        @keyframes mtb-a { from { transform: translate(-12%, 8%) scale(0.95); } to { transform: translate(16%, -12%) scale(1.15); } }
        @keyframes mtb-b { from { transform: translate(10%, -10%) scale(1.1); } to { transform: translate(-14%, 12%) scale(0.9); } }
        @keyframes mtb-c { from { transform: translate(-8%, -10%) scale(1); } to { transform: translate(12%, 14%) scale(1.2); } }
        @media (prefers-reduced-motion: reduce) {
          .mtb-field span { animation: none; }
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as MetaColors;
  return `<!-- Metaballs · ${variant.name} — gooey blobs that fuse like liquid -->
<div class="bg-metaballs">
  <div class="bg-metaballs__field">
    <span></span><span></span><span></span><span></span><span></span><span></span>
  </div>
  <svg width="0" height="0" aria-hidden><defs>
    <filter id="metaballs-goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"/>
      <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
    </filter>
  </defs></svg>
</div>

<style>
.bg-metaballs { position: relative; overflow: hidden; background: ${c.bg}; }
.bg-metaballs__field { position: absolute; inset: 0; filter: url(#metaballs-goo); }
.bg-metaballs__field span { position: absolute; aspect-ratio: 1; border-radius: 50%; }
.bg-metaballs__field span:nth-child(1) { width: 42%; left: 12%; top: 18%; background: ${c.c1}; animation: metaballs-a 13s ease-in-out infinite alternate; }
.bg-metaballs__field span:nth-child(2) { width: 36%; left: 58%; top: 46%; background: ${c.c2}; animation: metaballs-b 16s ease-in-out infinite alternate; }
.bg-metaballs__field span:nth-child(3) { width: 30%; left: 24%; top: 60%; background: ${c.c3}; animation: metaballs-c 11s ease-in-out infinite alternate; }
.bg-metaballs__field span:nth-child(4) { width: 38%; left: 62%; top: 8%;  background: ${c.c2}; animation: metaballs-a 15s ease-in-out infinite alternate-reverse; }
.bg-metaballs__field span:nth-child(5) { width: 26%; left: 40%; top: 38%; background: ${c.c1}; animation: metaballs-b 9s  ease-in-out infinite alternate; }
.bg-metaballs__field span:nth-child(6) { width: 32%; left: 70%; top: 70%; background: ${c.c3}; animation: metaballs-c 14s ease-in-out infinite alternate-reverse; }
@keyframes metaballs-a { from { transform: translate(-12%, 8%) scale(0.95); } to { transform: translate(16%, -12%) scale(1.15); } }
@keyframes metaballs-b { from { transform: translate(10%, -10%) scale(1.1); } to { transform: translate(-14%, 12%) scale(0.9); } }
@keyframes metaballs-c { from { transform: translate(-8%, -10%) scale(1); } to { transform: translate(12%, 14%) scale(1.2); } }
@media (prefers-reduced-motion: reduce) {
  .bg-metaballs__field span { animation: none; }
}
</style>`;
}

export const family: BackgroundFamily = {
  slug: "metaballs",
  name: "Metaballs",
  category: "Mesh",
  tech: "css",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "c1", label: "Blob 1", format: "hex" },
    { key: "c2", label: "Blob 2", format: "hex" },
    { key: "c3", label: "Blob 3", format: "hex" },
  ],
};
