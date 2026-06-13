"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "gilded-hour",
  name: "Gilded Hour",
  category: "Gradients",
  tech: "css",
  isDark: false,
};

/* Brushed gold leaf: fine vertical striations under a warm champagne field,
   with a single band of light raking slowly across the metal the way a sheen
   travels when you tilt a gilded surface toward the window. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`gld-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .gld-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: linear-gradient(100deg, #b3893a 0%, #e3c87e 30%, #c9a456 54%, #e7cf86 78%, #ad8638 100%);
        }
        .gld-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(91deg, rgba(255, 249, 228, 0.10) 0 1px, rgba(108, 80, 28, 0.06) 1px 3px);
          mix-blend-mode: overlay;
        }
        .gld-root::after {
          content: "";
          position: absolute;
          top: -50%;
          height: 200%;
          left: 0;
          width: 42%;
          background: linear-gradient(100deg, transparent, rgba(255, 250, 234, 0.6) 50%, transparent);
          filter: blur(5px);
          transform: translateX(-170%) skewX(-12deg);
          animation: gld-sheen 7.5s ease-in-out infinite;
        }
        .gld-root[data-playing="false"]::after { animation-play-state: paused; }
        @keyframes gld-sheen {
          0%        { transform: translateX(-170%) skewX(-12deg); }
          55%, 100% { transform: translateX(380%) skewX(-12deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gld-root::after { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Gilded Hour — brushed gold with a slow raking sheen */
.bg-gilded-hour {
  position: relative;
  overflow: hidden;
  background: linear-gradient(100deg, #b3893a 0%, #e3c87e 30%, #c9a456 54%, #e7cf86 78%, #ad8638 100%);
}
/* Brushed striations */
.bg-gilded-hour::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(91deg, rgba(255, 249, 228, 0.10) 0 1px, rgba(108, 80, 28, 0.06) 1px 3px);
  mix-blend-mode: overlay;
}
/* Raking sheen */
.bg-gilded-hour::after {
  content: "";
  position: absolute;
  top: -50%;
  height: 200%;
  left: 0;
  width: 42%;
  background: linear-gradient(100deg, transparent, rgba(255, 250, 234, 0.6) 50%, transparent);
  filter: blur(5px);
  transform: translateX(-170%) skewX(-12deg);
  animation: gilded-hour-sheen 7.5s ease-in-out infinite;
}
@keyframes gilded-hour-sheen {
  0%        { transform: translateX(-170%) skewX(-12deg); }
  55%, 100% { transform: translateX(380%) skewX(-12deg); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-gilded-hour::after { animation: none; opacity: 0; }
}`;
