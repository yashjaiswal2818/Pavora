"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "nacre",
  name: "Nacre",
  category: "Gradients",
  tech: "css",
  isDark: false,
};

/* Mother-of-pearl: a slow conic wheel of pastels blurred almost to white, so
   the color reads as iridescence catching the light rather than as a gradient.
   A soft pearl highlight sits off-center where the sheen pools. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`nac-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .nac-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #fbfcff;
        }
        .nac-root::before {
          content: "";
          position: absolute;
          inset: -60%;
          background: conic-gradient(from 0deg at 50% 50%,
            #cdeffe, #e7d9ff, #ffe1ef, #fff0d6, #d9ffe9, #d2f0ff, #cdeffe);
          filter: blur(64px) saturate(1.12);
          opacity: 0.55;
          animation: nac-spin 34s linear infinite;
        }
        .nac-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(42% 34% at 30% 24%, rgba(255, 255, 255, 0.72), transparent 70%);
        }
        .nac-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes nac-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .nac-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Nacre — slow mother-of-pearl iridescence */
.bg-nacre {
  position: relative;
  overflow: hidden;
  background: #fbfcff;
}
.bg-nacre::before {
  content: "";
  position: absolute;
  inset: -60%;
  background: conic-gradient(from 0deg at 50% 50%,
    #cdeffe, #e7d9ff, #ffe1ef, #fff0d6, #d9ffe9, #d2f0ff, #cdeffe);
  filter: blur(64px) saturate(1.12);
  opacity: 0.55;
  animation: nacre-spin 34s linear infinite;
}
/* Pearl highlight */
.bg-nacre::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(42% 34% at 30% 24%, rgba(255, 255, 255, 0.72), transparent 70%);
}
@keyframes nacre-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .bg-nacre::before { animation: none; }
}`;
