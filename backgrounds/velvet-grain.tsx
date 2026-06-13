"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "velvet-grain",
  name: "Velvet Grain",
  category: "Gradients",
  tech: "css",
  isDark: true,
};

/* A deep spruce-green glow under animated film grain. The grain is an SVG
   turbulence tile that jitters at ~10fps with step-end, so it reads as film
   stock rather than a swimming texture. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.85 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E\")";

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`vg-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .vg-root {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(130% 100% at 12% 100%, #16301f 0%, #0d1d13 36%, #070e0a 64%, #040705 100%);
          overflow: hidden;
        }
        .vg-root::before {
          content: "";
          position: absolute;
          inset: -20%;
          background:
            radial-gradient(46% 38% at 28% 76%, rgba(74, 158, 104, 0.42), transparent 70%),
            radial-gradient(30% 26% at 82% 14%, rgba(196, 158, 92, 0.10), transparent 70%);
          animation: vg-drift 26s ease-in-out infinite alternate;
        }
        .vg-root::after {
          content: "";
          position: absolute;
          inset: -140px;
          background-image: ${NOISE};
          opacity: 0.5;
          mix-blend-mode: overlay;
          animation: vg-grain 0.9s step-end infinite;
        }
        .vg-root[data-playing="false"]::before,
        .vg-root[data-playing="false"]::after { animation-play-state: paused; }
        @keyframes vg-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(3%, -4%) scale(1.08); }
        }
        @keyframes vg-grain {
          0%, 100% { transform: translate(0, 0); }
          12.5% { transform: translate(-32px, 24px); }
          25%   { transform: translate(18px, -40px); }
          37.5% { transform: translate(-44px, -12px); }
          50%   { transform: translate(36px, 30px); }
          62.5% { transform: translate(-14px, 44px); }
          75%   { transform: translate(42px, -26px); }
          87.5% { transform: translate(-26px, -36px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vg-root::before, .vg-root::after { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Velvet Grain — spruce glow under jittering film grain */
.bg-velvet-grain {
  position: relative;
  background:
    radial-gradient(130% 100% at 12% 100%, #16301f 0%, #0d1d13 36%, #070e0a 64%, #040705 100%);
  overflow: hidden;
}
.bg-velvet-grain::before {
  content: "";
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(46% 38% at 28% 76%, rgba(74, 158, 104, 0.42), transparent 70%),
    radial-gradient(30% 26% at 82% 14%, rgba(196, 158, 92, 0.10), transparent 70%);
  animation: velvet-grain-drift 26s ease-in-out infinite alternate;
}
.bg-velvet-grain::after {
  content: "";
  position: absolute;
  inset: -140px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.85 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E");
  opacity: 0.5;
  mix-blend-mode: overlay;
  animation: velvet-grain-flicker 0.9s step-end infinite;
}
@keyframes velvet-grain-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(3%, -4%) scale(1.08); }
}
@keyframes velvet-grain-flicker {
  0%, 100% { transform: translate(0, 0); }
  12.5% { transform: translate(-32px, 24px); }
  25%   { transform: translate(18px, -40px); }
  37.5% { transform: translate(-44px, -12px); }
  50%   { transform: translate(36px, 30px); }
  62.5% { transform: translate(-14px, 44px); }
  75%   { transform: translate(42px, -26px); }
  87.5% { transform: translate(-26px, -36px); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-velvet-grain::before, .bg-velvet-grain::after { animation: none; }
}`;
