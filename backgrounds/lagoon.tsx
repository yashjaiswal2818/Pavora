"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "lagoon",
  name: "Lagoon",
  category: "Mesh",
  tech: "css",
  isDark: false,
};

/* Shallow tropical water seen from above: turquoise grading into seafoam over
   a warm sand bank, with two crossing nets of caustic light rippling on the
   surface. The crossing light is what reads as moving water. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`lag-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .lag-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #dff0ea;
        }
        .lag-root::before {
          content: "";
          position: absolute;
          inset: -14%;
          background:
            radial-gradient(46% 40% at 24% 30%, rgba(63, 182, 196, 0.55), transparent 68%),
            radial-gradient(50% 44% at 78% 26%, rgba(111, 211, 208, 0.5), transparent 70%),
            radial-gradient(54% 48% at 64% 76%, rgba(167, 230, 216, 0.55), transparent 72%),
            radial-gradient(40% 36% at 20% 82%, rgba(231, 216, 182, 0.6), transparent 70%);
          filter: blur(34px);
          animation: lag-drift 40s ease-in-out infinite alternate;
        }
        .lag-root::after {
          content: "";
          position: absolute;
          inset: -6%;
          background:
            repeating-linear-gradient(64deg, rgba(255, 255, 255, 0.1) 0 2px, transparent 2px 22px),
            repeating-linear-gradient(-58deg, rgba(255, 255, 255, 0.06) 0 2px, transparent 2px 30px);
          mix-blend-mode: soft-light;
          opacity: 0.7;
          animation: lag-shimmer 13s ease-in-out infinite alternate;
        }
        .lag-root[data-playing="false"]::before,
        .lag-root[data-playing="false"]::after { animation-play-state: paused; }
        @keyframes lag-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-2%, 1.5%) scale(1.05); }
        }
        @keyframes lag-shimmer {
          from { transform: translateX(-2%); }
          to   { transform: translateX(2%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lag-root::before, .lag-root::after { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Lagoon — tropical shallows with crossing caustic light */
.bg-lagoon {
  position: relative;
  overflow: hidden;
  background: #dff0ea;
}
.bg-lagoon::before {
  content: "";
  position: absolute;
  inset: -14%;
  background:
    radial-gradient(46% 40% at 24% 30%, rgba(63, 182, 196, 0.55), transparent 68%),
    radial-gradient(50% 44% at 78% 26%, rgba(111, 211, 208, 0.5), transparent 70%),
    radial-gradient(54% 48% at 64% 76%, rgba(167, 230, 216, 0.55), transparent 72%),
    radial-gradient(40% 36% at 20% 82%, rgba(231, 216, 182, 0.6), transparent 70%);
  filter: blur(34px);
  animation: lagoon-drift 40s ease-in-out infinite alternate;
}
/* Caustic light nets */
.bg-lagoon::after {
  content: "";
  position: absolute;
  inset: -6%;
  background:
    repeating-linear-gradient(64deg, rgba(255, 255, 255, 0.1) 0 2px, transparent 2px 22px),
    repeating-linear-gradient(-58deg, rgba(255, 255, 255, 0.06) 0 2px, transparent 2px 30px);
  mix-blend-mode: soft-light;
  opacity: 0.7;
  animation: lagoon-shimmer 13s ease-in-out infinite alternate;
}
@keyframes lagoon-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-2%, 1.5%) scale(1.05); }
}
@keyframes lagoon-shimmer {
  from { transform: translateX(-2%); }
  to   { transform: translateX(2%); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-lagoon::before, .bg-lagoon::after { animation: none; }
}`;
