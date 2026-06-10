"use client";

import { SearchIcon } from "lucide-react";

/**
 * The nav's search affordance. Dispatches the same window event the
 * CommandPalette listens for, so the two stay decoupled.
 */
export function CommandTrigger() {
  return (
    <button
      type="button"
      className="cmd-trigger"
      onClick={() => window.dispatchEvent(new Event("backdrop:command"))}
      aria-label="Search backgrounds (Command-K)"
    >
      <SearchIcon size={15} aria-hidden />
      <span className="cmd-trigger__label">Search backgrounds</span>
      <kbd className="cmd-trigger__kbd" aria-hidden>
        ⌘K
      </kbd>
      <style>{`
        .cmd-trigger {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          height: 38px;
          padding: 0 0.6rem 0 0.7rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--chrome-border);
          background: var(--chrome-surface);
          color: var(--chrome-muted);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.18s var(--ease-out-quart),
            border-color 0.18s var(--ease-out-quart);
        }
        .cmd-trigger:hover {
          color: var(--chrome-ink);
          border-color: var(--chrome-ink);
        }
        .cmd-trigger__kbd {
          display: inline-grid;
          place-items: center;
          min-width: 1.5rem;
          height: 1.35rem;
          padding: 0 0.35rem;
          border-radius: 7px;
          border: 1px solid var(--chrome-border);
          background: color-mix(in oklch, var(--chrome-ink) 8%, transparent);
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 600;
          line-height: 1;
        }
        @media (max-width: 640px) {
          .cmd-trigger__label,
          .cmd-trigger__kbd {
            display: none;
          }
          .cmd-trigger {
            width: 38px;
            justify-content: center;
            padding: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cmd-trigger {
            transition: none;
          }
        }
      `}</style>
    </button>
  );
}
