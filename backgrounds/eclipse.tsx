"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "eclipse",
  name: "Eclipse",
  category: "Gradients",
  tech: "css",
  isDark: true,
};

/* Light cresting a dark planet: a crisp ice rim on the horizon with a cobalt
   bloom breathing behind it, faint stars above. The sharp rim against the
   soft bloom is the whole trick. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`ec-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .ec-root {
          position: absolute;
          inset: 0;
          background-color: #04060d;
          background-image:
            radial-gradient(rgba(199, 214, 255, 0.8) 1px, transparent 1.4px),
            radial-gradient(rgba(199, 214, 255, 0.45) 1px, transparent 1.4px);
          background-size: 290px 290px, 190px 190px;
          background-position: 40px 60px, 130px 20px;
          overflow: hidden;
        }
        .ec-root::before {
          content: "";
          position: absolute;
          left: -20%;
          right: -20%;
          top: 30%;
          bottom: -30%;
          background: radial-gradient(
            50% 42% at 50% 62%,
            rgba(96, 130, 255, 0.55),
            rgba(56, 70, 180, 0.22) 48%,
            transparent 72%
          );
          filter: blur(26px);
          animation: ec-breathe 8.5s ease-in-out infinite alternate;
        }
        .ec-root::after {
          content: "";
          position: absolute;
          left: -35%;
          width: 170%;
          top: 68%;
          height: 110%;
          border-radius: 50%;
          background: #020409;
          border-top: 2px solid rgba(205, 222, 255, 0.9);
          box-shadow:
            0 -2px 12px rgba(205, 222, 255, 0.55),
            0 -12px 48px rgba(99, 138, 255, 0.4);
        }
        .ec-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes ec-breathe {
          from { opacity: 0.7; transform: scale(1); }
          to   { opacity: 1; transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ec-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Eclipse — crisp horizon rim with a breathing cobalt bloom */
.bg-eclipse {
  position: relative;
  background-color: #04060d;
  background-image:
    radial-gradient(rgba(199, 214, 255, 0.8) 1px, transparent 1.4px),
    radial-gradient(rgba(199, 214, 255, 0.45) 1px, transparent 1.4px);
  background-size: 290px 290px, 190px 190px;
  background-position: 40px 60px, 130px 20px;
  overflow: hidden;
}
/* Bloom behind the horizon */
.bg-eclipse::before {
  content: "";
  position: absolute;
  left: -20%;
  right: -20%;
  top: 30%;
  bottom: -30%;
  background: radial-gradient(
    50% 42% at 50% 62%,
    rgba(96, 130, 255, 0.55),
    rgba(56, 70, 180, 0.22) 48%,
    transparent 72%
  );
  filter: blur(26px);
  animation: eclipse-breathe 8.5s ease-in-out infinite alternate;
}
/* The planet: dark disc with an ice rim */
.bg-eclipse::after {
  content: "";
  position: absolute;
  left: -35%;
  width: 170%;
  top: 68%;
  height: 110%;
  border-radius: 50%;
  background: #020409;
  border-top: 2px solid rgba(205, 222, 255, 0.9);
  box-shadow:
    0 -2px 12px rgba(205, 222, 255, 0.55),
    0 -12px 48px rgba(99, 138, 255, 0.4);
}
@keyframes eclipse-breathe {
  from { opacity: 0.7; transform: scale(1); }
  to   { opacity: 1; transform: scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-eclipse::before { animation: none; }
}`;
