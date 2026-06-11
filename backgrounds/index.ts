import type { BackgroundModule, Category } from "./types";

// The registry. To add a background: copy _template.tsx to backgrounds/<slug>.tsx,
// import it here, and add it to `modules`. Order within a category is the order
// it appears on the page.

import * as sunsetDrift from "./sunset-drift";
import * as peachyGlow from "./peachy-glow";
import * as auroraVeil from "./aurora-veil";
import * as cottonCandy from "./cotton-candy";
import * as dotMatrix from "./dot-matrix";
import * as blueprintGrid from "./blueprint-grid";
import * as constellation from "./constellation";
import * as starfield from "./starfield";

const modules: BackgroundModule[] = [
  sunsetDrift,
  peachyGlow,
  auroraVeil,
  cottonCandy,
  dotMatrix,
  blueprintGrid,
  constellation,
  starfield,
];

/** Every registered background, in declaration order. */
export const backgrounds: BackgroundModule[] = modules;

/** The order categories appear on the page. */
export const categoryOrder: Category[] = [
  "Gradients",
  "Mesh",
  "Patterns",
  "Particles",
];

/** Look up a single background by its slug. */
export function getBySlug(slug: string): BackgroundModule | undefined {
  return backgrounds.find((b) => b.meta.slug === slug);
}

/** Group backgrounds by category, skipping empty categories, in page order. */
export function byCategory(): { category: Category; items: BackgroundModule[] }[] {
  return categoryOrder
    .map((category) => ({
      category,
      items: backgrounds.filter((b) => b.meta.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

/** Pick a random slug, optionally excluding the one currently applied. */
export function randomSlug(exclude?: string | null): string | undefined {
  const pool = exclude
    ? backgrounds.filter((b) => b.meta.slug !== exclude)
    : backgrounds;
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)].meta.slug;
}
