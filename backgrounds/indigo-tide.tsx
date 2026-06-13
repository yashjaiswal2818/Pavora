"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "indigo-tide",
  name: "Indigo Tide",
  category: "Patterns",
  tech: "css",
  isDark: false,
};

/* Seigaiha — the classic Japanese overlapping-wave print, drawn as a single
   seamless SVG tile: ringed discs on a half-offset lattice, upper rows
   painted first so each wave crests over the one behind it. Lines are kept
   translucent so the pattern recedes behind content instead of fighting it. */
const TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cdefs%3E%3Cg id='w'%3E%3Ccircle r='60' fill='%23f4f5f9'/%3E%3Ccircle r='58' fill='none' stroke='%2339497e' stroke-opacity='.27' stroke-width='3'/%3E%3Ccircle r='45.5' fill='none' stroke='%2339497e' stroke-opacity='.27' stroke-width='3'/%3E%3Ccircle r='33' fill='none' stroke='%2339497e' stroke-opacity='.27' stroke-width='3'/%3E%3Ccircle r='20.5' fill='none' stroke='%2339497e' stroke-opacity='.27' stroke-width='3'/%3E%3C/g%3E%3C/defs%3E%3Cuse href='%23w' x='60' y='-30'/%3E%3Cuse href='%23w' x='0' y='0'/%3E%3Cuse href='%23w' x='120' y='0'/%3E%3Cuse href='%23w' x='60' y='30'/%3E%3Cuse href='%23w' x='0' y='60'/%3E%3Cuse href='%23w' x='120' y='60'/%3E%3Cuse href='%23w' x='60' y='90'/%3E%3C/svg%3E\")";

export function Background({ className }: BackgroundProps) {
  return (
    <div className={`it-root ${className ?? ""}`} aria-hidden>
      <style>{`
        .it-root {
          position: absolute;
          inset: 0;
          background-color: #f4f5f9;
          background-image: ${TILE};
          background-size: 120px 60px;
        }
      `}</style>
    </div>
  );
}

export const code = `/* Indigo Tide — seigaiha overlapping-wave pattern */
.bg-indigo-tide {
  background-color: #f4f5f9;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cdefs%3E%3Cg id='w'%3E%3Ccircle r='60' fill='%23f4f5f9'/%3E%3Ccircle r='58' fill='none' stroke='%2339497e' stroke-opacity='.27' stroke-width='3'/%3E%3Ccircle r='45.5' fill='none' stroke='%2339497e' stroke-opacity='.27' stroke-width='3'/%3E%3Ccircle r='33' fill='none' stroke='%2339497e' stroke-opacity='.27' stroke-width='3'/%3E%3Ccircle r='20.5' fill='none' stroke='%2339497e' stroke-opacity='.27' stroke-width='3'/%3E%3C/g%3E%3C/defs%3E%3Cuse href='%23w' x='60' y='-30'/%3E%3Cuse href='%23w' x='0' y='0'/%3E%3Cuse href='%23w' x='120' y='0'/%3E%3Cuse href='%23w' x='60' y='30'/%3E%3Cuse href='%23w' x='0' y='60'/%3E%3Cuse href='%23w' x='120' y='60'/%3E%3Cuse href='%23w' x='60' y='90'/%3E%3C/svg%3E");
  background-size: 120px 60px;
}`;
