"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "lava-lamp",
  name: "Lava Lamp",
  category: "Mesh",
  tech: "css",
  isDark: true,
};

/* Two ember blobs over a heat glow: each one rises and falls on its own
   clock while its border-radius morphs, so they never repeat in sync. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`ll-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .ll-root {
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 70% at 50% 115%, #3e0e19 0%, #1f0713 46%, #0d030c 100%);
          overflow: hidden;
        }
        .ll-root::before,
        .ll-root::after {
          content: "";
          position: absolute;
          aspect-ratio: 1;
          mix-blend-mode: screen;
          filter: blur(34px) saturate(1.2);
        }
        .ll-root::before {
          left: 6%;
          top: 14%;
          width: 48%;
          background: radial-gradient(circle at 32% 28%, #ffb15e 0%, #ff5e6c 48%, #c22a68 78%, transparent 100%);
          opacity: 0.8;
          border-radius: 46% 54% 58% 42% / 52% 44% 56% 48%;
          animation:
            ll-rise-a 26s ease-in-out infinite alternate,
            ll-morph 18s ease-in-out infinite alternate;
        }
        .ll-root::after {
          right: 4%;
          top: 30%;
          width: 38%;
          background: radial-gradient(circle at 60% 35%, #ff7a59 0%, #d62e63 52%, #8e2156 80%, transparent 100%);
          opacity: 0.7;
          border-radius: 58% 42% 44% 56% / 46% 58% 42% 54%;
          animation:
            ll-rise-b 31s ease-in-out infinite alternate,
            ll-morph 23s ease-in-out infinite alternate-reverse;
        }
        .ll-root[data-playing="false"]::before,
        .ll-root[data-playing="false"]::after { animation-play-state: paused; }
        @keyframes ll-rise-a {
          from { transform: translateY(26%) rotate(-4deg); }
          to   { transform: translateY(-20%) rotate(5deg); }
        }
        @keyframes ll-rise-b {
          from { transform: translateY(-28%) rotate(6deg); }
          to   { transform: translateY(24%) rotate(-3deg); }
        }
        @keyframes ll-morph {
          from { border-radius: 46% 54% 58% 42% / 52% 44% 56% 48%; }
          50%  { border-radius: 58% 42% 44% 56% / 46% 58% 42% 54%; }
          to   { border-radius: 42% 58% 52% 48% / 58% 42% 60% 40%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ll-root::before, .ll-root::after { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Lava Lamp — morphing ember blobs over a heat glow */
.bg-lava-lamp {
  position: relative;
  background: radial-gradient(120% 70% at 50% 115%, #3e0e19 0%, #1f0713 46%, #0d030c 100%);
  overflow: hidden;
}
.bg-lava-lamp::before,
.bg-lava-lamp::after {
  content: "";
  position: absolute;
  aspect-ratio: 1;
  mix-blend-mode: screen;
  filter: blur(34px) saturate(1.2);
}
.bg-lava-lamp::before {
  left: 6%;
  top: 14%;
  width: 48%;
  background: radial-gradient(circle at 32% 28%, #ffb15e 0%, #ff5e6c 48%, #c22a68 78%, transparent 100%);
  opacity: 0.8;
  border-radius: 46% 54% 58% 42% / 52% 44% 56% 48%;
  animation:
    lava-lamp-rise-a 26s ease-in-out infinite alternate,
    lava-lamp-morph 18s ease-in-out infinite alternate;
}
.bg-lava-lamp::after {
  right: 4%;
  top: 30%;
  width: 38%;
  background: radial-gradient(circle at 60% 35%, #ff7a59 0%, #d62e63 52%, #8e2156 80%, transparent 100%);
  opacity: 0.7;
  border-radius: 58% 42% 44% 56% / 46% 58% 42% 54%;
  animation:
    lava-lamp-rise-b 31s ease-in-out infinite alternate,
    lava-lamp-morph 23s ease-in-out infinite alternate-reverse;
}
@keyframes lava-lamp-rise-a {
  from { transform: translateY(26%) rotate(-4deg); }
  to   { transform: translateY(-20%) rotate(5deg); }
}
@keyframes lava-lamp-rise-b {
  from { transform: translateY(-28%) rotate(6deg); }
  to   { transform: translateY(24%) rotate(-3deg); }
}
@keyframes lava-lamp-morph {
  from { border-radius: 46% 54% 58% 42% / 52% 44% 56% 48%; }
  50%  { border-radius: 58% 42% 44% 56% / 46% 58% 42% 54%; }
  to   { border-radius: 42% 58% 52% 48% / 58% 42% 60% 40%; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-lava-lamp::before, .bg-lava-lamp::after { animation: none; }
}`;
