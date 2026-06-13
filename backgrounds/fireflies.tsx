"use client";

import { useEffect, useRef } from "react";
import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "fireflies",
  name: "Fireflies",
  category: "Particles",
  tech: "js",
  isDark: true,
};

/* A summer dusk: warm sparks wandering on smooth random walks, each blinking
   on its own clock. The pow() on the sine makes blinks pop instead of
   throbbing — fireflies flash, they don't pulse. */
export function Background({ playing = true }: BackgroundProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, frame = 0;
    const TINTS = ["255,214,112", "224,255,140", "255,233,170"];
    type F = { x: number; y: number; a: number; v: number; s: number; ph: number; bs: number; c: string };
    let flies: F[] = [];

    const seed = () => {
      const count = Math.min(32, Math.max(12, Math.floor((w * h) / 30000)));
      flies = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        a: Math.random() * Math.PI * 2,
        v: 0.2 + Math.random() * 0.3,
        s: 1 + Math.random() * 1.3,
        ph: Math.random() * Math.PI * 2,
        bs: 0.012 + Math.random() * 0.02,
        c: TINTS[Math.floor(Math.random() * TINTS.length)],
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      frame++;
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#0c130e");
      g.addColorStop(1, "#060906");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const f of flies) {
        f.a += (Math.random() - 0.5) * 0.18;
        f.x += Math.cos(f.a) * f.v;
        f.y += Math.sin(f.a) * f.v;
        if (f.x < -30) f.x = w + 30;
        if (f.x > w + 30) f.x = -30;
        if (f.y < -30) f.y = h + 30;
        if (f.y > h + 30) f.y = -30;
        const blink = Math.pow(Math.max(0, Math.sin(frame * f.bs + f.ph)), 6) * 0.9 + 0.1;
        const r = f.s * 9;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        grad.addColorStop(0, `rgba(${f.c},${0.55 * blink})`);
        grad.addColorStop(1, `rgba(${f.c},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,250,225,${0.8 * blink + 0.08})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.s, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (playing && !reduce) loop();
    else draw();

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

export function Fireflies() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const TINTS = ["255,214,112", "224,255,140", "255,233,170"];
    let w = 0, h = 0, raf = 0, frame = 0;
    let flies: { x: number; y: number; a: number; v: number; s: number; ph: number; bs: number; c: string }[] = [];
    const seed = () => {
      const n = Math.min(32, Math.max(12, Math.floor((w * h) / 30000)));
      flies = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        a: Math.random() * Math.PI * 2, v: 0.2 + Math.random() * 0.3,
        s: 1 + Math.random() * 1.3, ph: Math.random() * Math.PI * 2,
        bs: 0.012 + Math.random() * 0.02,
        c: TINTS[Math.floor(Math.random() * TINTS.length)],
      }));
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); seed();
    };
    const draw = () => {
      frame++;
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#0c130e"); g.addColorStop(1, "#060906");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const f of flies) {
        f.a += (Math.random() - 0.5) * 0.18;
        f.x += Math.cos(f.a) * f.v; f.y += Math.sin(f.a) * f.v;
        if (f.x < -30) f.x = w + 30; if (f.x > w + 30) f.x = -30;
        if (f.y < -30) f.y = h + 30; if (f.y > h + 30) f.y = -30;
        const blink = Math.pow(Math.max(0, Math.sin(frame * f.bs + f.ph)), 6) * 0.9 + 0.1;
        const r = f.s * 9;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        grad.addColorStop(0, \`rgba(\${f.c},\${0.55 * blink})\`);
        grad.addColorStop(1, \`rgba(\${f.c},0)\`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = \`rgba(255,250,225,\${0.8 * blink + 0.08})\`;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.s, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
