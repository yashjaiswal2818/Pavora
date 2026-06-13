"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "isometric",
  name: "Isometric",
  category: "Patterns",
  tech: "css",
  isDark: true,
};

/* A wall of tumbling blocks: three tones of graphite weave into a field of 3D
   cubes, kept low-contrast so the geometry reads without shouting. A soft band
   of light passes across now and then, catching the tops of the cubes. */
export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`iso-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .iso-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background-color: #1b1e26;
          background-image:
            linear-gradient(30deg, #15171d 12%, transparent 12.5%, transparent 87%, #15171d 87.5%, #15171d),
            linear-gradient(150deg, #15171d 12%, transparent 12.5%, transparent 87%, #15171d 87.5%, #15171d),
            linear-gradient(30deg, #15171d 12%, transparent 12.5%, transparent 87%, #15171d 87.5%, #15171d),
            linear-gradient(150deg, #15171d 12%, transparent 12.5%, transparent 87%, #15171d 87.5%, #15171d),
            linear-gradient(60deg, #2a2f3a 25%, transparent 25.5%, transparent 75%, #2a2f3a 75%, #2a2f3a),
            linear-gradient(60deg, #2a2f3a 25%, transparent 25.5%, transparent 75%, #2a2f3a 75%, #2a2f3a);
          background-size: 80px 140px;
          background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
        }
        .iso-root::before {
          content: "";
          position: absolute;
          top: -50%;
          height: 200%;
          left: 0;
          width: 55%;
          background: linear-gradient(100deg, transparent, rgba(150, 180, 230, 0.14) 50%, transparent);
          filter: blur(8px);
          transform: translateX(-140%) skewX(-12deg);
          animation: iso-sweep 9s ease-in-out infinite;
        }
        .iso-root[data-playing="false"]::before { animation-play-state: paused; }
        @keyframes iso-sweep {
          0%        { transform: translateX(-140%) skewX(-12deg); }
          60%, 100% { transform: translateX(320%) skewX(-12deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .iso-root::before { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export const code = `/* Isometric — a field of 3D tumbling blocks in graphite */
.bg-isometric {
  position: relative;
  overflow: hidden;
  background-color: #1b1e26;
  background-image:
    linear-gradient(30deg, #15171d 12%, transparent 12.5%, transparent 87%, #15171d 87.5%, #15171d),
    linear-gradient(150deg, #15171d 12%, transparent 12.5%, transparent 87%, #15171d 87.5%, #15171d),
    linear-gradient(30deg, #15171d 12%, transparent 12.5%, transparent 87%, #15171d 87.5%, #15171d),
    linear-gradient(150deg, #15171d 12%, transparent 12.5%, transparent 87%, #15171d 87.5%, #15171d),
    linear-gradient(60deg, #2a2f3a 25%, transparent 25.5%, transparent 75%, #2a2f3a 75%, #2a2f3a),
    linear-gradient(60deg, #2a2f3a 25%, transparent 25.5%, transparent 75%, #2a2f3a 75%, #2a2f3a);
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
}
/* Light sweep across the cube tops */
.bg-isometric::before {
  content: "";
  position: absolute;
  top: -50%;
  height: 200%;
  left: 0;
  width: 55%;
  background: linear-gradient(100deg, transparent, rgba(150, 180, 230, 0.14) 50%, transparent);
  filter: blur(8px);
  transform: translateX(-140%) skewX(-12deg);
  animation: isometric-sweep 9s ease-in-out infinite;
}
@keyframes isometric-sweep {
  0%        { transform: translateX(-140%) skewX(-12deg); }
  60%, 100% { transform: translateX(320%) skewX(-12deg); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-isometric::before { animation: none; opacity: 0; }
}`;
