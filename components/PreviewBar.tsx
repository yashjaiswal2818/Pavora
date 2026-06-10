"use client";

import { getBySlug } from "@/backgrounds";
import { useBackground } from "./BackgroundProvider";
import { useCodeDialog } from "./CodeDialog";
import { CopyIcon } from "./icons";

export function PreviewBar() {
  const { activeSlug, reset } = useBackground();
  const { openCode } = useCodeDialog();
  const active = activeSlug ? getBySlug(activeSlug) : undefined;
  if (!active) return null;

  return (
    <div className="preview-bar" role="region" aria-label="Background preview controls">
      <span className="preview-bar__label">
        <span className="preview-bar__dot" aria-hidden />
        Previewing <strong>{active.meta.name}</strong>
      </span>
      <div className="preview-bar__actions">
        <button
          type="button"
          className="preview-bar__copy"
          onClick={() => openCode(active)}
        >
          <CopyIcon />
          View code
        </button>
        <button type="button" className="preview-bar__reset" onClick={reset}>
          Reset
        </button>
      </div>
      <style>{`
        .preview-bar {
          position: fixed;
          left: 50%;
          bottom: 1.5rem;
          transform: translateX(-50%);
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0.5rem 0.5rem 1.1rem;
          border-radius: var(--radius-full);
          background: var(--chrome-surface);
          -webkit-backdrop-filter: saturate(1.5) blur(16px);
          backdrop-filter: saturate(1.5) blur(16px);
          border: 1px solid var(--chrome-border);
          color: var(--chrome-ink);
          box-shadow: var(--shadow-float);
          animation: preview-bar-in 0.4s var(--ease-out-expo);
          max-width: calc(100vw - 2rem);
        }
        .preview-bar__label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          white-space: nowrap;
        }
        .preview-bar__label strong { font-weight: 700; }
        .preview-bar__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 4px oklch(0.7 0.17 38 / 0.2);
        }
        .preview-bar__actions {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .preview-bar__copy {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1rem;
          border: none;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: var(--primary-ink);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s var(--ease-out-quart);
        }
        .preview-bar__copy:hover { background: var(--primary-hover); }
        .preview-bar__reset {
          padding: 0.55rem 0.9rem;
          border: none;
          border-radius: var(--radius-full);
          background: transparent;
          color: var(--chrome-ink);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s var(--ease-out-quart);
        }
        .preview-bar__reset:hover { background: var(--chrome-surface); }
        @keyframes preview-bar-in {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .preview-bar { animation: none; }
          .preview-bar__copy, .preview-bar__reset { transition: none; }
        }
      `}</style>
    </div>
  );
}
