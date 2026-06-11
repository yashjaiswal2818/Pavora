"use client";

import { useState } from "react";
import { byCategory } from "@/backgrounds";
import type { BackgroundModule } from "@/backgrounds/types";
import { CategorySection } from "./CategorySection";
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
          justify-content: center;
        }
        @media (max-width: 520px) {
          .gallery__filter {
            justify-content: flex-start;
            overflow-x: auto;
          }
        }
      `}</style>
    </>
  );
}
