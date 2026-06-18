"use client";

import { useEffect, useRef } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* Threads of light strung down a dark room. Each fiber barely glows on its own;
   what you watch is the pulse that travels down it and fades a tail behind, like
   a signal moving through fiber. The fibers sway on their own slow clocks so the
   field never reads as a repeating pattern. Additive light, soft vignette. Paused
   (or reduced motion) the pulses rest mid-fiber. */

type FilamentProps = {
  bg: string;
  thread: string; // "r g b" — the resting fiber
  pulse: string; // "r g b" — the travelling light
  count: number;
  speed: number;
};

const COLORWAYS: { id: string; name: string; isDark: boolean; props: FilamentProps }[] = [
  { id: "mono", name: "Mono", isDark: true, props: { bg: "#070708", thread: "180 190 210", pulse: "235 240 255", count: 9, speed: 1 } },
  { id: "cyan", name: "Cyan", isDark: true, props: { bg: "#04090c", thread: "90 170 200", pulse: "120 240 255", count: 9, speed: 1 } },
  { id: "magenta", name: "Magenta", isDark: true, props: { bg: "#0b0610", thread: "200 120 220", pulse: "255 130 235", count: 9, speed: 1 } },
  { id: "amber", name: "Amber", isDark: true, props: { bg: "#0b0703", thread: "210 160 90", pulse: "255 190 110", count: 9, speed: 1 } },
];

const rgba = (t: string, a: number) => `rgba(${t.trim().split(/\s+/).join(",")},${a})`;

function Background({ playing = true, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = (variant?.props as FilamentProps | undefined) ?? COLORWAYS[0].props;
  const { bg, thread, pulse, count, speed } = p;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;

    type Fiber = { x: number; amp: number; freq: number; phase: number; sway: number; pos: number; vel: number; gap: number };
    let fibers: Fiber[] = [];

    const build = () => {
      fibers = [];
      const n = Math.max(3, Math.round(count));
      for (let i = 0; i < n; i++) {
        const x = ((i + 0.5) / n) * w + (Math.random() - 0.5) * (w / n) * 0.4;
        fibers.push({
          x,
          amp: 18 + Math.random() * 46,
          freq: 0.004 + Math.random() * 0.006,
          phase: Math.random() * Math.PI * 2,
          sway: 0.0006 + Math.random() * 0.0008,
          pos: Math.random(),
          vel: (0.0016 + Math.random() * 0.0026) * Math.max(speed, 0.1),
          gap: 0.5 + Math.random() * 0.5,
        });
      }
    };

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const xAt = (f: Fiber, y: number, t: number) => f.x + Math.sin(y * f.freq + f.phase + t * f.sway) * f.amp;

    const LEN = 160; // length of the travelling streak, in px

    const tracePath = (f: Fiber, from: number, to: number) => {
      ctx.beginPath();
      let first = true;
      for (let y = from; y <= to; y += 12) {
        const x = xAt(f, y, t);
        if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
      }
    };

    let t = 0;

    const draw = (now: number) => {
      t = now;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Resting fibers — a little brighter through the middle so the wires read
      const fiberGrad = ctx.createLinearGradient(0, 0, 0, h);
      fiberGrad.addColorStop(0, rgba(thread, 0.03));
      fiberGrad.addColorStop(0.5, rgba(thread, 0.14));
      fiberGrad.addColorStop(1, rgba(thread, 0.03));
      ctx.strokeStyle = fiberGrad;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (const f of fibers) {
        tracePath(f, 0, h);
        ctx.stroke();
      }

      // Travelling pulses — a glowing length of wire, brightest at the head
      ctx.globalCompositeOperation = "lighter";
      for (const f of fibers) {
        const headY = f.pos * (h + 2 * LEN) - LEN;
        const tailY = headY - LEN;
        if (headY < -LEN || tailY > h) continue;
        const streak = ctx.createLinearGradient(0, tailY, 0, headY);
        streak.addColorStop(0, rgba(pulse, 0));
        streak.addColorStop(0.7, rgba(pulse, 0.18));
        streak.addColorStop(1, rgba(pulse, 0.85));
        ctx.strokeStyle = streak;
        // soft halo, then bright core
        tracePath(f, tailY, headY);
        ctx.lineWidth = 6;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 1;
        ctx.stroke();

        const hx = xAt(f, headY, t);
        if (headY > -24 && headY < h + 24) {
          const g = ctx.createRadialGradient(hx, headY, 0, hx, headY, 16);
          g.addColorStop(0, rgba(pulse, 0.95));
          g.addColorStop(0.35, rgba(pulse, 0.35));
          g.addColorStop(1, rgba(pulse, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(hx, headY, 16, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // Vignette
      const vig = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    };

    const step = () => {
      for (const f of fibers) {
        f.pos += f.vel;
        if (f.pos > 1.2) f.pos -= 1.4;
      }
      draw(t + 16);
      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    if (playing && !reduce) step();
    else draw(8000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [playing, bg, thread, pulse, count, speed]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as FilamentProps;
  return `"use client";
import { useEffect, useRef } from "react";

// Filament · ${variant.name} — light pulses travelling down faint fibers
export function Filament({
  bg = "${c.bg}",
  thread = "${c.thread}",   // "r g b" resting fiber
  pulse = "${c.pulse}",     // "r g b" travelling light
  count = ${c.count},
  speed = ${c.speed},
}) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rgba = (t, a) => "rgba(" + t.trim().split(/\\s+/).join(",") + "," + a + ")";
    let w = 0, h = 0, raf = 0, fibers = [];
    const build = () => {
      fibers = [];
      const n = Math.max(3, Math.round(count));
      for (let i = 0; i < n; i++) {
        const x = ((i + 0.5) / n) * w + (Math.random() - 0.5) * (w / n) * 0.4;
        fibers.push({
          x, amp: 18 + Math.random() * 46, freq: 0.004 + Math.random() * 0.006,
          phase: Math.random() * Math.PI * 2, sway: 0.0006 + Math.random() * 0.0008,
          pos: Math.random(), vel: (0.0016 + Math.random() * 0.0026) * Math.max(speed, 0.1),
          gap: 0.5 + Math.random() * 0.5,
        });
      }
    };
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); build();
    };
    let t = 0;
    const xAt = (f, y) => f.x + Math.sin(y * f.freq + f.phase + t * f.sway) * f.amp;
    const LEN = 160;
    const tracePath = (f, from, to) => {
      ctx.beginPath();
      let first = true;
      for (let y = from; y <= to; y += 12) { const x = xAt(f, y); first ? (ctx.moveTo(x, y), first = false) : ctx.lineTo(x, y); }
    };
    const draw = (now) => {
      t = now;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const fg = ctx.createLinearGradient(0, 0, 0, h);
      fg.addColorStop(0, rgba(thread, 0.03)); fg.addColorStop(0.5, rgba(thread, 0.14)); fg.addColorStop(1, rgba(thread, 0.03));
      ctx.strokeStyle = fg; ctx.lineWidth = 1; ctx.lineCap = "round";
      for (const f of fibers) { tracePath(f, 0, h); ctx.stroke(); }
      ctx.globalCompositeOperation = "lighter";
      for (const f of fibers) {
        const headY = f.pos * (h + 2 * LEN) - LEN, tailY = headY - LEN;
        if (headY < -LEN || tailY > h) continue;
        const streak = ctx.createLinearGradient(0, tailY, 0, headY);
        streak.addColorStop(0, rgba(pulse, 0)); streak.addColorStop(0.7, rgba(pulse, 0.18)); streak.addColorStop(1, rgba(pulse, 0.85));
        ctx.strokeStyle = streak;
        tracePath(f, tailY, headY);
        ctx.lineWidth = 6; ctx.globalAlpha = 0.5; ctx.stroke();
        ctx.lineWidth = 1.6; ctx.globalAlpha = 1; ctx.stroke();
        const hx = xAt(f, headY);
        if (headY > -24 && headY < h + 24) {
          const g = ctx.createRadialGradient(hx, headY, 0, hx, headY, 16);
          g.addColorStop(0, rgba(pulse, 0.95)); g.addColorStop(0.35, rgba(pulse, 0.35)); g.addColorStop(1, rgba(pulse, 0));
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, headY, 16, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      const vig = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
      vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h);
    };
    const step = () => {
      for (const f of fibers) { f.pos += f.vel; if (f.pos > 1.2) f.pos -= 1.4; }
      draw(t + 16); raf = requestAnimationFrame(step);
    };
    resize();
    window.addEventListener("resize", resize);
    if (reduce) draw(8000); else step();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [bg, thread, pulse, count, speed]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
}

export const family: BackgroundFamily = {
  slug: "filament",
  name: "Filament",
  category: "Particles",
  tech: "js",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "thread", label: "Fiber", format: "triplet" },
    { key: "pulse", label: "Pulse", format: "triplet" },
  ],
};
