"use client";

import { SearchIcon } from "lucide-react";

/**
 * Search affordance. Looks like a real search field but is a button: it opens
 * the ⌘K command palette via the window event the CommandPalette listens for,
 * so the two stay decoupled. Surfaces use --chrome-* tokens so the field flips
 * with the chrome over a dark applied background.
 */
export function CommandTrigger() {
  return (
    <button
      type="button"
      className="search"
      onClick={() => window.dispatchEvent(new Event("pavora:command"))}
      aria-label="Search backgrounds (Command-K)"
    >
      <SearchIcon className="search__icon" size={16} aria-hidden />
      <span className="search__label">Search backgrounds</span>
      <kbd className="search__kbd" aria-hidden>
        <span className="search__kbd-mod">⌘</span>K
      </kbd>
      <style>{`
        .search {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          height: 44px;
          min-width: 246px;
          padding: 0 0.5rem 0 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--chrome-border);
          background: var(--chrome-surface);
          color: var(--chrome-muted);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition:
            color 0.2s var(--ease-out-quart),
            border-color 0.2s var(--ease-out-quart),
            box-shadow 0.2s var(--ease-out-quart),
            background 0.2s var(--ease-out-quart);
        }
        .search:hover {
          color: var(--chrome-ink);
          border-color: color-mix(in oklch, var(--chrome-ink) 28%, var(--chrome-border));
        }
        .search:hover .search__icon { color: var(--chrome-ink); }
        .search:focus-visible {
          outline: none;
          color: var(--chrome-ink);
          border-color: var(--sd-ring);
          box-shadow: 0 0 0 3px color-mix(in oklch, var(--sd-ring) 26%, transparent);
        }
        .search__icon {
          flex: none;
          color: var(--chrome-muted);
          transition: color 0.2s var(--ease-out-quart);
        }
        .search__label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .search__kbd {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: 0.06em;
          min-width: 1.6rem;
          height: 1.55rem;
          padding: 0 0.45rem;
          border-radius: 8px;
          border: 1px solid var(--chrome-border);
          background: color-mix(in oklch, var(--chrome-ink) 7%, transparent);
          color: var(--chrome-muted);
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 600;
          line-height: 1;
        }
        .search__kbd-mod { font-size: 0.82rem; }

        @media (max-width: 640px) {
          .search { width: 100%; min-width: 0; height: 42px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .search, .search__icon { transition: none; }
        }
      `}</style>
    </button>
  );
}
