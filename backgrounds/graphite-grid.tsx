"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "graphite-grid",
  name: "Graphite Grid",
  category: "Patterns",
  tech: "css",
  isDark: true,
};

/* A drafting table after dark: fine minor grid, stronger major grid, and a
   small glowing plus-tick at every major intersection, pulsing slowly. */
const TICK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cpath d='M48 41v14M41 48h14' stroke='%23a8c0e8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")";

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`gg-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .gg-root {
          position: absolute;
          inset: 0;
          background-color: #14171d;
          background-image:
            radial-gradient(120% 90% at 50% 12%, rgba(104, 136, 196, 0.09), transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 100% 100%, 96px 96px, 96px 96px, 16px 16px, 16px 16px;
        }
        .gg-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: ${TICK};
          background-size: 96px 96px;
          background-position: 48px 48px;
          animation: gg-pulse 6.5s ease-in-out infinite alternate;
        }
        .gg-root[data-playing="false"]::after { animation-play-state: paused; }
        @keyframes gg-pulse {
          from { opacity: 0.35; }
          to   { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gg-root::after { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Graphite Grid — dark drafting grid with pulsing plus-ticks */
.bg-graphite-grid {
  position: relative;
  background-color: #14171d;
  background-image:
    radial-gradient(120% 90% at 50% 12%, rgba(104, 136, 196, 0.09), transparent 60%),
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 100% 100%, 96px 96px, 96px 96px, 16px 16px, 16px 16px;
}
/* Plus-ticks at major intersections */
.bg-graphite-grid::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cpath d='M48 41v14M41 48h14' stroke='%23a8c0e8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-size: 96px 96px;
  background-position: 48px 48px;
  animation: graphite-grid-pulse 6.5s ease-in-out infinite alternate;
}
@keyframes graphite-grid-pulse {
  from { opacity: 0.35; }
  to   { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-graphite-grid::after { animation: none; }
}`;
