"use client";

import { useEffect, useRef } from "react";
import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "wisp",
  name: "Wisp",
  category: "Particles",
  tech: "js",
  isDark: true,
};

/* A will-o'-the-wisp with a fading light trail. It wanders on its own slow
   orbit; move the pointer and it drifts over to follow, then loses interest
   a couple of seconds after you stop. A tiny spark circles the core. */
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
    let wx = 0, wy = 0, px = 0, py = 0;
    let lastMove = -Infinity;

    const glow = (x: number, y: number, r: number, color: string) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "rgba(94,255,214,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const paintBase = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#07120f";
      ctx.fillRect(0, 0, w, h);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wx = w * 0.62;
      wy = h * 0.38;
      paintBase();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
      lastMove = performance.now();
    };

    const drawWisp = (x: number, y: number) => {
      ctx.globalCompositeOperation = "lighter";
      glow(x, y, 85, "rgba(94,255,214,0.09)");
      glow(x, y, 32, "rgba(132,255,226,0.24)");
      ctx.fillStyle = "rgba(236,255,251,0.92)";
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      const ox = x + Math.cos(frame * 0.11) * 17;
      const oy = y + Math.sin(frame * 0.11) * 17;
      glow(ox, oy, 7, "rgba(190,255,240,0.35)");
      ctx.fillStyle = "rgba(224,255,248,0.85)";
      ctx.beginPath();
      ctx.arc(ox, oy, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    };

    const draw = () => {
      frame++;
      // Translucent repaint fades the previous frames into a trail.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(7,18,15,0.085)";
      ctx.fillRect(0, 0, w, h);

      const ax = w * (0.5 + 0.3 * Math.sin(frame * 0.006) + 0.14 * Math.sin(frame * 0.0153 + 1.7));
      const ay = h * (0.46 + 0.26 * Math.sin(frame * 0.0087 + 0.6) + 0.12 * Math.cos(frame * 0.0049));
      const k = Math.max(0, 1 - (performance.now() - lastMove) / 2600);
      const tx = ax + (px - ax) * k;
      const ty = ay + (py - ay) * k;
      wx += (tx - wx) * 0.05;
      wy += (ty - wy) * 0.05;
      drawWisp(wx, wy);
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (playing && !reduce) {
      window.addEventListener("pointermove", onMove);
      loop();
    } else {
      drawWisp(wx, wy);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
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

export function Wisp() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, frame = 0;
    let wx = 0, wy = 0, px = 0, py = 0, lastMove = -Infinity;
    const glow = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color); g.addColorStop(1, "rgba(94,255,214,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wx = w * 0.62; wy = h * 0.38;
      ctx.fillStyle = "#07120f"; ctx.fillRect(0, 0, w, h);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      lastMove = performance.now();
    };
    const draw = () => {
      frame++;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(7,18,15,0.085)"; ctx.fillRect(0, 0, w, h);
      const ax = w * (0.5 + 0.3 * Math.sin(frame * 0.006) + 0.14 * Math.sin(frame * 0.0153 + 1.7));
      const ay = h * (0.46 + 0.26 * Math.sin(frame * 0.0087 + 0.6) + 0.12 * Math.cos(frame * 0.0049));
      const k = Math.max(0, 1 - (performance.now() - lastMove) / 2600);
      wx += (ax + (px - ax) * k - wx) * 0.05;
      wy += (ay + (py - ay) * k - wy) * 0.05;
      ctx.globalCompositeOperation = "lighter";
      glow(wx, wy, 85, "rgba(94,255,214,0.09)");
      glow(wx, wy, 32, "rgba(132,255,226,0.24)");
      ctx.fillStyle = "rgba(236,255,251,0.92)";
      ctx.beginPath(); ctx.arc(wx, wy, 4.5, 0, Math.PI * 2); ctx.fill();
      const ox = wx + Math.cos(frame * 0.11) * 17, oy = wy + Math.sin(frame * 0.11) * 17;
      glow(ox, oy, 7, "rgba(190,255,240,0.35)");
      ctx.fillStyle = "rgba(224,255,248,0.85)";
      ctx.beginPath(); ctx.arc(ox, oy, 1.5, 0, Math.PI * 2); ctx.fill();
      raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
