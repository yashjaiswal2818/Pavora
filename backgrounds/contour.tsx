"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "contour",
  name: "Contour",
  category: "Patterns",
  tech: "css",
  isDark: false,
};

/* A topographic survey sheet: nested elevation rings around a few summits, with
   heavier index contours every so often, and a slow rake of sunlight crossing
   the paper so it feels like a map on a desk rather than a flat texture. */
const MAP =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='560' viewBox='0 0 800 560'%3E%3Cg fill='none' stroke='%237d93a6' stroke-width='1.1'%3E%3Cg transform='rotate(-16 210 185)'%3E%3Cellipse cx='210' cy='185' rx='26' ry='20'/%3E%3Cellipse cx='210' cy='185' rx='54' ry='42'/%3E%3Cellipse cx='210' cy='185' rx='86' ry='66'/%3E%3Cellipse cx='210' cy='185' rx='120' ry='92'/%3E%3Cellipse cx='210' cy='185' rx='156' ry='120'/%3E%3Cellipse cx='210' cy='185' rx='196' ry='150'/%3E%3C/g%3E%3Cg transform='rotate(22 600 360)'%3E%3Cellipse cx='600' cy='360' rx='22' ry='18'/%3E%3Cellipse cx='600' cy='360' rx='48' ry='40'/%3E%3Cellipse cx='600' cy='360' rx='78' ry='64'/%3E%3Cellipse cx='600' cy='360' rx='112' ry='92'/%3E%3Cellipse cx='600' cy='360' rx='150' ry='122'/%3E%3Cellipse cx='600' cy='360' rx='192' ry='156'/%3E%3C/g%3E%3Cg transform='rotate(-8 430 480)'%3E%3Cellipse cx='430' cy='480' rx='20' ry='16'/%3E%3Cellipse cx='430' cy='480' rx='44' ry='36'/%3E%3Cellipse cx='430' cy='480' rx='72' ry='58'/%3E%3Cellipse cx='430' cy='480' rx='104' ry='84'/%3E%3C/g%3E%3Cg transform='rotate(30 700 120)'%3E%3Cellipse cx='700' cy='120' rx='18' ry='14'/%3E%3Cellipse cx='700' cy='120' rx='40' ry='32'/%3E%3Cellipse cx='700' cy='120' rx='66' ry='52'/%3E%3C/g%3E%3C/g%3E%3Cg fill='none' stroke='%235f7587' stroke-width='2'%3E%3Cg transform='rotate(-16 210 185)'%3E%3Cellipse cx='210' cy='185' rx='120' ry='92'/%3E%3C/g%3E%3Cg transform='rotate(22 600 360)'%3E%3Cellipse cx='600' cy='360' rx='112' ry='92'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
const PAPER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.3 0 0 0 0 0.27 0 0 0 0 0.22 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23p)'/%3E%3C/svg%3E\")";

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`cnt-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .cnt-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background-color: #f4f1e8;
          background-image: ${MAP};
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .cnt-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(40% 50% at 30% 30%, rgba(255, 246, 225, 0.5), transparent 70%);
          mix-blend-mode: soft-light;
          animation: cnt-sun 42s ease-in-out infinite alternate;
        }
        .cnt-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: ${PAPER};
          opacity: 0.07;
        }
        .cnt-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes cnt-sun {
          from { transform: translate(-12%, -6%); }
          to   { transform: translate(14%, 8%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cnt-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Contour — topographic survey map with a slow rake of sunlight */
.bg-contour {
  position: relative;
  overflow: hidden;
  background-color: #f4f1e8;
  background-image: ${MAP};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
/* Raking sunlight */
.bg-contour::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(40% 50% at 30% 30%, rgba(255, 246, 225, 0.5), transparent 70%);
  mix-blend-mode: soft-light;
  animation: contour-sun 42s ease-in-out infinite alternate;
}
/* Paper tooth */
.bg-contour::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: ${PAPER};
  opacity: 0.07;
}
@keyframes contour-sun {
  from { transform: translate(-12%, -6%); }
  to   { transform: translate(14%, 8%); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-contour::before { animation: none; }
}`;
