"use client";

import { useEffect, useRef } from "react";
import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "starfield",
  name: "Starfield",
  category: "Particles",
  tech: "js",
  isDark: true,
};

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
    type S = { x: number; y: number; z: number; phase: number };
    let stars: S[] = [];

    const seed = () => {
      const count = Math.min(160, Math.max(40, Math.floor((w * h) / 7000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
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
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#070b1c");
      grad.addColorStop(1, "#04060f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        s.y += s.z * 0.25;
        if (s.y > h) {
          s.y = 0;
          s.x = Math.random() * w;
        }
        const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.03 + s.phase);
        ctx.fillStyle = `rgba(225,232,255,${(0.35 + s.z * 0.5) * twinkle})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.z * 1.4, 0, Math.PI * 2);
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

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, frame = 0;
    let stars: { x: number; y: number; z: number; phase: number }[] = [];
    const seed = () => {
      const n = Math.min(160, Math.floor((w * h) / 7000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        z: 0.3 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2,
      }));
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); seed();
    };
    const draw = () => {
      frame++;
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#070b1c"); g.addColorStop(1, "#04060f");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        s.y += s.z * 0.25; if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
        const t = 0.55 + 0.45 * Math.sin(frame * 0.03 + s.phase);
        ctx.fillStyle = \`rgba(225,232,255,\${(0.35 + s.z * 0.5) * t})\`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.z * 1.4, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
