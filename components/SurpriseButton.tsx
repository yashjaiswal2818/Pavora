"use client";

import { useBackground } from "./BackgroundProvider";
import { SparklesIcon } from "./icons";

export function SurpriseButton() {
  const { surprise } = useBackground();
  return (
    <button type="button" className="surprise" onClick={surprise}>
      <SparklesIcon />
      <span>Surprise me</span>
      <style>{`
        .surprise {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.9rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--chrome-border);
          background: transparent;
          color: var(--chrome-ink);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s var(--ease-out-quart),
            border-color 0.18s var(--ease-out-quart),
            transform 0.18s var(--ease-out-quart);
        }
        .surprise:hover {
          background: var(--chrome-surface);
          border-color: var(--chrome-ink);
        }
        .surprise:active { transform: scale(0.97); }
        .surprise svg { color: var(--accent); }
        @media (prefers-reduced-motion: reduce) {
          .surprise { transition: none; }
        }
      `}</style>
    </button>
  );
}
