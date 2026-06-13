"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "glacier",
  name: "Glacier",
  category: "Gradients",
  tech: "css",
  isDark: false,
};

/* Glacier ice: a pale blue field with a single bright shaft of light cutting
   diagonally like a crevasse catching the sun, plus a fine cool frost grain so
   the surface reads as ice instead of flat paper. Calm enough to sit dark text
   straight on top. */
const FROST =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.55 0 0 0 0 0.72 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23f)'/%3E%3C/svg%3E\")";

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`gla-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .gla-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: linear-gradient(158deg, #eff6fc 0%, #dde9f3 54%, #cfe0ee 100%);
        }
        .gla-root::before {
          content: "";
          position: absolute;
          inset: -12%;
          background:
            linear-gradient(122deg, transparent 38%, rgba(255, 255, 255, 0.72) 50%, transparent 62%),
            radial-gradient(50% 40% at 78% 20%, rgba(178, 213, 238, 0.5), transparent 70%),
            radial-gradient(46% 38% at 16% 86%, rgba(166, 201, 230, 0.46), transparent 72%);
          filter: blur(10px);
          animation: gla-drift 26s ease-in-out infinite alternate;
        }
        .gla-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: ${FROST};
          opacity: 0.4;
        }
        .gla-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes gla-drift {
          from { transform: translate(0, 0); }
          to   { transform: translate(-2%, 1.6%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gla-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Glacier — ice field with a diagonal crevasse-light shaft */
.bg-glacier {
  position: relative;
  overflow: hidden;
  background: linear-gradient(158deg, #eff6fc 0%, #dde9f3 54%, #cfe0ee 100%);
}
/* Crevasse light + depth glows */
.bg-glacier::before {
  content: "";
  position: absolute;
  inset: -12%;
  background:
    linear-gradient(122deg, transparent 38%, rgba(255, 255, 255, 0.72) 50%, transparent 62%),
    radial-gradient(50% 40% at 78% 20%, rgba(178, 213, 238, 0.5), transparent 70%),
    radial-gradient(46% 38% at 16% 86%, rgba(166, 201, 230, 0.46), transparent 72%);
  filter: blur(10px);
  animation: glacier-drift 26s ease-in-out infinite alternate;
}
/* Cool frost grain */
.bg-glacier::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.55 0 0 0 0 0.72 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23f)'/%3E%3C/svg%3E");
  opacity: 0.4;
}
@keyframes glacier-drift {
  from { transform: translate(0, 0); }
  to   { transform: translate(-2%, 1.6%); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-glacier::before { animation: none; }
}`;
