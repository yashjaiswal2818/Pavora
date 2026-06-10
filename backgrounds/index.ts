import type { BackgroundModule, Category } from "./types";

/* ============================================================================
   REGISTRY — the single source of truth for every background on the site.

   To add a background:
     1. Create `backgrounds/<your-slug>.tsx` (copy `_template.tsx`).
     2. Import it as a namespace and add it to the `modules` array below.

        import * as auroraVeil from "./aurora-veil";
        const modules = [auroraVeil, ...];

   One import line + one array entry. Order here = order on the page within a
   category. `_template.tsx` is intentionally NOT registered.
============================================================================ */

import * as sunsetDrift from "./sunset-drift";
import * as peachyGlow from "./peachy-glow";
import * as auroraVeil from "./aurora-veil";
import * as cottonCandy from "./cotton-candy";
import * as dotMatrix from "./dot-matrix";
import * as blueprintGrid from "./blueprint-grid";
import * as constellation from "./constellation";
import * as starfield from "./starfield";

// ── Registered backgrounds ──────────────────────────────────────────────────
// Order within a category = order on the page.
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
