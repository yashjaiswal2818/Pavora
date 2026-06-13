"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "checker-fade",
  name: "Checker Fade",
  category: "Patterns",
  tech: "css",
  isDark: false,
};

/* A checkerboard rising out of the bottom-left corner and dissolving on a
   long diagonal. Structure in one corner, calm everywhere else — the radial
   mask is what keeps it from reading as a transparency grid. */
export function Background({ className }: BackgroundProps) {
  return (
    <div className={`cf-root ${className ?? ""}`} aria-hidden>
      <style>{`
        .cf-root {
          position: absolute;
          inset: 0;
          background: #ffffff;
        }
        .cf-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-conic-gradient(#e7eaf1 0% 25%, #ffffff 0% 50%);
          background-size: 88px 88px;
          -webkit-mask-image: radial-gradient(130% 110% at 12% 100%, #000 28%, transparent 68%);
          mask-image: radial-gradient(130% 110% at 12% 100%, #000 28%, transparent 68%);
        }
      `}</style>
    </div>
  );
}

export const code = `/* Checker Fade — checkerboard dissolving out of the bottom-left corner */
.bg-checker-fade {
  position: relative;
  background: #ffffff;
}
.bg-checker-fade::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-conic-gradient(#e7eaf1 0% 25%, #ffffff 0% 50%);
  background-size: 88px 88px;
  -webkit-mask-image: radial-gradient(130% 110% at 12% 100%, #000 28%, transparent 68%);
  mask-image: radial-gradient(130% 110% at 12% 100%, #000 28%, transparent 68%);
}`;
