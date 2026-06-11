"use client";

import { useState } from "react";
import type { BackgroundModule } from "@/backgrounds/types";
import { useBackground } from "./BackgroundProvider";
import { useCodeDialog } from "./CodeDialog";
import {
  MinimalCard,
  MinimalCardMedia,
  MinimalCardTitle,
} from "@/components/ui/minimal-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyIcon, EyeIcon } from "./icons";

export function BackgroundCard({ module }: { module: BackgroundModule }) {
  const { meta, Background } = module;
  const { setActive } = useBackground();
  const { openCode } = useCodeDialog();
  const [engaged, setEngaged] = useState(false);

  return (
    <MinimalCard
      className="card"
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setEngaged(false);
      }}
    >
      <MinimalCardMedia className="card__media aspect-[4/3]">
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
      </MinimalCardMedia>

      <MinimalCardTitle className="pb-1">{meta.name}</MinimalCardTitle>

      <style>{`
        .card {
          transition: transform 0.2s var(--ease-out-quart),
            box-shadow 0.2s var(--ease-out-quart);
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lift);
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
        @media (prefers-reduced-motion: reduce) {
          .card, .card__hint, .card__copy { transition: none; }
          .card:hover { transform: none; }
        }
      `}</style>
    </MinimalCard>
  );
}
