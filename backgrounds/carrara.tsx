"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "carrara",
  name: "Carrara",
  category: "Mesh",
  tech: "css",
  isDark: false,
};

/* Polished white marble: soft cool-gray clouding in the stone, threaded with
   hand-drawn veins that wander and branch the way quarried Carrara does, and a
   slow band of light drifting across like sun moving over a marble floor. */
const VEIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='560' viewBox='0 0 800 560'%3E%3Cg fill='none' stroke-linecap='round'%3E%3Cpath d='M-20 70 C 150 130, 250 60, 380 210 S 660 350, 840 290' stroke='%239aa1ad' stroke-width='2' stroke-opacity='0.5'/%3E%3Cpath d='M120 -20 C 210 150, 110 320, 300 540' stroke='%23a3a9b4' stroke-width='1.7' stroke-opacity='0.42'/%3E%3Cpath d='M560 600 C 600 420, 510 360, 700 200 S 830 70, 900 30' stroke='%239ea4b0' stroke-width='1.8' stroke-opacity='0.45'/%3E%3Cpath d='M380 210 C 440 270, 520 250, 600 350' stroke='%23aab0ba' stroke-width='1.1' stroke-opacity='0.36'/%3E%3Cpath d='M250 250 C 320 300, 300 380, 420 430' stroke='%23aab0ba' stroke-width='1' stroke-opacity='0.32'/%3E%3Cpath d='M700 200 C 660 250, 690 300, 640 360' stroke='%23aab0ba' stroke-width='1' stroke-opacity='0.3'/%3E%3Cpath d='M40 200 C 120 230, 160 210, 230 250' stroke='%23b0b6c0' stroke-width='0.7' stroke-opacity='0.28'/%3E%3Cpath d='M470 120 C 520 150, 540 130, 600 160' stroke='%23b0b6c0' stroke-width='0.7' stroke-opacity='0.26'/%3E%3Cpath d='M150 430 C 220 450, 260 430, 330 470' stroke='%23b0b6c0' stroke-width='0.7' stroke-opacity='0.26'/%3E%3Cpath d='M-20 73 C 150 133, 250 63, 380 213 S 660 353, 840 293' stroke='%237f8794' stroke-width='0.8' stroke-opacity='0.28'/%3E%3C/g%3E%3C/svg%3E\")";

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`car-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .car-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background-color: #f3f3f1;
        }
        .car-root::before {
          content: "";
          position: absolute;
          inset: -10%;
          background:
            radial-gradient(50% 44% at 28% 26%, rgba(168, 174, 186, 0.3), transparent 70%),
            radial-gradient(46% 42% at 76% 34%, rgba(150, 158, 172, 0.24), transparent 72%),
            radial-gradient(54% 50% at 60% 82%, rgba(176, 182, 192, 0.26), transparent 72%);
          filter: blur(26px);
          animation: car-light 30s ease-in-out infinite alternate;
        }
        .car-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: ${VEIN};
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.9;
        }
        .car-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes car-light {
          from { transform: translate(0, 0); opacity: 0.85; }
          to   { transform: translate(2.5%, -1.5%); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .car-root::before { animation: none; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Carrara — veined white marble with drifting floor light */
.bg-carrara {
  position: relative;
  overflow: hidden;
  background-color: #f3f3f1;
}
/* Soft clouding + drifting light */
.bg-carrara::before {
  content: "";
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(50% 44% at 28% 26%, rgba(168, 174, 186, 0.3), transparent 70%),
    radial-gradient(46% 42% at 76% 34%, rgba(150, 158, 172, 0.24), transparent 72%),
    radial-gradient(54% 50% at 60% 82%, rgba(176, 182, 192, 0.26), transparent 72%);
  filter: blur(26px);
  animation: carrara-light 30s ease-in-out infinite alternate;
}
/* Hand-drawn veins */
.bg-carrara::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: ${VEIN};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.9;
}
@keyframes carrara-light {
  from { transform: translate(0, 0); opacity: 0.85; }
  to   { transform: translate(2.5%, -1.5%); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-carrara::before { animation: none; }
}`;
