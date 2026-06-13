"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "limelight",
  name: "Limelight",
  category: "Gradients",
  tech: "css",
  isDark: true,
};

/* One warm theatrical spotlight on a dark stage, breathing the way a real
   lamp does as its filament settles, with a faint pool of light gathering on
   the floor below. Built to seat a centered hero inside the beam. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`lim-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .lim-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #09090b;
        }
        .lim-root::before {
          content: "";
          position: absolute;
          left: 50%;
          top: -28%;
          width: 86%;
          height: 128%;
          transform: translateX(-50%);
          transform-origin: 50% 0;
          background: radial-gradient(closest-side, rgba(255, 230, 178, 0.5), rgba(255, 211, 150, 0.16) 42%, transparent 72%);
          filter: blur(14px);
          animation: lim-breathe 7.5s ease-in-out infinite alternate;
        }
        .lim-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(58% 26% at 50% 97%, rgba(255, 209, 150, 0.12), transparent 70%),
            radial-gradient(125% 100% at 50% 28%, transparent 52%, rgba(0, 0, 0, 0.58));
        }
        .lim-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes lim-breathe {
          from { opacity: 0.76; transform: translateX(-50%) scaleY(0.97); }
          to   { opacity: 1; transform: translateX(-50%) scaleY(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lim-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Limelight — a single breathing theatrical spotlight */
.bg-limelight {
  position: relative;
  overflow: hidden;
  background: #09090b;
}
/* The beam */
.bg-limelight::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -28%;
  width: 86%;
  height: 128%;
  transform: translateX(-50%);
  transform-origin: 50% 0;
  background: radial-gradient(closest-side, rgba(255, 230, 178, 0.5), rgba(255, 211, 150, 0.16) 42%, transparent 72%);
  filter: blur(14px);
  animation: limelight-breathe 7.5s ease-in-out infinite alternate;
}
/* Floor pool + vignette */
.bg-limelight::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(58% 26% at 50% 97%, rgba(255, 209, 150, 0.12), transparent 70%),
    radial-gradient(125% 100% at 50% 28%, transparent 52%, rgba(0, 0, 0, 0.58));
}
@keyframes limelight-breathe {
  from { opacity: 0.76; transform: translateX(-50%) scaleY(0.97); }
  to   { opacity: 1; transform: translateX(-50%) scaleY(1.05); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-limelight::before { animation: none; }
}`;
