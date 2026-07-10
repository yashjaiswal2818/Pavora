"use client";

import { useEffect, useRef } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A quiet orbital diagram as an environment. Five faint concentric rings sit
   slightly above center; along them, seven small points of light travel at
   Kepler-ish speeds — inner rings faster — each dragging a short fading arc
   trail. A soft glow rests at the middle, and the edges sink into the page
   color so the diagram reads as depth, not wallpaper. It's the ecosystem hero
   diagram turned ambient: tiny satellites, slow orbits, never busy. Paused (or
   with reduced motion) it holds one composed frame with the satellites
   scattered around their rings. */

type OrbitProps = {
  bg: string;
  ring: string; // "r g b"
  glow: string; // "r g b"
  speed: number;
};

const COLORWAYS: { id: string; name: string; isDark: boolean; props: OrbitProps }[] = [
  { id: "mono", name: "Mono", isDark: true, props: { bg: "#07080a", ring: "212 220 238", glow: "238 242 255", speed: 1 } },
  { id: "cobalt", name: "Cobalt", isDark: true, props: { bg: "#060a13", ring: "130 160 235", glow: "150 180 255", speed: 1 } },
  { id: "gold", name: "Gold", isDark: true, props: { bg: "#0a0804", ring: "232 190 128", glow: "255 210 140", speed: 1 } },
  { id: "paper", name: "Paper", isDark: false, props: { bg: "#f8f8f6", ring: "48 58 88", glow: "70 100 225", speed: 1 } },
];

const rgba = (t: string, a: number) => `rgba(${t.trim().split(/\s+/).join(",")},${a})`;

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

function Background({ playing = true, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = (variant?.props as OrbitProps | undefined) ?? COLORWAYS[0].props;
  const { bg, ring, glow, speed } = p;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bgRgb = hexToRgb(bg);
    // Additive blending clamps to white on light backgrounds, which erases the
    // satellites — light colorways draw them with normal compositing instead.
    const n = parseInt(bg.slice(1), 16);
    const isLight = ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 > 128;
    const blend: GlobalCompositeOperation = isLight ? "source-over" : "lighter";
    let w = 0, h = 0, raf = 0, t = 0;

    // Seven satellites, fully deterministic: which ring each rides, its start
    // angle, and a Kepler-ish angular speed (inner = faster).
    const RINGS = [1, 2, 2, 3, 4, 4, 5];
    const START = RINGS.map((_, j) => j * 2.4);
    const SPEEDS = RINGS.map((r) => (0.0003 / Math.sqrt(r)) * speed);
    const SEG = 0.022, TAIL = 16;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const cx = w * 0.5, cy = h * 0.42;
      const base = Math.min(w, h) * 0.16;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Soft glow resting at the center, under everything.
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 0.9);
      core.addColorStop(0, rgba(glow, 0.16));
      core.addColorStop(0.5, rgba(glow, 0.05));
      core.addColorStop(1, rgba(glow, 0));
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h);

      // Five concentric rings, fainter as they widen. Outer ones may clip
      // offscreen on small viewports — intended.
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        ctx.strokeStyle = rgba(ring, 0.16 - (i - 1) * 0.025);
        ctx.beginPath();
        ctx.arc(cx, cy, base * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Satellites: fading arc trail first, then the head. Additive on dark
      // colorways, normal on light ones (see `blend` above).
      ctx.globalCompositeOperation = blend;
      ctx.lineWidth = 1.6;
      for (let j = 0; j < RINGS.length; j++) {
        const r = base * RINGS[j];
        const a = START[j] + time * SPEEDS[j];
        for (let s = 0; s < TAIL; s++) {
          const k = 1 - s / TAIL;
          ctx.strokeStyle = rgba(glow, 0.5 * k * k);
          ctx.beginPath();
          ctx.arc(cx, cy, r, a - (s + 1) * SEG, a - s * SEG);
          ctx.stroke();
        }
        const hx = cx + Math.cos(a) * r;
        const hy = cy + Math.sin(a) * r;
        const dot = ctx.createRadialGradient(hx, hy, 0, hx, hy, 9);
        dot.addColorStop(0, rgba(glow, 0.9));
        dot.addColorStop(0.4, rgba(glow, 0.25));
        dot.addColorStop(1, rgba(glow, 0));
        ctx.fillStyle = dot;
        ctx.beginPath();
        ctx.arc(hx, hy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(glow, 1);
        ctx.beginPath();
        ctx.arc(hx, hy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Sink the edges into the page color — works on dark and light themes
      // alike, unlike a hardcoded black vignette.
      const edge = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
      edge.addColorStop(0, `rgba(${bgRgb},0)`);
      edge.addColorStop(1, `rgba(${bgRgb},0.6)`);
      ctx.fillStyle = edge;
      ctx.fillRect(0, 0, w, h);
    };

    const step = () => {
      t += 16;
      draw(t);
      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    if (playing && !reduce) step();
    else draw(30000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [playing, bg, ring, glow, speed]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as OrbitProps;
  return `"use client";
import { useEffect, useRef } from "react";

// Orbit · ${variant.name} — five faint rings, seven slow satellites with fading trails
export function Orbit({
  bg = "${c.bg}",
  ring = "${c.ring}",   // "r g b"
  glow = "${c.glow}",   // "r g b"
  speed = ${c.speed},
}) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rgba = (t, a) => "rgba(" + t.trim().split(/\\s+/).join(",") + "," + a + ")";
    const n = parseInt(bg.slice(1), 16);
    const bgRgb = ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
    const isLight = ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 > 128;
    const blend = isLight ? "source-over" : "lighter";
    let w = 0, h = 0, raf = 0, t = 0;
    const RINGS = [1, 2, 2, 3, 4, 4, 5];
    const START = RINGS.map((_, j) => j * 2.4);
    const SPEEDS = RINGS.map((r) => (0.0003 / Math.sqrt(r)) * speed);
    const SEG = 0.022, TAIL = 16;
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr)); canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (time) => {
      const cx = w * 0.5, cy = h * 0.42, base = Math.min(w, h) * 0.16;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 0.9);
      core.addColorStop(0, rgba(glow, 0.16)); core.addColorStop(0.5, rgba(glow, 0.05)); core.addColorStop(1, rgba(glow, 0));
      ctx.fillStyle = core; ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        ctx.strokeStyle = rgba(ring, 0.16 - (i - 1) * 0.025);
        ctx.beginPath(); ctx.arc(cx, cy, base * i, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalCompositeOperation = blend;
      ctx.lineWidth = 1.6;
      for (let j = 0; j < RINGS.length; j++) {
        const r = base * RINGS[j], a = START[j] + time * SPEEDS[j];
        for (let s = 0; s < TAIL; s++) {
          const k = 1 - s / TAIL;
          ctx.strokeStyle = rgba(glow, 0.5 * k * k);
          ctx.beginPath(); ctx.arc(cx, cy, r, a - (s + 1) * SEG, a - s * SEG); ctx.stroke();
        }
        const hx = cx + Math.cos(a) * r, hy = cy + Math.sin(a) * r;
        const dot = ctx.createRadialGradient(hx, hy, 0, hx, hy, 9);
        dot.addColorStop(0, rgba(glow, 0.9)); dot.addColorStop(0.4, rgba(glow, 0.25)); dot.addColorStop(1, rgba(glow, 0));
        ctx.fillStyle = dot;
        ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgba(glow, 1);
        ctx.beginPath(); ctx.arc(hx, hy, 1.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      const edge = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
      edge.addColorStop(0, "rgba(" + bgRgb + ",0)"); edge.addColorStop(1, "rgba(" + bgRgb + ",0.6)");
      ctx.fillStyle = edge; ctx.fillRect(0, 0, w, h);
    };
    const step = () => { t += 16; draw(t); raf = requestAnimationFrame(step); };
    resize();
    window.addEventListener("resize", resize);
    if (reduce) draw(30000); else step();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [bg, ring, glow, speed]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
}

export const family: BackgroundFamily = {
  slug: "orbit",
  name: "Orbit",
  category: "Particles",
  tech: "js",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "ring", label: "Rings", format: "triplet" },
    { key: "glow", label: "Satellites", format: "triplet" },
  ],
};
