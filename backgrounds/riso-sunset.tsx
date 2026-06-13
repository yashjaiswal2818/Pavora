"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "riso-sunset",
  name: "Riso Sunset",
  category: "Gradients",
  tech: "css",
  isDark: false,
};

/* A risograph-print sunset: flat hard-stop color bands, a halftone-dot sun,
   and a little paper tooth. Deliberately static — prints don't move. */
const PAPER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23p)'/%3E%3C/svg%3E\")";

export function Background({ className }: BackgroundProps) {
  return (
    <div className={`rs-root ${className ?? ""}`} aria-hidden>
      <style>{`
        .rs-root {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            #f8f0e0 0%, #f8f0e0 22%,
            #fcd789 22%, #fcd789 38%,
            #f8a85d 38%, #f8a85d 52%,
            #ef7158 52%, #ef7158 66%,
            #cf4769 66%, #cf4769 80%,
            #8d3a64 80%, #8d3a64 91%,
            #532a4c 91%, #532a4c 100%
          );
          overflow: hidden;
        }
        .rs-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(176, 42, 84, 0.9) 1.7px, transparent 2.1px);
          background-size: 13px 13px;
          -webkit-mask-image: radial-gradient(circle closest-side at 76% 24%, #000 99%, transparent 100%);
          mask-image: radial-gradient(circle closest-side at 76% 24%, #000 99%, transparent 100%);
        }
        .rs-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: ${PAPER};
          opacity: 0.16;
        }
      `}</style>
    </div>
  );
}

export const code = `/* Riso Sunset — banded print gradient with a halftone sun */
.bg-riso-sunset {
  position: relative;
  background: linear-gradient(
    180deg,
    #f8f0e0 0%, #f8f0e0 22%,
    #fcd789 22%, #fcd789 38%,
    #f8a85d 38%, #f8a85d 52%,
    #ef7158 52%, #ef7158 66%,
    #cf4769 66%, #cf4769 80%,
    #8d3a64 80%, #8d3a64 91%,
    #532a4c 91%, #532a4c 100%
  );
  overflow: hidden;
}
/* Halftone sun */
.bg-riso-sunset::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(176, 42, 84, 0.9) 1.7px, transparent 2.1px);
  background-size: 13px 13px;
  -webkit-mask-image: radial-gradient(circle closest-side at 76% 24%, #000 99%, transparent 100%);
  mask-image: radial-gradient(circle closest-side at 76% 24%, #000 99%, transparent 100%);
}
/* Paper tooth */
.bg-riso-sunset::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23p)'/%3E%3C/svg%3E");
  opacity: 0.16;
}`;
