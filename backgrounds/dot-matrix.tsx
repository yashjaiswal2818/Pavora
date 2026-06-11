"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "dot-matrix",
  name: "Dot Matrix",
  category: "Patterns",
  tech: "css",
  isDark: false,
};

export function Background({ className }: BackgroundProps) {
  return (
    <div className={`dm-root ${className ?? ""}`} aria-hidden>
      <style>{`
        .dm-root {
          position: absolute;
          inset: 0;
          background-color: #ffffff;
          background-image: radial-gradient(#c9d2e3 1.1px, transparent 1.2px);
          background-size: 22px 22px;
        }
      `}</style>
    </div>
  );
}

export const code = `/* Dot Matrix — subtle dot grid */
.bg-dot-matrix {
  background-color: #ffffff;
  background-image: radial-gradient(#c9d2e3 1.1px, transparent 1.2px);
  background-size: 22px 22px;
}`;
