"use client";

import { getBySlug } from "@/backgrounds";
import { useBackground } from "./BackgroundProvider";

/**
 * The full-viewport layer behind all page content. Paints the base background
 * by default and renders the active background (with a crossfade) when one is
 * applied site-wide. Purely decorative — never intercepts clicks.
 */
export function SiteBackdrop() {
  const { activeSlug } = useBackground();
  const active = activeSlug ? getBySlug(activeSlug) : undefined;

  return (
    <div className="site-backdrop" aria-hidden>
      {active ? (
        <div key={active.meta.slug} className="site-backdrop__layer">
          <active.Background playing />
        </div>
      ) : null}
      <style>{`
        .site-backdrop {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: var(--bg);
        }
        .site-backdrop__layer {
          position: absolute;
          inset: 0;
          animation: backdrop-in 0.45s var(--ease-out-quart);
        }
        @keyframes backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .site-backdrop__layer { animation: none; }
        }
      `}</style>
    </div>
  );
}
