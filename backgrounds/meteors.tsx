"use client";

import { useEffect, useRef } from "react";
import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "meteors",
  name: "Meteor Shower",
  category: "Particles",
  tech: "js",
  isDark: true,
};

/* A quiet night sky: faint stars hold steady while meteors fall at random
   across the upper sky on their own staggered timers, each a bright head with a
   tail that fades out behind it. */
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
    let stars: { x: number; y: number; r: number; tw: number }[] = [];
    type Meteor = {
      x: number; y: number; dx: number; dy: number; speed: number;
      len: number; life: number; maxLife: number; active: boolean; next: number;
    };
    let meteors: Meteor[] = [];

    const make = () => {
      const sCount = Math.min(240, Math.round((w * h) / 5200));
      stars = Array.from({ length: sCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.85 ? 0.6 + Math.random() * 0.7 : 1.3 + Math.random() * 0.8,
        tw: Math.random() * Math.PI * 2,
      }));
      meteors = Array.from({ length: 6 }, () => ({
        x: 0, y: 0, dx: 0, dy: 0, speed: 0, len: 0,
        life: 0, maxLife: 0, active: false, next: Math.floor(Math.random() * 300),
      }));
    };

    const launch = (m: Meteor) => {
      m.x = Math.random() * w * 1.1;
      m.y = Math.random() * h * 0.32 - 20;
      let dx = -(0.5 + Math.random() * 0.4);
      let dy = 0.55 + Math.random() * 0.4;
      const L = Math.hypot(dx, dy);
      dx /= L; dy /= L;
      m.dx = dx; m.dy = dy;
      m.speed = 6 + Math.random() * 5;
      m.len = 70 + Math.random() * 90;
      m.life = 0;
      m.maxLife = 42 + Math.floor(Math.random() * 42);
      m.active = true;
    };

    let bg: CanvasGradient;
    const remakeBg = () => {
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#070a16");
      bg.addColorStop(1, "#04060d");
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

    const paint = (animated: boolean) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#dfe7ff";
      for (const s of stars) {
        ctx.globalAlpha = animated ? 0.35 + Math.sin(s.tw) * 0.3 + 0.3 : 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!animated) return;
      ctx.lineCap = "round";
      for (const m of meteors) {
        if (!m.active) continue;
        const fade = Math.sin((Math.PI * m.life) / m.maxLife);
        const tx = m.x - m.dx * m.len;
        const ty = m.y - m.dy * m.len;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = fade;
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      frame++;
      for (const s of stars) s.tw += 0.03;
      for (const m of meteors) {
        if (m.active) {
          m.x += m.dx * m.speed;
          m.y += m.dy * m.speed;
          m.life++;
          if (m.life > m.maxLife || m.x < -m.len || m.y > h + m.len) {
            m.active = false;
            m.next = frame + 120 + Math.floor(Math.random() * 360);
          }
        } else if (frame >= m.next) {
          launch(m);
        }
      }
    };

    const loop = () => { step(); paint(true); raf = requestAnimationFrame(loop); };

    resize();
    window.addEventListener("resize", resize);
    if (playing && !reduce) loop();
    else paint(false);

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

export function MeteorShower() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, frame = 0, bg;
    let stars = [], meteors = [];
    const make = () => {
      const sCount = Math.min(240, Math.round((w * h) / 5200));
      stars = Array.from({ length: sCount }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() < 0.85 ? 0.6 + Math.random() * 0.7 : 1.3 + Math.random() * 0.8,
        tw: Math.random() * Math.PI * 2,
      }));
      meteors = Array.from({ length: 6 }, () => ({
        x: 0, y: 0, dx: 0, dy: 0, speed: 0, len: 0,
        life: 0, maxLife: 0, active: false, next: Math.floor(Math.random() * 300),
      }));
    };
    const launch = (m) => {
      m.x = Math.random() * w * 1.1; m.y = Math.random() * h * 0.32 - 20;
      let dx = -(0.5 + Math.random() * 0.4), dy = 0.55 + Math.random() * 0.4;
      const L = Math.hypot(dx, dy); m.dx = dx / L; m.dy = dy / L;
      m.speed = 6 + Math.random() * 5; m.len = 70 + Math.random() * 90;
      m.life = 0; m.maxLife = 42 + Math.floor(Math.random() * 42); m.active = true;
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#070a16"); bg.addColorStop(1, "#04060d");
      make();
    };
    const paint = (animated) => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#dfe7ff";
      for (const s of stars) {
        ctx.globalAlpha = animated ? 0.35 + Math.sin(s.tw) * 0.3 + 0.3 : 0.7;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!animated) return;
      ctx.lineCap = "round";
      for (const m of meteors) {
        if (!m.active) continue;
        const fade = Math.sin((Math.PI * m.life) / m.maxLife);
        const tx = m.x - m.dx * m.len, ty = m.y - m.dy * m.len;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = fade; ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath(); ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const step = () => {
      frame++;
      for (const s of stars) s.tw += 0.03;
      for (const m of meteors) {
        if (m.active) {
          m.x += m.dx * m.speed; m.y += m.dy * m.speed; m.life++;
          if (m.life > m.maxLife || m.x < -m.len || m.y > h + m.len) {
            m.active = false; m.next = frame + 120 + Math.floor(Math.random() * 360);
          }
        } else if (frame >= m.next) { launch(m); }
      }
    };
    const loop = () => { step(); paint(true); raf = requestAnimationFrame(loop); };
    resize();
    window.addEventListener("resize", resize);
    if (reduce) paint(false); else loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
