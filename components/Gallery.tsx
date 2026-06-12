"use client";

import { useState } from "react";
import { byCategory } from "@/backgrounds";
import type { BackgroundModule } from "@/backgrounds/types";
import { CategorySection } from "./CategorySection";
import { CommandTrigger } from "./CommandTrigger";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Client-side gallery. Resolving the registry here (rather than in the server
 * page) keeps the background modules entirely on the client, so component
 * references never cross the server→client boundary. A Tabs control filters
 * the gallery; "All" shows every background in one unified grid, a category
 * tab shows that category's titled section.
 */
export function Gallery() {
  const groups = byCategory();
  const [filter, setFilter] = useState<string>("all");
  const visible: { title?: string; items: BackgroundModule[] }[] =
    filter === "all"
      ? [{ items: groups.flatMap((g) => g.items) }]
      : groups
          .filter((g) => g.category === filter)
          .map((g) => ({ title: g.category, items: g.items }));

  return (
    <>
      <div className="gallery__filter">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {groups.map((group) => (
              <TabsTrigger key={group.category} value={group.category}>
                {group.category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <CommandTrigger />
      </div>

      {visible.map((group) => (
        <CategorySection
          key={group.title ?? "all"}
          title={group.title}
          items={group.items}
        />
      ))}

      <style>{`
        .gallery__filter {
          max-width: 1200px;
          margin: clamp(1.5rem, 4vw, 2.5rem) auto 0;
          padding: 0 clamp(1rem, 4vw, 2rem);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
        /* Raised-key 3D treatment: the list is a recessed tray, the active
           tab a lifted key. Uses the sd-* overlay tokens so it stays legible
           when a dark background is applied site-wide. */
        .gallery__filter [data-slot="tabs-list"] {
          height: auto;
          padding: 6px;
          gap: 5px;
          background: var(--sd-muted);
          border: 1px solid var(--sd-border);
          box-shadow: inset 0 2px 6px oklch(0.21 0.02 256 / 0.08);
        }
        .gallery__filter [data-slot="tabs-trigger"] {
          height: auto;
          padding: 0.6rem 1.4rem;
          font-size: 0.95rem;
          transition: color 0.18s var(--ease-out-quart),
            transform 0.18s var(--ease-out-quart),
            box-shadow 0.18s var(--ease-out-quart);
        }
        .gallery__filter [data-slot="tabs-trigger"]:hover {
          color: var(--sd-card-foreground);
        }
        .gallery__filter [data-slot="tabs-trigger"][data-state="active"] {
          background: var(--sd-card);
          color: var(--sd-card-foreground);
          border-color: var(--sd-border);
          transform: translateY(-1px);
          box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.55),
            0 3px 6px oklch(0.21 0.02 256 / 0.12),
            0 8px 18px oklch(0.21 0.02 256 / 0.08);
        }
        @media (max-width: 520px) {
          .gallery__filter [data-slot="tabs-list"] {
            max-width: 100%;
            overflow-x: auto;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery__filter [data-slot="tabs-trigger"] {
            transition: none;
          }
          .gallery__filter [data-slot="tabs-trigger"][data-state="active"] {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
