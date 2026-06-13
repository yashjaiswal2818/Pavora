"use client";

import { useEffect, useRef } from "react";
import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "bokeh",
  name: "Bokeh",
  category: "Particles",
  tech: "js",
  isDark: true,
};

/* Defocused golden-hour lights: large soft orbs drift and breathe far out of
   focus while a few smaller ones sit nearer and sharper. Painted additively, so
   where orbs overlap the light pools the way it does through a fast lens. */
export function Background({ playing = true }: BackgroundProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cols = ["255,206,132", "255,176,108", "255,150,96", "255,224,170", "238,196,150"];
    let w = 0, h = 0, raf = 0;
    let orbs: {
      x: number; y: number; r: number; vx: number; vy: number;
      col: string; base: number; amp: number; phase: number; pv: number; sharp: boolean;
    }[] = [];

    const make = () => {
      const count = Math.min(28, Math.round((w * h) / 45000));
      orbs = Array.from({ length: count }, () => {
        const sharp = Math.random() < 0.28;
        const r = sharp ? 18 + Math.random() * 26 : 70 + Math.random() * 100;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vx: (-0.5 + Math.random()) * 0.18,
          vy: (-0.5 + Math.random()) * 0.14,
          col: cols[Math.floor(Math.random() * cols.length)],
          base: sharp ? 0.4 : 0.16,
          amp: sharp ? 0.18 : 0.08,
          phase: Math.random() * Math.PI * 2,
          pv: 0.005 + Math.random() * 0.01,
          sharp,
        };
      });
      orbs.sort((a, b) => b.r - a.r);
    };

    let bg: CanvasGradient;
    const remakeBg = () => {
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#140f0a");
      bg.addColorStop(1, "#0c0805");
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
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const o of orbs) {
        const a = Math.max(0, o.base + Math.sin(o.phase) * o.amp);
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, "rgba(" + o.col + "," + a.toFixed(3) + ")");
        g.addColorStop(0.7, "rgba(" + o.col + "," + (a * 0.3).toFixed(3) + ")");
        g.addColorStop(1, "rgba(" + o.col + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
        if (o.sharp) {
          ctx.strokeStyle = "rgba(" + o.col + "," + (a * 0.7).toFixed(3) + ")";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.r * 0.82, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const step = () => {
      for (const o of orbs) {
        o.phase += o.pv;
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = w + o.r;
        if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r;
        if (o.y > h + o.r) o.y = -o.r;
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

export function Bokeh() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cols = ["255,206,132", "255,176,108", "255,150,96", "255,224,170", "238,196,150"];
    let w = 0, h = 0, raf = 0, bg;
    let orbs = [];
    const make = () => {
      const count = Math.min(28, Math.round((w * h) / 45000));
      orbs = Array.from({ length: count }, () => {
        const sharp = Math.random() < 0.28;
        const r = sharp ? 18 + Math.random() * 26 : 70 + Math.random() * 100;
        return {
          x: Math.random() * w, y: Math.random() * h, r,
          vx: (-0.5 + Math.random()) * 0.18, vy: (-0.5 + Math.random()) * 0.14,
          col: cols[Math.floor(Math.random() * cols.length)],
          base: sharp ? 0.4 : 0.16, amp: sharp ? 0.18 : 0.08,
          phase: Math.random() * Math.PI * 2, pv: 0.005 + Math.random() * 0.01, sharp,
        };
      });
      orbs.sort((a, b) => b.r - a.r);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#140f0a"); bg.addColorStop(1, "#0c0805");
      make();
    };
    const paint = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const o of orbs) {
        const a = Math.max(0, o.base + Math.sin(o.phase) * o.amp);
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, "rgba(" + o.col + "," + a.toFixed(3) + ")");
        g.addColorStop(0.7, "rgba(" + o.col + "," + (a * 0.3).toFixed(3) + ")");
        g.addColorStop(1, "rgba(" + o.col + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
        if (o.sharp) {
          ctx.strokeStyle = "rgba(" + o.col + "," + (a * 0.7).toFixed(3) + ")"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(o.x, o.y, o.r * 0.82, 0, Math.PI * 2); ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };
    const step = () => {
      for (const o of orbs) {
        o.phase += o.pv; o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = w + o.r; if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r; if (o.y > h + o.r) o.y = -o.r;
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
