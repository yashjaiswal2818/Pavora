"use client";

import { useEffect, useRef } from "react";
import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "sakura",
  name: "Sakura",
  category: "Particles",
  tech: "js",
  isDark: false,
};

/* Cherry blossom on a soft spring sky. Each petal tumbles on its own axis and
   flutters — a squash on the vertical sells the moment it turns edge-on — while
   drifting down and sideways on a light breeze. */
export function Background({ playing = true }: BackgroundProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const tints = ["#ffd6e4", "#ffc2d6", "#f9b0c8", "#ffe0ea"];
    let w = 0, h = 0, raf = 0;
    let petals: {
      x: number; y: number; size: number; vy: number; vx: number;
      rot: number; vrot: number; flip: number; vflip: number; sway: number; color: string;
    }[] = [];

    const make = () => {
      const count = Math.min(70, Math.round((w * h) / 22000));
      petals = Array.from({ length: count }, () => {
        const size = 5 + Math.random() * 6;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          vy: 0.35 + Math.random() * 0.6,
          vx: -0.3 + Math.random() * 0.9,
          rot: Math.random() * Math.PI * 2,
          vrot: (-0.5 + Math.random()) * 0.03,
          flip: Math.random() * Math.PI * 2,
          vflip: 0.02 + Math.random() * 0.03,
          sway: Math.random() * Math.PI * 2,
          color: tints[Math.floor(Math.random() * tints.length)],
        };
      });
    };

    let bg: CanvasGradient;
    const remakeBg = () => {
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#fdf3f6");
      bg.addColorStop(1, "#eef3fb");
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

    const drawPetal = (p: (typeof petals)[number]) => {
      const s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.max(0.18, Math.abs(Math.cos(p.flip))));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.95, -s * 0.2, 0, s);
      ctx.quadraticCurveTo(-s * 0.95, -s * 0.2, 0, -s);
      ctx.fill();
      ctx.restore();
    };

    const paint = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 0.9;
      for (const p of petals) drawPetal(p);
      ctx.globalAlpha = 1;
    };

    const step = () => {
      for (const p of petals) {
        p.sway += 0.02;
        p.rot += p.vrot;
        p.flip += p.vflip;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.sway) * 0.5;
        if (p.y - p.size > h) { p.y = -p.size; p.x = Math.random() * w; }
        if (p.x > w + p.size) p.x = -p.size;
        if (p.x < -p.size) p.x = w + p.size;
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

export function Sakura() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const tints = ["#ffd6e4", "#ffc2d6", "#f9b0c8", "#ffe0ea"];
    let w = 0, h = 0, raf = 0, bg;
    let petals = [];
    const make = () => {
      const count = Math.min(70, Math.round((w * h) / 22000));
      petals = Array.from({ length: count }, () => {
        const size = 5 + Math.random() * 6;
        return {
          x: Math.random() * w, y: Math.random() * h, size,
          vy: 0.35 + Math.random() * 0.6, vx: -0.3 + Math.random() * 0.9,
          rot: Math.random() * Math.PI * 2, vrot: (-0.5 + Math.random()) * 0.03,
          flip: Math.random() * Math.PI * 2, vflip: 0.02 + Math.random() * 0.03,
          sway: Math.random() * Math.PI * 2, color: tints[Math.floor(Math.random() * tints.length)],
        };
      });
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#fdf3f6"); bg.addColorStop(1, "#eef3fb");
      make();
    };
    const drawPetal = (p) => {
      const s = p.size;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.scale(1, Math.max(0.18, Math.abs(Math.cos(p.flip))));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.95, -s * 0.2, 0, s);
      ctx.quadraticCurveTo(-s * 0.95, -s * 0.2, 0, -s);
      ctx.fill(); ctx.restore();
    };
    const paint = () => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 0.9; for (const p of petals) drawPetal(p); ctx.globalAlpha = 1;
    };
    const step = () => {
      for (const p of petals) {
        p.sway += 0.02; p.rot += p.vrot; p.flip += p.vflip;
        p.y += p.vy; p.x += p.vx + Math.sin(p.sway) * 0.5;
        if (p.y - p.size > h) { p.y = -p.size; p.x = Math.random() * w; }
        if (p.x > w + p.size) p.x = -p.size;
        if (p.x < -p.size) p.x = w + p.size;
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
