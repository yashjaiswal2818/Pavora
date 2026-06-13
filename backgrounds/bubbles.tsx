"use client";

import { useEffect, useRef } from "react";
import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "bubbles",
  name: "Bubbles",
  category: "Particles",
  tech: "js",
  isDark: false,
};

/* Bubbles rising through bright water: each one wobbles side to side as it
   climbs and resets to the floor when it reaches the surface. A small offset
   highlight gives every bubble a curved glass face. */
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
    let bubbles: { x: number; y: number; r: number; vy: number; amp: number; phase: number }[] = [];

    const make = () => {
      const count = Math.min(60, Math.round((w * h) / 26000));
      bubbles = Array.from({ length: count }, () => {
        const r = 4 + Math.random() * 12;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vy: 0.3 + r * 0.045,
          amp: 0.4 + Math.random() * 1.1,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    let bg: CanvasGradient;
    const remakeBg = () => {
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#e8f5f1");
      bg.addColorStop(1, "#cbe7e1");
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
      for (const b of bubbles) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fill();
        ctx.strokeStyle = "rgba(58,120,116,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.32, b.y - b.r * 0.32, Math.max(0.6, b.r * 0.16), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fill();
      }
    };

    const step = () => {
      for (const b of bubbles) {
        b.phase += 0.03;
        b.y -= b.vy;
        b.x += Math.sin(b.phase) * b.amp * 0.3;
        if (b.y + b.r < 0) { b.y = h + b.r; b.x = Math.random() * w; }
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

export function Bubbles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, bg;
    let bubbles = [];
    const make = () => {
      const count = Math.min(60, Math.round((w * h) / 26000));
      bubbles = Array.from({ length: count }, () => {
        const r = 4 + Math.random() * 12;
        return { x: Math.random() * w, y: Math.random() * h, r, vy: 0.3 + r * 0.045, amp: 0.4 + Math.random() * 1.1, phase: Math.random() * Math.PI * 2 };
      });
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#e8f5f1"); bg.addColorStop(1, "#cbe7e1");
      make();
    };
    const paint = () => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      for (const b of bubbles) {
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fill();
        ctx.strokeStyle = "rgba(58,120,116,0.4)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(b.x - b.r * 0.32, b.y - b.r * 0.32, Math.max(0.6, b.r * 0.16), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fill();
      }
    };
    const step = () => {
      for (const b of bubbles) {
        b.phase += 0.03; b.y -= b.vy; b.x += Math.sin(b.phase) * b.amp * 0.3;
        if (b.y + b.r < 0) { b.y = h + b.r; b.x = Math.random() * w; }
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
