"use client";

import { useState } from "react";
import { byCategory } from "@/backgrounds";
import { CategorySection } from "./CategorySection";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Client-side gallery. Resolving the registry here (rather than in the server
 * page) keeps the background modules entirely on the client, so component
 * references never cross the server→client boundary. A Tabs control filters the
 * visible categories; "All" shows every section.
 */
export function Gallery() {
  const groups = byCategory();
  const [filter, setFilter] = useState<string>("all");
  const visible =
    filter === "all" ? groups : groups.filter((g) => g.category === filter);

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
          key={group.category}
          category={group.category}
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
