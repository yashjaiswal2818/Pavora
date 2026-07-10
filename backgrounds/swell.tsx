"use client";

import { useEffect, useRef } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A calm ocean swell drawn as stacked thin horizontal lines spanning the full
   width. Each line undulates as the sum of two slow sines; a gaussian envelope
   centered on the vertical middle makes lines there swell taller and glow
   brighter, while lines near the top and bottom flatten and fade — so the
   middle of the page reads as the living heart of the field. The two wave
   phases drift at unrelated speeds, so the motion never repeats, and both
   sides dissolve into the background so the lines feel like an environment,
   not a stripe. Paused (or with reduced motion) it draws one composed still
   frame. */

type SwellProps = {
  bg: string;
  line: string; // "r g b"
  lines: number;
  amp: number; // amplitude scale
};

const COLORWAYS: { id: string; name: string; isDark: boolean; props: SwellProps }[] = [
  { id: "mono", name: "Mono", isDark: true, props: { bg: "#08090c", line: "205 214 232", lines: 26, amp: 1 } },
  { id: "ocean", name: "Ocean", isDark: true, props: { bg: "#04101a", line: "96 190 214", lines: 26, amp: 1 } },
  { id: "ember", name: "Ember", isDark: true, props: { bg: "#0d0806", line: "255 170 122", lines: 26, amp: 1 } },
  { id: "paper", name: "Paper", isDark: false, props: { bg: "#f7f7f5", line: "32 40 62", lines: 26, amp: 1 } },
];

const rgba = (t: string, a: number) => `rgba(${t.trim().split(/\s+/).join(",")},${a})`;

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

function Background({ playing = true, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = (variant?.props as SwellProps | undefined) ?? COLORWAYS[0].props;
  const { bg, line, lines, amp } = p;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bgc = hexToRgb(bg);
    let w = 0, h = 0, raf = 0, t = 0, fw = 0;
    let fadeL: CanvasGradient | null = null;
    let fadeR: CanvasGradient | null = null;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Edge fades are static per size — build once here, not every frame.
      fw = w * 0.12;
      fadeL = ctx.createLinearGradient(0, 0, fw, 0);
      fadeL.addColorStop(0, `rgba(${bgc},1)`);
      fadeL.addColorStop(1, `rgba(${bgc},0)`);
      fadeR = ctx.createLinearGradient(w - fw, 0, w, 0);
      fadeR.addColorStop(0, `rgba(${bgc},0)`);
      fadeR.addColorStop(1, `rgba(${bgc},1)`);
    };

    const draw = (time: number) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // One long wave plus a faster ripple across the width
      const k1 = (2.2 / w) * Math.PI;
      const k2 = (4.6 / w) * Math.PI;
      ctx.lineWidth = 1;

      for (let i = 0; i < lines; i++) {
        const pos = lines > 1 ? i / (lines - 1) : 0.5;
        const baseY = pos * h;
        // Gaussian envelope: the center band swells and glows, edges flatten.
        const env = 0.25 + 0.75 * Math.exp(-((pos - 0.5) ** 2) / 0.045);
        const A = h * 0.055 * amp * env;
        ctx.strokeStyle = rgba(line, 0.05 + 0.34 * env);
        ctx.beginPath();
        for (let x = 0; x <= w + 8; x += 8) {
          const y = baseY + A * (0.62 * Math.sin(x * k1 + time * 0.00045 + i * 1.7) + 0.38 * Math.sin(x * k2 - time * 0.00032 + i * 2.9));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Dissolve into the background at both sides
      if (fadeL && fadeR) {
        ctx.fillStyle = fadeL;
        ctx.fillRect(0, 0, fw, h);
        ctx.fillStyle = fadeR;
        ctx.fillRect(w - fw, 0, fw, h);
      }
    };

    const step = () => {
      t += 16;
      draw(t);
      raf = requestAnimationFrame(step);
    };

    const animate = playing && !reduce;
    // Resizing resets the bitmap, so a paused canvas must recompose its still frame.
    const onResize = () => {
      resize();
      if (!animate) draw(9000);
    };

    resize();
    window.addEventListener("resize", onResize);
    if (animate) step();
    else draw(9000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [playing, bg, line, lines, amp]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as SwellProps;
  return `"use client";
import { useEffect, useRef } from "react";

// Swell · ${variant.name} — stacked flowing lines that breathe around the page's center
export function Swell({
  bg = "${c.bg}",
  line = "${c.line}",  // "r g b"
  lines = ${c.lines},
  amp = ${c.amp},
}) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rgba = (c, a) => "rgba(" + c.trim().split(/\\s+/).join(",") + "," + a + ")";
    const n = parseInt(bg.slice(1), 16);
    const bgc = ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
    let w = 0, h = 0, raf = 0, t = 0, fw = 0, fadeL = null, fadeR = null;
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr)); canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fw = w * 0.12;
      fadeL = ctx.createLinearGradient(0, 0, fw, 0);
      fadeL.addColorStop(0, "rgba(" + bgc + ",1)"); fadeL.addColorStop(1, "rgba(" + bgc + ",0)");
      fadeR = ctx.createLinearGradient(w - fw, 0, w, 0);
      fadeR.addColorStop(0, "rgba(" + bgc + ",0)"); fadeR.addColorStop(1, "rgba(" + bgc + ",1)");
    };
    const draw = (time) => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const k1 = (2.2 / w) * Math.PI, k2 = (4.6 / w) * Math.PI;
      ctx.lineWidth = 1;
      for (let i = 0; i < lines; i++) {
        const pos = lines > 1 ? i / (lines - 1) : 0.5;
        const baseY = pos * h;
        const env = 0.25 + 0.75 * Math.exp(-((pos - 0.5) ** 2) / 0.045);
        const A = h * 0.055 * amp * env;
        ctx.strokeStyle = rgba(line, 0.05 + 0.34 * env);
        ctx.beginPath();
        for (let x = 0; x <= w + 8; x += 8) {
          const y = baseY + A * (0.62 * Math.sin(x * k1 + time * 0.00045 + i * 1.7) + 0.38 * Math.sin(x * k2 - time * 0.00032 + i * 2.9));
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.fillStyle = fadeL; ctx.fillRect(0, 0, fw, h);
      ctx.fillStyle = fadeR; ctx.fillRect(w - fw, 0, fw, h);
    };
    const step = () => { t += 16; draw(t); raf = requestAnimationFrame(step); };
    const onResize = () => { resize(); if (reduce) draw(9000); };
    resize();
    window.addEventListener("resize", onResize);
    if (reduce) draw(9000); else step();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [bg, line, lines, amp]);
  return <canvas ref={ref} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}`;
}

export const family: BackgroundFamily = {
  slug: "swell",
  name: "Swell",
  category: "Patterns",
  tech: "js",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [
    { key: "bg", label: "Background", format: "hex" },
    { key: "line", label: "Line", format: "triplet" },
  ],
};
