"use client";

import type { BackgroundModule, Category } from "@/backgrounds/types";
import { BackgroundCard } from "./BackgroundCard";

export function CategorySection({
  category,
  items,
}: {
  category: Category;
  items: BackgroundModule[];
}) {
  return (
    <section className="section" id={category.toLowerCase()}>
      <div className="section__head">
        <h2 className="section__title">{category}</h2>
        <span className="section__count">{items.length}</span>
      </div>
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
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: clamp(1rem, 2.5vw, 1.5rem);
        }
      `}</style>
    </section>
  );
}
