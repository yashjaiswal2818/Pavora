"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { byCategory } from "@/backgrounds";
import type { BackgroundModule } from "@/backgrounds/types";
import { CategorySection } from "./CategorySection";
import { CommandTrigger } from "./CommandTrigger";
import { GalleryTabs, type GalleryTab } from "./GalleryTabs";

/**
 * Client-side gallery. Resolving the registry here (rather than in the server
 * page) keeps the background modules entirely on the client, so component
 * references never cross the server→client boundary. A segmented filter chooses
 * what shows; "All" is one unified grid, a category tab shows that section.
 *
 * The filter + search sit in one toolbar that sticks to the top of the viewport
 * and condenses into a frosted floating island once it leaves its resting spot.
 */
export function Gallery() {
  const groups = byCategory();
  const [filter, setFilter] = useState<string>("all");
  const [stuck, setStuck] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const tabs: GalleryTab[] = useMemo(() => {
    const total = groups.reduce((sum, g) => sum + g.items.length, 0);
    return [
      { value: "all", label: "All", count: total },
      ...groups.map((g) => ({
        value: g.category,
        label: g.category,
        count: g.items.length,
      })),
    ];
  }, [groups]);

  const visible: { title?: string; items: BackgroundModule[] }[] =
    filter === "all"
      ? [{ items: groups.flatMap((g) => g.items) }]
      : groups
          .filter((g) => g.category === filter)
          .map((g) => ({ title: g.category, items: g.items }));

  // Toggle the floating-island treatment the moment the sticky toolbar reaches
  // its pinned offset. Shrinking the observer root by that offset makes the
  // ratio drop below 1 exactly when it pins — no scroll handler needed.
  useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(entry.intersectionRatio < 1),
      { rootMargin: "-13px 0px 0px 0px", threshold: [1] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div className="gallery-toolbar" ref={toolbarRef} data-stuck={stuck}>
        <div className="gallery-toolbar__inner">
          <GalleryTabs tabs={tabs} value={filter} onValueChange={setFilter} />
          <CommandTrigger />
        </div>
      </div>

      {visible.map((group) => (
        <CategorySection
          key={group.title ?? "all"}
          title={group.title}
          items={group.items}
        />
      ))}

      <style>{`
        .gallery-toolbar {
          position: sticky;
          top: 0.75rem;
          z-index: 30;
          max-width: 1200px;
          margin: clamp(1.5rem, 4vw, 2.5rem) auto 0;
          padding: 0 clamp(1rem, 4vw, 2rem);
        }
        .gallery-toolbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.4rem;
          border-radius: var(--radius-full);
          border: 1px solid transparent;
          /* Resting state: seamless on the page, the controls carry themselves. */
          background: transparent;
          box-shadow: none;
          -webkit-backdrop-filter: none;
          backdrop-filter: none;
          transition:
            background 0.32s var(--ease-out-quart),
            border-color 0.32s var(--ease-out-quart),
            box-shadow 0.32s var(--ease-out-quart);
        }
        /* Pinned: condense into a frosted floating island that stays readable
           over whatever background is scrolling beneath it. */
        .gallery-toolbar[data-stuck="true"] .gallery-toolbar__inner {
          background: var(--chrome-surface);
          border-color: var(--chrome-border);
          box-shadow: var(--shadow-float);
          -webkit-backdrop-filter: saturate(1.6) blur(16px);
          backdrop-filter: saturate(1.6) blur(16px);
        }
        @media (max-width: 640px) {
          .gallery-toolbar { top: 0.5rem; }
          .gallery-toolbar__inner {
            flex-direction: column;
            align-items: stretch;
            gap: 0.7rem;
            padding: 0.5rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-toolbar__inner { transition: none; }
        }
      `}</style>
    </>
  );
}
