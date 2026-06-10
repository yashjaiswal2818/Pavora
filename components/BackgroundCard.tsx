"use client";

import { useState } from "react";
import type { BackgroundModule } from "@/backgrounds/types";
import { useBackground } from "./BackgroundProvider";
import { useCodeDialog } from "./CodeDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyIcon, EyeIcon } from "./icons";

export function BackgroundCard({ module }: { module: BackgroundModule }) {
  const { meta, Background } = module;
  const { setActive } = useBackground();
  const { openCode } = useCodeDialog();
  const [engaged, setEngaged] = useState(false);

  return (
    <article
      className="card"
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setEngaged(false);
      }}
    >
      <div className="card__media">
        <button
          type="button"
          className="card__preview"
          onClick={() => setActive(meta.slug)}
          aria-label={`Preview ${meta.name} across the whole page`}
        >
          <Background playing={engaged} />
          <span className="card__hint">
            <EyeIcon />
            Preview
          </span>
        </button>

        <div className="card__badges" aria-hidden>
          <span className="badge">{meta.tech === "css" ? "CSS" : "JS"}</span>
          {meta.animated ? <span className="badge">Animated</span> : null}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="card__copy"
              onClick={() => openCode(module)}
              aria-label={`View and copy ${meta.name} code`}
            >
              <CopyIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent>View &amp; copy code</TooltipContent>
        </Tooltip>
      </div>

      <div className="card__meta">
        <h3 className="card__name">{meta.name}</h3>
        <a
          className="card__author"
          href={meta.github}
          target="_blank"
          rel="noreferrer"
        >
          by {meta.author}
        </a>
      </div>

      <style>{`
        .card {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: transform 0.2s var(--ease-out-quart),
            box-shadow 0.2s var(--ease-out-quart);
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lift);
        }
        .card__media {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }
        .card__preview {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          padding: 0;
          border: none;
          background: var(--surface-2);
          cursor: pointer;
          display: grid;
          place-items: center;
        }
        .card__hint {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.9rem;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: var(--primary-ink);
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.2s var(--ease-out-quart),
            transform 0.2s var(--ease-out-quart);
          box-shadow: var(--shadow-float);
        }
        .card:hover .card__hint,
        .card:focus-within .card__hint {
          opacity: 1;
          transform: translateY(0);
        }
        .card__badges {
          position: absolute;
          top: 0.6rem;
          left: 0.6rem;
          display: flex;
          gap: 0.35rem;
          pointer-events: none;
          z-index: 1;
        }
        .badge {
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          background: oklch(1 0 0 / 0.92);
          color: var(--ink);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          box-shadow: var(--shadow-card);
        }
        .card__copy {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          z-index: 1;
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: var(--radius-full);
          background: oklch(1 0 0 / 0.92);
          color: var(--ink);
          cursor: pointer;
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 0.2s var(--ease-out-quart),
            transform 0.2s var(--ease-out-quart),
            background 0.18s var(--ease-out-quart);
          box-shadow: var(--shadow-card);
        }
        .card:hover .card__copy,
        .card:focus-within .card__copy {
          opacity: 1;
          transform: translateY(0);
        }
        .card__copy:hover { background: oklch(1 0 0); color: var(--primary); }
        .card__meta {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
        }
        .card__name {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.02em;
        }
        .card__author {
          font-size: 0.8rem;
          color: var(--muted);
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s var(--ease-out-quart);
        }
        .card__author:hover { color: var(--primary); }
        @media (prefers-reduced-motion: reduce) {
          .card, .card__hint, .card__copy { transition: none; }
        }
      `}</style>
    </article>
  );
}
