"use client";

import type { BackgroundModule } from "@/backgrounds/types";
import { BackgroundCard } from "./BackgroundCard";

/**
 * A grid of background cards, optionally headed by a title + count.
 * The "All" tab renders one untitled section with every background; the
 * category tabs render one titled section each.
 */
export function CategorySection({
  title,
  items,
}: {
  title?: string;
  items: BackgroundModule[];
}) {
  return (
    <section className="section" id={title?.toLowerCase()}>
      {title ? (
        <div className="section__head">
          <h2 className="section__title">{title}</h2>
          <span className="section__count">{items.length}</span>
        </div>
      ) : null}
      <div className="section__grid">
        {items.map((module) => (
          <BackgroundCard key={module.meta.slug} module={module} />
        ))}
      </div>
      <style>{`
        .section {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem) 0;
        }
        .section__head {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
        }
        .section__title {
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: var(--chrome-ink);
        }
        .section__count {
          display: inline-grid;
          place-items: center;
          min-width: 1.6rem;
          height: 1.6rem;
          padding: 0 0.5rem;
          border-radius: var(--radius-full);
          background: var(--chrome-surface);
          border: 1px solid var(--chrome-border);
          color: var(--chrome-muted);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .section__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(0.9rem, 2vw, 1.25rem);
        }
        @media (min-width: 560px) {
          .section__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .section__grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </section>
  );
}
