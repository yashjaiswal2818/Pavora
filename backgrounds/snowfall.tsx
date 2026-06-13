"use client";

import { useEffect, useRef } from "react";
import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "snowfall",
  name: "Snowfall",
  category: "Particles",
  tech: "js",
  isDark: true,
};

/* Night snow with depth: nearer flakes are larger, fall faster and sway wider,
   far ones drift slow and dim. A light crosswind tilts the whole fall so it
   never looks like it's dropping on rails. */
export function Background({ playing = true }: BackgroundProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;
    let flakes: { x: number; y: number; r: number; vy: number; sway: number; phase: number }[] = [];

    const make = () => {
      const count = Math.min(200, Math.round((w * h) / 9000));
      flakes = Array.from({ length: count }, () => {
        const r = 0.8 + Math.random() * Math.random() * 2.6;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vy: 0.22 * r + 0.18,
          sway: 0.3 + r * 0.35,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    let bg: CanvasGradient;
    const remakeBg = () => {
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#0c1626");
      bg.addColorStop(1, "#080b14");
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      remakeBg();
      make();
    };

    const paint = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#eaf2ff";
      for (const f of flakes) {
        ctx.globalAlpha = 0.45 + (f.r / 3.4) * 0.55;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      for (const f of flakes) {
        f.phase += 0.01;
        f.y += f.vy;
        f.x += Math.sin(f.phase) * f.sway * 0.4 + f.r * 0.12;
        if (f.y - f.r > h) { f.y = -f.r; f.x = Math.random() * w; }
        if (f.x - f.r > w) f.x = -f.r;
      }
    };

    const loop = () => { step(); paint(); raf = requestAnimationFrame(loop); };

    resize();
    window.addEventListener("resize", resize);
    if (playing && !reduce) loop();
    else paint();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [playing]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}

export const code = `"use client";
import { useEffect, useRef } from "react";

export function Snowfall() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, bg;
    let flakes = [];
    const make = () => {
      const count = Math.min(200, Math.round((w * h) / 9000));
      flakes = Array.from({ length: count }, () => {
        const r = 0.8 + Math.random() * Math.random() * 2.6;
        return { x: Math.random() * w, y: Math.random() * h, r, vy: 0.22 * r + 0.18, sway: 0.3 + r * 0.35, phase: Math.random() * Math.PI * 2 };
      });
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#0c1626"); bg.addColorStop(1, "#080b14");
      make();
    };
    const paint = () => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#eaf2ff";
      for (const f of flakes) {
        ctx.globalAlpha = 0.45 + (f.r / 3.4) * 0.55;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const step = () => {
      for (const f of flakes) {
        f.phase += 0.01; f.y += f.vy; f.x += Math.sin(f.phase) * f.sway * 0.4 + f.r * 0.12;
        if (f.y - f.r > h) { f.y = -f.r; f.x = Math.random() * w; }
        if (f.x - f.r > w) f.x = -f.r;
      }
    };
    const loop = () => { step(); paint(); raf = requestAnimationFrame(loop); };
    resize();
    window.addEventListener("resize", resize);
    if (reduce) paint(); else loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
