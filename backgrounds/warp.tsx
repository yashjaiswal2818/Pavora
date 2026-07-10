"use client";

import { useEffect, useRef } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A perfectly still lattice of small dots that bends around the pointer. Dots
   within reach are pushed away as if the cursor carried mass, brightening and
   growing slightly as they strain, then easing back home when the pointer moves
   on. Idle, it is a disciplined quiet dot grid; alive, it feels like dragging a
   gravity lens across the page. A radial edge fade sinks the grid into the
   background so it reads as an environment, not wallpaper. Paused (or with
   reduced motion) it paints the plain resting grid — still composed, just calm. */

type WarpProps = {
  bg: string;
  dot: string; // "r g b"
  alpha: number; // base dot alpha
  gap: number;
  radius: number; // pointer influence radius
  push: number; // max displacement in px
};

const COLORWAYS: { id: string; name: string; isDark: boolean; props: WarpProps }[] = [
  { id: "graphite", name: "Graphite", isDark: true, props: { bg: "#0b0d11", dot: "255 255 255", alpha: 0.24, gap: 38, radius: 190, push: 26 } },
  { id: "paper", name: "Paper", isDark: false, props: { bg: "#fafaf9", dot: "25 30 48", alpha: 0.3, gap: 38, radius: 190, push: 26 } },
  { id: "cobalt", name: "Cobalt", isDark: true, props: { bg: "#070a14", dot: "150 175 255", alpha: 0.28, gap: 38, radius: 190, push: 26 } },
  { id: "mint", name: "Mint", isDark: true, props: { bg: "#05110d", dot: "140 235 195", alpha: 0.26, gap: 38, radius: 190, push: 26 } },
];

const rgba = (t: string, a: number) => `rgba(${t.trim().split(/\s+/).join(",")},${a})`;

type DotState = { x: number; y: number; f: number; ox: number; oy: number; tx: number; ty: number };

function Background({ playing = true, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = (variant?.props as WarpProps | undefined) ?? COLORWAYS[0].props;
  const { bg, dot, alpha, gap, radius, push } = p;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const g2 = gap / 2;

    let w = 0, h = 0, raf = 0;
    let cols = 0, rows = 0;
    let fade = new Float32Array(0); // quantized edge fade per grid cell
    let buckets: number[][] = []; // cell indices grouped by fade level, for batched fills
    let pointer: { x: number; y: number } | null = null;
    // Only dots that are displaced or still easing home live here.
    const dots = new Map<string, DotState>();

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / gap);
      rows = Math.ceil(h / gap);
      // Precompute the radial edge falloff per cell, quantized to 8 levels so
      // resting dots can be batched into one fill path per level.
      const denom = 0.85 * (Math.hypot(w, h) / 2);
      fade = new Float32Array(cols * rows);
      buckets = Array.from({ length: 8 }, () => [] as number[]);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const d = Math.hypot(col * gap + g2 - w / 2, row * gap + g2 - h / 2);
          const f = 1 - 0.6 * Math.min(1, (d / denom) ** 2);
          const b = Math.round(f * 7);
          const idx = row * cols + col;
          fade[idx] = b / 7;
          buckets[b].push(idx);
        }
      }
      dots.clear();
    };

    const draw = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Resting dots, one batched path per fade level.
      const hasDisplaced = dots.size > 0;
      for (let b = 1; b < 8; b++) {
        const cells = buckets[b];
        if (!cells || !cells.length) continue;
        ctx.beginPath();
        let any = false;
        for (let i = 0; i < cells.length; i++) {
          const idx = cells[i];
          const col = idx % cols;
          const row = (idx - col) / cols;
          if (hasDisplaced && dots.has(col + "," + row)) continue;
          const x = col * gap + g2;
          const y = row * gap + g2;
          ctx.moveTo(x + 1.5, y);
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          any = true;
        }
        if (any) {
          ctx.fillStyle = rgba(dot, alpha * (b / 7));
          ctx.fill();
        }
      }

      // Displaced dots draw individually — they brighten and grow as they strain.
      for (const e of dots.values()) {
        const m = Math.hypot(e.ox, e.oy) / push;
        ctx.beginPath();
        ctx.arc(e.x + e.ox, e.y + e.oy, 1.5 + m * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = rgba(dot, Math.min(0.85, alpha + m * 0.5) * e.f);
        ctx.fill();
      }
    };

    const step = () => {
      for (const e of dots.values()) {
        e.tx = 0;
        e.ty = 0;
      }
      if (pointer) {
        const c0 = Math.max(0, Math.floor((pointer.x - radius) / gap));
        const c1 = Math.min(cols - 1, Math.ceil((pointer.x + radius) / gap));
        const r0 = Math.max(0, Math.floor((pointer.y - radius) / gap));
        const r1 = Math.min(rows - 1, Math.ceil((pointer.y + radius) / gap));
        for (let row = r0; row <= r1; row++) {
          for (let col = c0; col <= c1; col++) {
            const x = col * gap + g2;
            const y = row * gap + g2;
            const vx = x - pointer.x;
            const vy = y - pointer.y;
            const dist = Math.hypot(vx, vy);
            if (dist >= radius || dist === 0) continue;
            const s = (1 - dist / radius) ** 2;
            const key = col + "," + row;
            let e = dots.get(key);
            if (!e) {
              e = { x, y, f: fade[row * cols + col], ox: 0, oy: 0, tx: 0, ty: 0 };
              dots.set(key, e);
            }
            e.tx = (vx / dist) * s * push;
            e.ty = (vy / dist) * s * push;
          }
        }
      }
      for (const [key, e] of dots) {
        e.ox += (e.tx - e.ox) * 0.14;
        e.oy += (e.ty - e.oy) * 0.14;
        if (e.tx === 0 && e.ty === 0 && Math.hypot(e.ox, e.oy) < 0.05) dots.delete(key);
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onLeave = () => {
      pointer = null;
    };

    resize();
    window.addEventListener("resize", resize);

    if (playing && !reduce) {
      // Listen on window, not the canvas: applied full-page the backdrop is
      // pointer-events:none, so canvas-level mouse events never fire. Window
      // events still arrive, and onMove translates them into the canvas's box.
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
      step();
    } else {
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [playing, bg, dot, alpha, gap, radius, push]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as WarpProps;
  return `"use client";
import { useEffect, useRef } from "react";

// Warp · ${variant.name} — a still dot grid that bends away from the pointer
export function Warp({
  bg = "${c.bg}",
  dot = "${c.dot}",     // "r g b"
  alpha = ${c.alpha},   // resting dot alpha
  gap = ${c.gap},
  radius = ${c.radius}, // pointer influence radius
  push = ${c.push},     // max displacement in px
}) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rgba = (t, a) => "rgba(" + t.trim().split(/\\s+/).join(",") + "," + a + ")";
    const g2 = gap / 2;
    let w = 0, h = 0, raf = 0, cols = 0, rows = 0, pointer = null;
    let fade = new Float32Array(0), buckets = [];
    const dots = new Map();
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr)); canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / gap); rows = Math.ceil(h / gap);
      const denom = 0.85 * (Math.hypot(w, h) / 2);
      fade = new Float32Array(cols * rows);
      buckets = Array.from({ length: 8 }, () => []);
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols; col++) {
          const d = Math.hypot(col * gap + g2 - w / 2, row * gap + g2 - h / 2);
          const b = Math.round((1 - 0.6 * Math.min(1, (d / denom) ** 2)) * 7);
          const idx = row * cols + col;
          fade[idx] = b / 7; buckets[b].push(idx);
        }
      dots.clear();
    };
    const draw = () => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const hasDisplaced = dots.size > 0;
      for (let b = 1; b < 8; b++) {
        const cells = buckets[b]; if (!cells || !cells.length) continue;
        ctx.beginPath();
        let any = false;
        for (let i = 0; i < cells.length; i++) {
          const idx = cells[i], col = idx % cols, row = (idx - col) / cols;
          if (hasDisplaced && dots.has(col + "," + row)) continue;
          const x = col * gap + g2, y = row * gap + g2;
          ctx.moveTo(x + 1.5, y); ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          any = true;
        }
        if (any) { ctx.fillStyle = rgba(dot, alpha * (b / 7)); ctx.fill(); }
      }
      for (const e of dots.values()) {
        const m = Math.hypot(e.ox, e.oy) / push;
        ctx.beginPath();
        ctx.arc(e.x + e.ox, e.y + e.oy, 1.5 + m * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = rgba(dot, Math.min(0.85, alpha + m * 0.5) * e.f);
        ctx.fill();
      }
    };
    const step = () => {
      for (const e of dots.values()) { e.tx = 0; e.ty = 0; }
      if (pointer) {
        const c0 = Math.max(0, Math.floor((pointer.x - radius) / gap)), c1 = Math.min(cols - 1, Math.ceil((pointer.x + radius) / gap));
        const r0 = Math.max(0, Math.floor((pointer.y - radius) / gap)), r1 = Math.min(rows - 1, Math.ceil((pointer.y + radius) / gap));
        for (let row = r0; row <= r1; row++)
          for (let col = c0; col <= c1; col++) {
            const x = col * gap + g2, y = row * gap + g2;
            const vx = x - pointer.x, vy = y - pointer.y, dist = Math.hypot(vx, vy);
            if (dist >= radius || dist === 0) continue;
            const s = (1 - dist / radius) ** 2;
            const key = col + "," + row;
            let e = dots.get(key);
            if (!e) { e = { x, y, f: fade[row * cols + col], ox: 0, oy: 0, tx: 0, ty: 0 }; dots.set(key, e); }
            e.tx = (vx / dist) * s * push; e.ty = (vy / dist) * s * push;
          }
      }
      for (const [key, e] of dots) {
        e.ox += (e.tx - e.ox) * 0.14; e.oy += (e.ty - e.oy) * 0.14;
        if (e.tx === 0 && e.ty === 0 && Math.hypot(e.ox, e.oy) < 0.05) dots.delete(key);
      }
      draw(); raf = requestAnimationFrame(step);
    };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { pointer = null; };
    resize();
    window.addEventListener("resize", resize);
    if (reduce) { draw(); }
    else {
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
      step();
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [bg, dot, alpha, gap, radius, push]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
}

export const family: BackgroundFamily = {
  slug: "warp",
  name: "Warp",
  category: "Patterns",
  tech: "js",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "dot", label: "Dots", format: "triplet" },
  ],
};
