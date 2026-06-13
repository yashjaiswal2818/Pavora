"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "raw-silk",
  name: "Raw Silk",
  category: "Mesh",
  tech: "css",
  isDark: false,
};

/* Draped fabric in pearl and taupe: two near-vertical stripe systems with
   different periods interfere to make irregular folds, and a slow band of
   light slides across like sheen on silk. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`rsk-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .rsk-root {
          position: absolute;
          inset: 0;
          background: #f1efe9;
          overflow: hidden;
        }
        .rsk-root::before {
          content: "";
          position: absolute;
          inset: -12%;
          background:
            repeating-linear-gradient(97deg,
              transparent 0px, rgba(176, 166, 144, 0.34) 38px,
              rgba(255, 255, 255, 0.9) 74px, rgba(189, 180, 158, 0.28) 112px,
              transparent 150px),
            repeating-linear-gradient(84deg,
              transparent 0px, rgba(255, 255, 255, 0.75) 90px,
              rgba(170, 160, 138, 0.3) 166px, transparent 240px);
          filter: blur(14px);
          transform-origin: 60% 40%;
          animation: rsk-breathe 30s ease-in-out infinite alternate;
        }
        .rsk-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(108deg, transparent 40%, rgba(255, 255, 255, 0.9) 50%, transparent 60%);
          background-size: 280% 100%;
          background-position: 0% 0;
          opacity: 0.8;
          animation: rsk-sheen 24s ease-in-out infinite alternate;
        }
        .rsk-root[data-playing="false"]::before,
        .rsk-root[data-playing="false"]::after { animation-play-state: paused; }
        @keyframes rsk-breathe {
          from { transform: scale(1) rotate(0deg); }
          to   { transform: scale(1.07) rotate(1.5deg); }
        }
        @keyframes rsk-sheen {
          from { background-position: 0% 0; }
          to   { background-position: 100% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rsk-root::before, .rsk-root::after { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Raw Silk — interfering fabric folds with a sliding sheen */
.bg-raw-silk {
  position: relative;
  background: #f1efe9;
  overflow: hidden;
}
.bg-raw-silk::before {
  content: "";
  position: absolute;
  inset: -12%;
  background:
    repeating-linear-gradient(97deg,
      transparent 0px, rgba(176, 166, 144, 0.34) 38px,
      rgba(255, 255, 255, 0.9) 74px, rgba(189, 180, 158, 0.28) 112px,
      transparent 150px),
    repeating-linear-gradient(84deg,
      transparent 0px, rgba(255, 255, 255, 0.75) 90px,
      rgba(170, 160, 138, 0.3) 166px, transparent 240px);
  filter: blur(14px);
  transform-origin: 60% 40%;
  animation: raw-silk-breathe 30s ease-in-out infinite alternate;
}
.bg-raw-silk::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(108deg, transparent 40%, rgba(255, 255, 255, 0.9) 50%, transparent 60%);
  background-size: 280% 100%;
  background-position: 0% 0;
  opacity: 0.8;
  animation: raw-silk-sheen 24s ease-in-out infinite alternate;
}
@keyframes raw-silk-breathe {
  from { transform: scale(1) rotate(0deg); }
  to   { transform: scale(1.07) rotate(1.5deg); }
}
@keyframes raw-silk-sheen {
  from { background-position: 0% 0; }
  to   { background-position: 100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-raw-silk::before, .bg-raw-silk::after { animation: none; }
}`;
