"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "plume",
  name: "Plume",
  category: "Mesh",
  tech: "css",
  isDark: true,
};

/* Slow smoke off a dark backdrop: two veils of grey drift up and curl against
   each other on different clocks, never repeating in sync, with a faint warm
   glow at the base hinting at whatever is smouldering below. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`plm-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .plm-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #0b0d10;
        }
        .plm-root::before {
          content: "";
          position: absolute;
          inset: -30%;
          background:
            radial-gradient(38% 50% at 40% 70%, rgba(150, 162, 180, 0.18), transparent 70%),
            radial-gradient(30% 44% at 60% 50%, rgba(128, 140, 160, 0.14), transparent 72%),
            radial-gradient(34% 48% at 50% 30%, rgba(170, 182, 200, 0.1), transparent 74%);
          filter: blur(34px);
          animation: plm-rise-a 26s ease-in-out infinite alternate;
        }
        .plm-root::after {
          content: "";
          position: absolute;
          inset: -30%;
          background:
            radial-gradient(30% 46% at 30% 60%, rgba(140, 152, 172, 0.14), transparent 72%),
            radial-gradient(36% 50% at 68% 76%, rgba(120, 132, 152, 0.12), transparent 72%),
            radial-gradient(42% 30% at 50% 98%, rgba(180, 122, 82, 0.12), transparent 70%);
          filter: blur(40px);
          animation: plm-rise-b 34s ease-in-out infinite alternate;
        }
        .plm-root[data-playing="false"]::before,
        .plm-root[data-playing="false"]::after { animation-play-state: paused; }
        @keyframes plm-rise-a {
          from { transform: translateY(4%) rotate(-3deg) scale(1); }
          to   { transform: translateY(-5%) rotate(3deg) scale(1.08); }
        }
        @keyframes plm-rise-b {
          from { transform: translateY(5%) rotate(2deg) scale(1.05); }
          to   { transform: translateY(-4%) rotate(-3deg) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .plm-root::before, .plm-root::after { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Plume — two veils of slow smoke over a faint ember glow */
.bg-plume {
  position: relative;
  overflow: hidden;
  background: #0b0d10;
}
.bg-plume::before {
  content: "";
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(38% 50% at 40% 70%, rgba(150, 162, 180, 0.18), transparent 70%),
    radial-gradient(30% 44% at 60% 50%, rgba(128, 140, 160, 0.14), transparent 72%),
    radial-gradient(34% 48% at 50% 30%, rgba(170, 182, 200, 0.1), transparent 74%);
  filter: blur(34px);
  animation: plume-rise-a 26s ease-in-out infinite alternate;
}
.bg-plume::after {
  content: "";
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(30% 46% at 30% 60%, rgba(140, 152, 172, 0.14), transparent 72%),
    radial-gradient(36% 50% at 68% 76%, rgba(120, 132, 152, 0.12), transparent 72%),
    radial-gradient(42% 30% at 50% 98%, rgba(180, 122, 82, 0.12), transparent 70%);
  filter: blur(40px);
  animation: plume-rise-b 34s ease-in-out infinite alternate;
}
@keyframes plume-rise-a {
  from { transform: translateY(4%) rotate(-3deg) scale(1); }
  to   { transform: translateY(-5%) rotate(3deg) scale(1.08); }
}
@keyframes plume-rise-b {
  from { transform: translateY(5%) rotate(2deg) scale(1.05); }
  to   { transform: translateY(-4%) rotate(-3deg) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-plume::before, .bg-plume::after { animation: none; }
}`;
