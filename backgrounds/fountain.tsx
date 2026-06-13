"use client";

import { useEffect, useRef } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A fountain of sparks rising from a source near the floor, falling back under
   gravity with a short luminous trail. The source drifts to follow the pointer
   and eases back to centre a moment after you stop. Additive blending makes the
   spray glow where it's densest. */

type FountainProps = { bg: string; colors: string[] };

const COLORWAYS: { id: string; name: string; isDark: boolean; props: FountainProps }[] = [
  { id: "ember", name: "Ember", isDark: true, props: { bg: "12,7,4", colors: ["#ff7a2c", "#ffb13d", "#ffd76a", "#ff5a3c"] } },
  { id: "aurora", name: "Aurora", isDark: true, props: { bg: "4,12,12", colors: ["#3df0c0", "#4ad6ff", "#7affd0", "#4affa0"] } },
  { id: "fuchsia", name: "Fuchsia", isDark: true, props: { bg: "12,5,12", colors: ["#ff5ab0", "#c05bff", "#ff7ad0", "#7a5bff"] } },
  { id: "gold", name: "Gold", isDark: true, props: { bg: "10,8,4", colors: ["#ffd76a", "#ffefb0", "#ffb13d", "#fff4d0"] } },
];

function Background({ playing = true, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const props = (variant?.props as FountainProps | undefined) ?? COLORWAYS[0].props;
  const bg = props.bg;
  const colors = props.colors;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;
    let ex = 0, ey = 0, px = 0, py = 0, lastMove = -Infinity;
    let parts: { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string }[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ex = w * 0.5;
      ey = h * 0.72;
      ctx.fillStyle = "rgb(" + bg + ")";
      ctx.fillRect(0, 0, w, h);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      lastMove = performance.now();
    };

    const draw = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(" + bg + ",0.2)";
      ctx.fillRect(0, 0, w, h);

      const active = Math.max(0, 1 - (performance.now() - lastMove) / 1500);
      const tx = w * 0.5 + (px - w * 0.5) * active;
      const ty = h * 0.72 + (py - h * 0.72) * active;
      ex += (tx - ex) * 0.1;
      ey += (ty - ey) * 0.1;

      for (let i = 0; i < 6; i++) {
        parts.push({
          x: ex, y: ey,
          vx: (Math.random() - 0.5) * 2.4,
          vy: -(3 + Math.random() * 4),
          life: 1,
          size: 2 + Math.random() * 2.6,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      if (parts.length > 700) parts.splice(0, parts.length - 700);

      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += 0.08;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.012;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => { draw(); raf = requestAnimationFrame(loop); };

    const paintStatic = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgb(" + bg + ")";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(w * 0.5, h * 0.68, 0, w * 0.5, h * 0.68, Math.min(w, h) * 0.4);
      g.addColorStop(0, colors[0]);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    resize();
    window.addEventListener("resize", resize);
    if (playing && !reduce) {
      window.addEventListener("pointermove", onMove);
      loop();
    } else {
      paintStatic();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [playing, bg, colors]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as FountainProps;
  const palette = c.colors.map((x) => `"${x}"`).join(", ");
  return `"use client";
import { useEffect, useRef } from "react";

export function Fountain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bg = "${c.bg}";
    const colors = [${palette}];
    let w = 0, h = 0, raf = 0, ex = 0, ey = 0, px = 0, py = 0, lastMove = -Infinity;
    let parts = [];
    const resize = () => {
      const r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ex = w * 0.5; ey = h * 0.72;
      ctx.fillStyle = "rgb(" + bg + ")"; ctx.fillRect(0, 0, w, h);
    };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top; lastMove = performance.now();
    };
    const draw = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(" + bg + ",0.2)"; ctx.fillRect(0, 0, w, h);
      const active = Math.max(0, 1 - (performance.now() - lastMove) / 1500);
      ex += (w * 0.5 + (px - w * 0.5) * active - ex) * 0.1;
      ey += (h * 0.72 + (py - h * 0.72) * active - ey) * 0.1;
      for (let i = 0; i < 6; i++) {
        parts.push({ x: ex, y: ey, vx: (Math.random() - 0.5) * 2.4, vy: -(3 + Math.random() * 4),
          life: 1, size: 2 + Math.random() * 2.6, color: colors[Math.floor(Math.random() * colors.length)] });
      }
      if (parts.length > 700) parts.splice(0, parts.length - 700);
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += 0.08; p.x += p.vx; p.y += p.vy; p.life -= 0.012;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    resize();
    window.addEventListener("resize", resize);
    if (reduce) {
      ctx.fillStyle = "rgb(" + bg + ")"; ctx.fillRect(0, 0, w, h);
    } else {
      window.addEventListener("pointermove", onMove);
      loop();
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
}

export const family: BackgroundFamily = {
  slug: "fountain",
  name: "Fountain",
  category: "Particles",
  tech: "js",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
};
