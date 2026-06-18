"use client";

import { useEffect, useRef } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A lattice of outlined tiles — squares or hexagons — that drifts forever in one
   direction. The cell under the pointer lights up and leaves a short fading
   trail behind it, so the grid feels alive where you touch it. A radial vignette
   sinks the edges into the dark so the motion reads as depth, not wallpaper.
   Paused (or with reduced motion) it paints one still frame. */

type ShapeGridProps = {
  bg: string;
  border: string;
  fill: string;
  shape: "square" | "hexagon";
  direction: "diagonal" | "up" | "right" | "down" | "left";
  size: number;
  speed: number;
};

const COLORWAYS: { id: string; name: string; isDark: boolean; props: ShapeGridProps }[] = [
  {
    id: "carbon",
    name: "Carbon",
    isDark: true,
    props: {
      bg: "#0c0e13",
      border: "rgba(255,255,255,0.09)",
      fill: "rgba(125,165,255,0.55)",
      shape: "square",
      direction: "diagonal",
      size: 46,
      speed: 0.4,
    },
  },
  {
    id: "hive",
    name: "Hive",
    isDark: true,
    props: {
      bg: "#0a0710",
      border: "rgba(190,160,255,0.16)",
      fill: "rgba(168,120,255,0.5)",
      shape: "hexagon",
      direction: "right",
      size: 30,
      speed: 0.5,
    },
  },
];

function Background({ playing = true, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = (variant?.props as ShapeGridProps | undefined) ?? COLORWAYS[0].props;
  const { bg, border, fill, shape, direction, size, speed } = p;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isHex = shape === "hexagon";
    const hexHoriz = size * 1.5;
    const hexVert = size * Math.sqrt(3);

    let w = 0, h = 0, raf = 0;
    const offset = { x: 0, y: 0 };
    let hovered: { x: number; y: number } | null = null;
    const trail: { x: number; y: number }[] = [];
    const opacities = new Map<string, number>();
    const TRAIL = 5;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawHex = (cx: number, cy: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const vx = cx + size * Math.cos(a);
        const vy = cy + size * Math.sin(a);
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    };

    const drawGrid = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      if (isHex) {
        const colShift = Math.floor(offset.x / hexHoriz);
        const ox = ((offset.x % hexHoriz) + hexHoriz) % hexHoriz;
        const oy = ((offset.y % hexVert) + hexVert) % hexVert;
        const cols = Math.ceil(w / hexHoriz) + 3;
        const rows = Math.ceil(h / hexVert) + 3;
        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * hexHoriz + ox;
            const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + oy;
            const alpha = opacities.get(`${col},${row}`);
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawHex(cx, cy);
              ctx.fillStyle = fill;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
            drawHex(cx, cy);
            ctx.strokeStyle = border;
            ctx.stroke();
          }
        }
      } else {
        const ox = ((offset.x % size) + size) % size;
        const oy = ((offset.y % size) + size) % size;
        const cols = Math.ceil(w / size) + 3;
        const rows = Math.ceil(h / size) + 3;
        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const sx = col * size + ox;
            const sy = row * size + oy;
            const alpha = opacities.get(`${col},${row}`);
            if (alpha) {
              ctx.globalAlpha = alpha;
              ctx.fillStyle = fill;
              ctx.fillRect(sx, sy, size, size);
              ctx.globalAlpha = 1;
            }
            ctx.strokeStyle = border;
            ctx.strokeRect(sx, sy, size, size);
          }
        }
      }

      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.sqrt(w * w + h * h) / 2);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const step = () => {
      const sp = Math.max(speed, 0.1);
      const wrapX = isHex ? hexHoriz * 2 : size;
      const wrapY = isHex ? hexVert : size;
      switch (direction) {
        case "right": offset.x = (offset.x - sp + wrapX) % wrapX; break;
        case "left": offset.x = (offset.x + sp + wrapX) % wrapX; break;
        case "up": offset.y = (offset.y + sp + wrapY) % wrapY; break;
        case "down": offset.y = (offset.y - sp + wrapY) % wrapY; break;
        case "diagonal":
          offset.x = (offset.x - sp + wrapX) % wrapX;
          offset.y = (offset.y - sp + wrapY) % wrapY;
          break;
      }

      const targets = new Map<string, number>();
      if (hovered) targets.set(`${hovered.x},${hovered.y}`, 1);
      for (let i = 0; i < trail.length; i++) {
        const key = `${trail[i].x},${trail[i].y}`;
        if (!targets.has(key)) targets.set(key, (trail.length - i) / (trail.length + 1));
      }
      for (const [key] of targets) if (!opacities.has(key)) opacities.set(key, 0);
      for (const [key, o] of opacities) {
        const next = o + ((targets.get(key) || 0) - o) * 0.15;
        if (next < 0.005) opacities.delete(key);
        else opacities.set(key, next);
      }

      drawGrid();
      raf = requestAnimationFrame(step);
    };

    const pushTrail = () => {
      if (hovered) {
        trail.unshift({ ...hovered });
        if (trail.length > TRAIL) trail.length = TRAIL;
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      let col: number, row: number;
      if (isHex) {
        const colShift = Math.floor(offset.x / hexHoriz);
        const ox = ((offset.x % hexHoriz) + hexHoriz) % hexHoriz;
        const oy = ((offset.y % hexVert) + hexVert) % hexVert;
        col = Math.round((mx - ox) / hexHoriz);
        const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
        row = Math.round((my - oy - rowOffset) / hexVert);
      } else {
        const ox = ((offset.x % size) + size) % size;
        const oy = ((offset.y % size) + size) % size;
        col = Math.floor((mx - ox) / size);
        row = Math.floor((my - oy) / size);
      }
      if (!hovered || hovered.x !== col || hovered.y !== row) {
        pushTrail();
        hovered = { x: col, y: row };
      }
    };

    const onLeave = () => {
      pushTrail();
      hovered = null;
    };

    resize();
    window.addEventListener("resize", resize);

    if (playing && !reduce) {
      // Listen on window, not the canvas: applied full-page the backdrop is
      // pointer-events:none, so canvas-level mouse events never fire. Window
      // events still arrive, and onMove translates them into the canvas's box.
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
      step();
    } else {
      drawGrid();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [playing, bg, border, fill, shape, direction, size, speed]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as ShapeGridProps;
  return `"use client";
import { useEffect, useRef } from "react";

// ShapeGrid · ${variant.name} — a drifting lattice that lights up under the pointer
export function ShapeGrid({
  bg = "${c.bg}",
  border = "${c.border}",
  fill = "${c.fill}",
  shape = "${c.shape}",           // "square" | "hexagon"
  direction = "${c.direction}",   // "diagonal" | "up" | "right" | "down" | "left"
  size = ${c.size},
  speed = ${c.speed},
}) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isHex = shape === "hexagon";
    const hexH = size * 1.5, hexV = size * Math.sqrt(3);
    let w = 0, h = 0, raf = 0;
    const off = { x: 0, y: 0 };
    let hovered = null;
    const trail = [], op = new Map(), TRAIL = 5;
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const drawHex = (cx, cy) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i, vx = cx + size * Math.cos(a), vy = cy + size * Math.sin(a);
        i === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    };
    const draw = () => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      if (isHex) {
        const cs = Math.floor(off.x / hexH);
        const ox = ((off.x % hexH) + hexH) % hexH, oy = ((off.y % hexV) + hexV) % hexV;
        for (let col = -2; col < Math.ceil(w / hexH) + 3; col++)
          for (let row = -2; row < Math.ceil(h / hexV) + 3; row++) {
            const cx = col * hexH + ox, cy = row * hexV + ((col + cs) % 2 !== 0 ? hexV / 2 : 0) + oy;
            const a = op.get(col + "," + row);
            if (a) { ctx.globalAlpha = a; drawHex(cx, cy); ctx.fillStyle = fill; ctx.fill(); ctx.globalAlpha = 1; }
            drawHex(cx, cy); ctx.strokeStyle = border; ctx.stroke();
          }
      } else {
        const ox = ((off.x % size) + size) % size, oy = ((off.y % size) + size) % size;
        for (let col = -2; col < Math.ceil(w / size) + 3; col++)
          for (let row = -2; row < Math.ceil(h / size) + 3; row++) {
            const sx = col * size + ox, sy = row * size + oy, a = op.get(col + "," + row);
            if (a) { ctx.globalAlpha = a; ctx.fillStyle = fill; ctx.fillRect(sx, sy, size, size); ctx.globalAlpha = 1; }
            ctx.strokeStyle = border; ctx.strokeRect(sx, sy, size, size);
          }
      }
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
      g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    };
    const step = () => {
      const sp = Math.max(speed, 0.1), wx = isHex ? hexH * 2 : size, wy = isHex ? hexV : size;
      if (direction === "right") off.x = (off.x - sp + wx) % wx;
      else if (direction === "left") off.x = (off.x + sp + wx) % wx;
      else if (direction === "up") off.y = (off.y + sp + wy) % wy;
      else if (direction === "down") off.y = (off.y - sp + wy) % wy;
      else if (direction === "diagonal") { off.x = (off.x - sp + wx) % wx; off.y = (off.y - sp + wy) % wy; }
      const t = new Map();
      if (hovered) t.set(hovered.x + "," + hovered.y, 1);
      for (let i = 0; i < trail.length; i++) {
        const k = trail[i].x + "," + trail[i].y;
        if (!t.has(k)) t.set(k, (trail.length - i) / (trail.length + 1));
      }
      for (const [k] of t) if (!op.has(k)) op.set(k, 0);
      for (const [k, o] of op) {
        const n = o + ((t.get(k) || 0) - o) * 0.15;
        n < 0.005 ? op.delete(k) : op.set(k, n);
      }
      draw(); raf = requestAnimationFrame(step);
    };
    const pushTrail = () => { if (hovered) { trail.unshift({ ...hovered }); if (trail.length > TRAIL) trail.length = TRAIL; } };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      let col, row;
      if (isHex) {
        const cs = Math.floor(off.x / hexH);
        const ox = ((off.x % hexH) + hexH) % hexH, oy = ((off.y % hexV) + hexV) % hexV;
        col = Math.round((mx - ox) / hexH);
        row = Math.round((my - oy - ((col + cs) % 2 !== 0 ? hexV / 2 : 0)) / hexV);
      } else {
        const ox = ((off.x % size) + size) % size, oy = ((off.y % size) + size) % size;
        col = Math.floor((mx - ox) / size); row = Math.floor((my - oy) / size);
      }
      if (!hovered || hovered.x !== col || hovered.y !== row) { pushTrail(); hovered = { x: col, y: row }; }
    };
    const onLeave = () => { pushTrail(); hovered = null; };
    resize();
    window.addEventListener("resize", resize);
    if (reduce) { draw(); }
    else {
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
      step();
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [bg, border, fill, shape, direction, size, speed]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}`;
}

export const family: BackgroundFamily = {
  slug: "shape-grid",
  name: "Shape Grid",
  category: "Patterns",
  tech: "js",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
  controls: [{ key: "bg", label: "Background", format: "hex" }],
};
