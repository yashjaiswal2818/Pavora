"use client";

import { useEffect, useRef } from "react";
import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "dust-motes",
  name: "Dust Motes",
  category: "Particles",
  tech: "js",
  isDark: false,
};

/* The rare light-mode particle background: dust drifting through a sunbeam.
   Motes brighten as they cross the beam axis and soften outside it, which is
   what sells the light as real. */
export function Background({ playing = true }: BackgroundProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const TILT = 0.5; // beam angle, radians from vertical
    let w = 0, h = 0, raf = 0, frame = 0;
    type M = { x: number; y: number; r: number; a: number; vy: number; ph: number; om: number; amp: number };
    let motes: M[] = [];

    const seed = () => {
      const count = Math.min(48, Math.max(16, Math.floor((w * h) / 26000)));
      motes = Array.from({ length: count }, (_, i) => {
        const bokeh = i % 4 === 0;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: bokeh ? 4.5 + Math.random() * 5 : 0.9 + Math.random() * 1.7,
          a: bokeh ? 0.07 + Math.random() * 0.07 : 0.36 + Math.random() * 0.44,
          vy: bokeh ? 0.05 + Math.random() * 0.08 : 0.1 + Math.random() * 0.2,
          ph: Math.random() * Math.PI * 2,
          om: 0.004 + Math.random() * 0.008,
          amp: 4 + Math.random() * 9,
        };
      });
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
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#f4eee2");
      g.addColorStop(1, "#e9dec9");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Sunbeam slanting in from the top right.
      ctx.save();
      ctx.translate(w * 0.72, 0);
      ctx.rotate(TILT);
      const beam = ctx.createLinearGradient(-220, 0, 220, 0);
      beam.addColorStop(0, "rgba(255,252,240,0)");
      beam.addColorStop(0.5, "rgba(255,251,238,0.72)");
      beam.addColorStop(1, "rgba(255,252,240,0)");
      ctx.fillStyle = beam;
      ctx.fillRect(-220, -60, 440, h * 2 + 120);
      ctx.restore();

      const dx = -Math.sin(TILT), dy = Math.cos(TILT);
      for (const m of motes) {
        m.y -= m.vy;
        if (m.y < -20) {
          m.y = h + 20;
          m.x = Math.random() * w;
        }
        const x = m.x + Math.sin(frame * m.om + m.ph) * m.amp;
        // Distance from the beam axis brightens motes inside the light.
        const perp = Math.abs((x - w * 0.72) * dy - m.y * dx);
        const boost = Math.exp(-((perp / 190) * (perp / 190)));
        const alpha = m.a * (0.3 + 0.7 * boost);
        const r = m.r * 3;
        const grad = ctx.createRadialGradient(x, m.y, 0, x, m.y, r);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, m.y, r, 0, Math.PI * 2);
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

export function DustMotes() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const TILT = 0.5;
    let w = 0, h = 0, raf = 0, frame = 0;
    let motes: { x: number; y: number; r: number; a: number; vy: number; ph: number; om: number; amp: number }[] = [];
    const seed = () => {
      const n = Math.min(48, Math.max(16, Math.floor((w * h) / 26000)));
      motes = Array.from({ length: n }, (_, i) => {
        const bokeh = i % 4 === 0;
        return {
          x: Math.random() * w, y: Math.random() * h,
          r: bokeh ? 4.5 + Math.random() * 5 : 0.9 + Math.random() * 1.7,
          a: bokeh ? 0.07 + Math.random() * 0.07 : 0.36 + Math.random() * 0.44,
          vy: bokeh ? 0.05 + Math.random() * 0.08 : 0.1 + Math.random() * 0.2,
          ph: Math.random() * Math.PI * 2,
          om: 0.004 + Math.random() * 0.008,
          amp: 4 + Math.random() * 9,
        };
      });
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); seed();
    };
    const draw = () => {
      frame++;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#f4eee2"); g.addColorStop(1, "#e9dec9");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w * 0.72, 0); ctx.rotate(TILT);
      const beam = ctx.createLinearGradient(-220, 0, 220, 0);
      beam.addColorStop(0, "rgba(255,252,240,0)");
      beam.addColorStop(0.5, "rgba(255,251,238,0.72)");
      beam.addColorStop(1, "rgba(255,252,240,0)");
      ctx.fillStyle = beam; ctx.fillRect(-220, -60, 440, h * 2 + 120);
      ctx.restore();
      const dx = -Math.sin(TILT), dy = Math.cos(TILT);
      for (const m of motes) {
        m.y -= m.vy;
        if (m.y < -20) { m.y = h + 20; m.x = Math.random() * w; }
        const x = m.x + Math.sin(frame * m.om + m.ph) * m.amp;
        const perp = Math.abs((x - w * 0.72) * dy - m.y * dx);
        const boost = Math.exp(-((perp / 190) * (perp / 190)));
        const alpha = m.a * (0.3 + 0.7 * boost);
        const r = m.r * 3;
        const grad = ctx.createRadialGradient(x, m.y, 0, x, m.y, r);
        grad.addColorStop(0, \`rgba(255,255,255,\${alpha})\`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, m.y, r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
