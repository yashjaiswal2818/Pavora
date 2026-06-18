"use client";

import { useEffect, useRef } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* The infinite floor. A perspective grid streams toward the viewer and dissolves
   into a band of light on the horizon, so the screen reads as flying low over a
   lit plane rather than as a flat grid. Receding lines thin into atmospheric haze;
   a vignette sinks the corners. The whole effect is the falloff into that horizon
   glow — the modern dev-tool hero, minus the neon. Paused (or reduced motion) it
   holds one still frame. */

type HorizonProps = {
  bg: string;
  line: string; // "r g b"
  glow: string; // "r g b"
  horizon: number; // 0..1 — where the horizon sits vertically
  speed: number; // forward drift
};

const COLORWAYS: { id: string; name: string; isDark: boolean; props: HorizonProps }[] = [
  { id: "mono", name: "Mono", isDark: true, props: { bg: "#08090c", line: "200 210 230", glow: "225 232 245", horizon: 0.46, speed: 0.0045 } },
  { id: "indigo", name: "Indigo", isDark: true, props: { bg: "#070514", line: "150 140 255", glow: "150 130 255", horizon: 0.46, speed: 0.0045 } },
  { id: "ember", name: "Ember", isDark: true, props: { bg: "#0c0705", line: "255 180 130", glow: "255 140 70", horizon: 0.5, speed: 0.004 } },
  { id: "teal", name: "Teal", isDark: true, props: { bg: "#03100f", line: "110 230 210", glow: "60 220 200", horizon: 0.46, speed: 0.0045 } },
];

const rgba = (t: string, a: number) => `rgba(${t.trim().split(/\s+/).join(",")},${a})`;

function Background({ playing = true, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = (variant?.props as HorizonProps | undefined) ?? COLORWAYS[0].props;
  const { bg, line, glow, horizon, speed } = p;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, frac = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const GAP = 0.16, ROWS = 48;

    const draw = () => {
      const hy = Math.round(h * horizon);
      const ground = h - hy;
      const cx = w / 2;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Sky wash + horizon bloom
      const sky = ctx.createLinearGradient(0, 0, 0, hy);
      sky.addColorStop(0, rgba(glow, 0));
      sky.addColorStop(1, rgba(glow, 0.1));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, hy);

      const bloom = ctx.createRadialGradient(cx, hy, 0, cx, hy, Math.max(w * 0.55, 300));
      bloom.addColorStop(0, rgba(glow, 0.4));
      bloom.addColorStop(0.35, rgba(glow, 0.12));
      bloom.addColorStop(1, rgba(glow, 0));
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // Ground plane, clipped below the horizon
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, hy, w, ground);
      ctx.clip();

      // Converging verticals — fade toward the horizon via a stroke gradient
      const vg = ctx.createLinearGradient(0, hy, 0, h);
      vg.addColorStop(0, rgba(line, 0));
      vg.addColorStop(1, rgba(line, 0.45));
      ctx.strokeStyle = vg;
      ctx.lineWidth = 1;
      const colGap = Math.max(34, w / 24);
      const cols = Math.ceil(cx / colGap) + 2;
      for (let j = -cols; j <= cols; j++) {
        const xb = cx + j * colGap;
        ctx.beginPath();
        ctx.moveTo(cx, hy);
        ctx.lineTo(xb, h);
        ctx.stroke();
      }

      // Receding horizontals — reciprocal spacing piles them at the horizon
      for (let i = -1; i <= ROWS; i++) {
        const t = (i + frac) * GAP;
        if (t <= -0.98) continue;
        const yb = ground / (1 + t);
        if (yb > ground + 2) continue;
        const a = Math.pow(Math.min(1, yb / ground), 0.6) * 0.5;
        ctx.strokeStyle = rgba(line, a);
        ctx.lineWidth = 1;
        const y = hy + yb;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // The lit horizon line itself
      ctx.strokeStyle = rgba(glow, 0.7);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, hy + 0.5);
      ctx.lineTo(w, hy + 0.5);
      ctx.stroke();

      // Vignette
      const vig = ctx.createRadialGradient(cx, h * 0.52, 0, cx, h * 0.52, Math.hypot(w, h) / 2);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    };

    const step = () => {
      frac = (frac - Math.max(speed, 0.0005) + 1) % 1;
      draw();
      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    if (playing && !reduce) step();
    else draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [playing, bg, line, glow, horizon, speed]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as HorizonProps;
  return `"use client";
import { useEffect, useRef } from "react";

// Horizon · ${variant.name} — a perspective grid streaming into a lit horizon
export function Horizon({
  bg = "${c.bg}",
  line = "${c.line}",      // "r g b"
  glow = "${c.glow}",      // "r g b"
  horizon = ${c.horizon},  // 0..1 vertical position
  speed = ${c.speed},
}) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rgba = (t, a) => "rgba(" + t.trim().split(/\\s+/).join(",") + "," + a + ")";
    let w = 0, h = 0, raf = 0, frac = 0;
    const GAP = 0.16, ROWS = 48;
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      const hy = Math.round(h * horizon), ground = h - hy, cx = w / 2;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const sky = ctx.createLinearGradient(0, 0, 0, hy);
      sky.addColorStop(0, rgba(glow, 0)); sky.addColorStop(1, rgba(glow, 0.1));
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, hy);
      const bloom = ctx.createRadialGradient(cx, hy, 0, cx, hy, Math.max(w * 0.55, 300));
      bloom.addColorStop(0, rgba(glow, 0.4)); bloom.addColorStop(0.35, rgba(glow, 0.12)); bloom.addColorStop(1, rgba(glow, 0));
      ctx.fillStyle = bloom; ctx.fillRect(0, 0, w, h);
      ctx.save(); ctx.beginPath(); ctx.rect(0, hy, w, ground); ctx.clip();
      const vg = ctx.createLinearGradient(0, hy, 0, h);
      vg.addColorStop(0, rgba(line, 0)); vg.addColorStop(1, rgba(line, 0.45));
      ctx.strokeStyle = vg; ctx.lineWidth = 1;
      const colGap = Math.max(34, w / 24), cols = Math.ceil(cx / colGap) + 2;
      for (let j = -cols; j <= cols; j++) {
        ctx.beginPath(); ctx.moveTo(cx, hy); ctx.lineTo(cx + j * colGap, h); ctx.stroke();
      }
      for (let i = -1; i <= ROWS; i++) {
        const t = (i + frac) * GAP; if (t <= -0.98) continue;
        const yb = ground / (1 + t); if (yb > ground + 2) continue;
        const a = Math.pow(Math.min(1, yb / ground), 0.6) * 0.5;
        ctx.strokeStyle = rgba(line, a); ctx.lineWidth = 1;
        const y = hy + yb;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle = rgba(glow, 0.7); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(0, hy + 0.5); ctx.lineTo(w, hy + 0.5); ctx.stroke();
      const vig = ctx.createRadialGradient(cx, h * 0.52, 0, cx, h * 0.52, Math.hypot(w, h) / 2);
      vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h);
    };
    const step = () => { frac = (frac - Math.max(speed, 0.0005) + 1) % 1; draw(); raf = requestAnimationFrame(step); };
    resize();
    window.addEventListener("resize", resize);
    if (reduce) draw(); else step();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [bg, line, glow, horizon, speed]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
}

export const family: BackgroundFamily = {
  slug: "horizon",
  name: "Horizon",
  category: "Patterns",
  tech: "js",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "line", label: "Grid", format: "triplet" },
    { key: "glow", label: "Horizon", format: "triplet" },
  ],
};
