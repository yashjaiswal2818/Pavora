"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "aurora-veil",
  name: "Aurora Veil",
  category: "Mesh",
  tech: "css",
  animated: true,
  isDark: true,
  author: "your-username",
  github: "https://github.com/your-username",
  tags: ["aurora", "dark", "glow"],
};

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`av-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .av-root {
          position: absolute;
          inset: 0;
          background: #05060a;
          overflow: hidden;
        }
        .av-root::before {
          content: "";
          position: absolute;
          inset: -25%;
          background:
            radial-gradient(35% 35% at 30% 40%, #1fb6a6, transparent 70%),
            radial-gradient(40% 40% at 70% 30%, #5b6cff, transparent 70%),
            radial-gradient(45% 45% at 55% 70%, #9b3df0, transparent 70%),
            radial-gradient(30% 30% at 20% 78%, #28d17c, transparent 70%);
          filter: blur(40px) saturate(1.2);
          animation: av-drift 20s ease-in-out infinite;
        }
        .av-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes av-drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1.05); }
          33%      { transform: translate(-4%, 3%) rotate(4deg) scale(1.12); }
          66%      { transform: translate(3%, -3%) rotate(-3deg) scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) { .av-root::before { animation: none; } }
      `}</style>
    </div>
  );
}

export const code = `/* Aurora Veil — flowing aurora over near-black */
.bg-aurora-veil {
  position: relative;
  background: #05060a;
  overflow: hidden;
}
.bg-aurora-veil::before {
  content: "";
  position: absolute;
  inset: -25%;
  background:
    radial-gradient(35% 35% at 30% 40%, #1fb6a6, transparent 70%),
    radial-gradient(40% 40% at 70% 30%, #5b6cff, transparent 70%),
    radial-gradient(45% 45% at 55% 70%, #9b3df0, transparent 70%),
    radial-gradient(30% 30% at 20% 78%, #28d17c, transparent 70%);
  filter: blur(40px) saturate(1.2);
  animation: aurora-veil 20s ease-in-out infinite;
}
@keyframes aurora-veil {
  0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1.05); }
  33%      { transform: translate(-4%, 3%) rotate(4deg) scale(1.12); }
  66%      { transform: translate(3%, -3%) rotate(-3deg) scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-aurora-veil::before { animation: none; }
}`;
