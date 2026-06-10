"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "peachy-glow",
  name: "Peachy Glow",
  category: "Gradients",
  tech: "css",
  animated: true,
  isDark: false,
  author: "your-username",
  github: "https://github.com/your-username",
  tags: ["light", "warm", "soft"],
};

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`pg-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .pg-root {
          position: absolute;
          inset: 0;
          background: #fff5ef;
          overflow: hidden;
        }
        .pg-root::before {
          content: "";
          position: absolute;
          inset: -30%;
          background:
            radial-gradient(40% 40% at 25% 30%, #ffd9c2, transparent 70%),
            radial-gradient(45% 45% at 75% 35%, #ffc9e0, transparent 70%),
            radial-gradient(42% 42% at 55% 78%, #ffe7b8, transparent 70%);
          animation: pg-float 18s ease-in-out infinite;
        }
        .pg-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes pg-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(2%, -2%) scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) { .pg-root::before { animation: none; } }
      `}</style>
    </div>
  );
}

export const code = `/* Peachy Glow — soft drifting warm radial glow */
.bg-peachy-glow {
  position: relative;
  background: #fff5ef;
  overflow: hidden;
}
.bg-peachy-glow::before {
  content: "";
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(40% 40% at 25% 30%, #ffd9c2, transparent 70%),
    radial-gradient(45% 45% at 75% 35%, #ffc9e0, transparent 70%),
    radial-gradient(42% 42% at 55% 78%, #ffe7b8, transparent 70%);
  animation: peachy-glow 18s ease-in-out infinite;
}
@keyframes peachy-glow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(2%, -2%) scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-peachy-glow::before { animation: none; }
}`;
