"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "abyss",
  name: "Abyss",
  category: "Gradients",
  tech: "css",
  isDark: true,
};

/* The descent into deep water: a lit teal surface up top falling away to
   near-black, with caustic light from above wavering across the first few
   meters. The thin angled light-lines over the soft surface glow are what
   sells it as water rather than just a dark gradient. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`aby-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .aby-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: linear-gradient(180deg, #0e424c 0%, #073039 20%, #04222a 42%, #02141a 68%, #010a0e 100%);
        }
        .aby-root::before {
          content: "";
          position: absolute;
          left: -20%;
          right: -20%;
          top: -12%;
          height: 56%;
          background:
            radial-gradient(58% 42% at 32% 0%, rgba(150, 232, 236, 0.24), transparent 70%),
            radial-gradient(52% 40% at 72% 0%, rgba(116, 208, 220, 0.16), transparent 72%),
            repeating-linear-gradient(74deg, rgba(176, 244, 248, 0.06) 0 2px, transparent 2px 27px);
          filter: blur(8px);
          animation: aby-caustic 15s ease-in-out infinite alternate;
        }
        .aby-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 78% at 50% 0%, transparent 48%, rgba(0, 0, 0, 0.5) 100%);
        }
        .aby-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes aby-caustic {
          from { transform: translateX(-3%) skewX(0deg); opacity: 0.78; }
          to   { transform: translateX(3%) skewX(-5deg); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aby-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Abyss — deep-water descent with wavering caustic light */
.bg-abyss {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0e424c 0%, #073039 20%, #04222a 42%, #02141a 68%, #010a0e 100%);
}
/* Caustic light from the surface */
.bg-abyss::before {
  content: "";
  position: absolute;
  left: -20%;
  right: -20%;
  top: -12%;
  height: 56%;
  background:
    radial-gradient(58% 42% at 32% 0%, rgba(150, 232, 236, 0.24), transparent 70%),
    radial-gradient(52% 40% at 72% 0%, rgba(116, 208, 220, 0.16), transparent 72%),
    repeating-linear-gradient(74deg, rgba(176, 244, 248, 0.06) 0 2px, transparent 2px 27px);
  filter: blur(8px);
  animation: abyss-caustic 15s ease-in-out infinite alternate;
}
/* Deepening vignette toward the dark */
.bg-abyss::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 78% at 50% 0%, transparent 48%, rgba(0, 0, 0, 0.5) 100%);
}
@keyframes abyss-caustic {
  from { transform: translateX(-3%) skewX(0deg); opacity: 0.78; }
  to   { transform: translateX(3%) skewX(-5deg); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-abyss::before { animation: none; }
}`;
