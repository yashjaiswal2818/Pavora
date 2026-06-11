"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "cotton-candy",
  name: "Cotton Candy",
  category: "Mesh",
  tech: "css",
  isDark: false,
};

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`cc-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .cc-root {
          position: absolute;
          inset: 0;
          background: #fbfaff;
          overflow: hidden;
        }
        .cc-root::before {
          content: "";
          position: absolute;
          inset: -25%;
          background:
            radial-gradient(38% 38% at 28% 32%, #ffc2e2, transparent 70%),
            radial-gradient(42% 42% at 72% 30%, #c7d2ff, transparent 70%),
            radial-gradient(40% 40% at 60% 72%, #b8f0ff, transparent 70%),
            radial-gradient(34% 34% at 30% 76%, #e7c2ff, transparent 70%);
          filter: blur(48px);
          animation: cc-drift 22s ease-in-out infinite;
        }
        .cc-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes cc-drift {
          0%, 100% { transform: translate(0, 0) scale(1.05); }
          50%      { transform: translate(-3%, 2%) scale(1.12); }
        }
        @media (prefers-reduced-motion: reduce) { .cc-root::before { animation: none; } }
      `}</style>
    </div>
  );
}

export const code = `/* Cotton Candy — soft pastel mesh */
.bg-cotton-candy {
  position: relative;
  background: #fbfaff;
  overflow: hidden;
}
.bg-cotton-candy::before {
  content: "";
  position: absolute;
  inset: -25%;
  background:
    radial-gradient(38% 38% at 28% 32%, #ffc2e2, transparent 70%),
    radial-gradient(42% 42% at 72% 30%, #c7d2ff, transparent 70%),
    radial-gradient(40% 40% at 60% 72%, #b8f0ff, transparent 70%),
    radial-gradient(34% 34% at 30% 76%, #e7c2ff, transparent 70%);
  filter: blur(48px);
  animation: cotton-candy 22s ease-in-out infinite;
}
@keyframes cotton-candy {
  0%, 100% { transform: translate(0, 0) scale(1.05); }
  50%      { transform: translate(-3%, 2%) scale(1.12); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-cotton-candy::before { animation: none; }
}`;
