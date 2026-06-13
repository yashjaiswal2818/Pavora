"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "ink-wash",
  name: "Ink Wash",
  category: "Mesh",
  tech: "css",
  isDark: false,
};

/* Sumi-e fog: diluted gray-indigo washes drifting almost imperceptibly on
   cool porcelain, with a hint of paper grain. The quiet one — calm enough
   to sit behind a reading page or a dashboard. */
const PAPER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.22 0 0 0 0 0.3 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23p)'/%3E%3C/svg%3E\")";

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`iw-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .iw-root {
          position: absolute;
          inset: 0;
          background: #f7f8fa;
          overflow: hidden;
        }
        .iw-root::before {
          content: "";
          position: absolute;
          inset: -15%;
          background:
            radial-gradient(42% 34% at 22% 26%, rgba(94, 112, 146, 0.26), transparent 70%),
            radial-gradient(50% 40% at 80% 22%, rgba(70, 84, 110, 0.2), transparent 70%),
            radial-gradient(54% 44% at 56% 80%, rgba(106, 122, 150, 0.24), transparent 72%),
            radial-gradient(28% 24% at 38% 58%, rgba(138, 154, 182, 0.16), transparent 70%);
          filter: blur(40px);
          animation: iw-drift 46s ease-in-out infinite alternate;
        }
        .iw-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: ${PAPER};
          opacity: 0.13;
        }
        .iw-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes iw-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-3%, 2%) scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .iw-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Ink Wash — drifting sumi-e fog on porcelain */
.bg-ink-wash {
  position: relative;
  background: #f7f8fa;
  overflow: hidden;
}
.bg-ink-wash::before {
  content: "";
  position: absolute;
  inset: -15%;
  background:
    radial-gradient(42% 34% at 22% 26%, rgba(94, 112, 146, 0.26), transparent 70%),
    radial-gradient(50% 40% at 80% 22%, rgba(70, 84, 110, 0.2), transparent 70%),
    radial-gradient(54% 44% at 56% 80%, rgba(106, 122, 150, 0.24), transparent 72%),
    radial-gradient(28% 24% at 38% 58%, rgba(138, 154, 182, 0.16), transparent 70%);
  filter: blur(40px);
  animation: ink-wash-drift 46s ease-in-out infinite alternate;
}
/* Paper grain */
.bg-ink-wash::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.22 0 0 0 0 0.3 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23p)'/%3E%3C/svg%3E");
  opacity: 0.13;
}
@keyframes ink-wash-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-3%, 2%) scale(1.06); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-ink-wash::before { animation: none; }
}`;
