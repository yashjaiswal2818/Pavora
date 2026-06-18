"use client";

import { useEffect, useRef } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A smooth field of light, drifting like slow lava, but resolved through an
   ordered (Bayer) dither into hard one-bit pixels — so the gradient never
   appears as a gradient, only as dots that crowd where it's bright and thin
   where it's dark. The clusters flow as the field moves underneath. The trick is
   the threshold matrix: it turns a continuous tone into print, the way a riso or
   a 1-bit display would. Paused (or reduced motion) it holds one frame. */

type DitherProps = {
  bg: string;
  ink: string;
  cell: number; // pixel size of each dither cell
  scale: number; // size of the drifting blobs
};

const COLORWAYS: { id: string; name: string; isDark: boolean; props: DitherProps }[] = [
  { id: "carbon", name: "Carbon", isDark: true, props: { bg: "#0a0a0c", ink: "#e9ebf2", cell: 5, scale: 1 } },
  { id: "acid", name: "Acid", isDark: true, props: { bg: "#0a0d07", ink: "#c8f24a", cell: 5, scale: 1 } },
  { id: "ultra", name: "Ultra", isDark: true, props: { bg: "#060a12", ink: "#69d9ff", cell: 5, scale: 1 } },
  { id: "newsprint", name: "Newsprint", isDark: false, props: { bg: "#f3f1ea", ink: "#14110d", cell: 5, scale: 1 } },
];

// 4×4 Bayer matrix → normalized thresholds in (0,1)
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

function Background({ playing = true, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = (variant?.props as DitherProps | undefined) ?? COLORWAYS[0].props;
  const { bg, ink, cell, scale } = p;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const CELL = Math.max(3, cell);
    let w = 0, h = 0, raf = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // A few low-frequency waves on different clocks. Kept near mid-tone so the
    // whole frame stays in the interesting dither band — dense pools and sparse
    // ones drift across it, never a solid slab or an empty void.
    const field = (x: number, y: number, t: number) => {
      const nx = x / Math.max(w, 1);
      const ny = y / Math.max(h, 1);
      const k = Math.PI * 2.2 * scale;
      return (
        0.5 +
        0.2 * Math.sin(nx * 1.6 * k + t * 0.0004) +
        0.17 * Math.sin(ny * 1.9 * k * 0.8 - t * 0.00031 + 1.3) +
        0.14 * Math.sin((nx + ny) * k * 0.6 + t * 0.00052 + 1.7) +
        0.1 * Math.sin((nx - ny) * k * 0.7 - t * 0.00026 + 3.1)
      );
    };

    const draw = (t: number) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      ctx.fillStyle = ink;
      ctx.beginPath();
      for (let cy = 0; cy < rows; cy++) {
        const y = cy * CELL;
        const brow = BAYER[cy & 3];
        for (let cx = 0; cx < cols; cx++) {
          if (field(cx * CELL, y, t) > brow[cx & 3]) ctx.rect(cx * CELL, y, CELL, CELL);
        }
      }
      ctx.fill();
    };

    let t = 0;
    const step = () => {
      t += 16;
      draw(t);
      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    if (playing && !reduce) step();
    else draw(8000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [playing, bg, ink, cell, scale]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as DitherProps;
  return `"use client";
import { useEffect, useRef } from "react";

// Dither · ${variant.name} — a drifting tone field resolved as one-bit pixels
const BAYER = [
  [0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

export function Dither({
  bg = "${c.bg}",
  ink = "${c.ink}",
  cell = ${c.cell},
  scale = ${c.scale},
}) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const CELL = Math.max(3, cell);
    let w = 0, h = 0, raf = 0;
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const field = (x, y, t) => {
      const nx = x / Math.max(w, 1), ny = y / Math.max(h, 1), k = Math.PI * 2.2 * scale;
      return 0.5
        + 0.2 * Math.sin(nx * 1.6 * k + t * 0.0004)
        + 0.17 * Math.sin(ny * 1.9 * k * 0.8 - t * 0.00031 + 1.3)
        + 0.14 * Math.sin((nx + ny) * k * 0.6 + t * 0.00052 + 1.7)
        + 0.1 * Math.sin((nx - ny) * k * 0.7 - t * 0.00026 + 3.1);
    };
    const draw = (t) => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
      ctx.fillStyle = ink; ctx.beginPath();
      for (let cy = 0; cy < rows; cy++) {
        const y = cy * CELL, brow = BAYER[cy & 3];
        for (let cx = 0; cx < cols; cx++) {
          if (field(cx * CELL, y, t) > brow[cx & 3]) ctx.rect(cx * CELL, y, CELL, CELL);
        }
      }
      ctx.fill();
    };
    let t = 0;
    const step = () => { t += 16; draw(t); raf = requestAnimationFrame(step); };
    resize();
    window.addEventListener("resize", resize);
    if (reduce) draw(8000); else step();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [bg, ink, cell, scale]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
}

export const family: BackgroundFamily = {
  slug: "dither",
  name: "Dither",
  category: "Gradients",
  tech: "js",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "ink", label: "Ink", format: "hex" },
  ],
};
