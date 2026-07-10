"use client";

import { getBySlug } from "@/backgrounds";

/**
 * The live, paired background behind the demo — fixed full-viewport, purely
 * decorative. Reuses the same free background module the gallery ships, so the
 * kit's environment is literally the exhibit a visitor can also copy for free.
 */
export function KitBackground({ slug }: { slug: string }) {
  const mod = getBySlug(slug);
  if (!mod) return null;
  const Background = mod.Background;
  return (
    <div className="kit-bg" aria-hidden>
      <Background playing />
      <style>{`
        .kit-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: #070708;
        }
      `}</style>
    </div>
  );
}
