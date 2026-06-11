"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "sunset-drift",
  name: "Sunset Drift",
  category: "Gradients",
  tech: "css",
  isDark: true,
};

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`sd-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .sd-root {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, #1b0b3a, #5b1a6f 30%, #b5277a 62%, #ff7a3d);
          background-size: 220% 220%;
          animation: sd-pan 16s ease-in-out infinite;
        }
        .sd-root[data-playing="false"] { animation-play-state: paused; }
        @keyframes sd-pan {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) { .sd-root { animation: none; } }
      `}</style>
    </div>
  );
}

export const code = `/* Sunset Drift — animated warm gradient */
.bg-sunset-drift {
  background: linear-gradient(120deg, #1b0b3a, #5b1a6f 30%, #b5277a 62%, #ff7a3d);
  background-size: 220% 220%;
  animation: sunset-drift 16s ease-in-out infinite;
}
@keyframes sunset-drift {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-sunset-drift { animation: none; }
}`;
