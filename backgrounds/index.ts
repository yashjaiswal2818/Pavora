import { createElement } from "react";
import type {
  BackgroundFamily,
  BackgroundModule,
  BackgroundProps,
  BackgroundVariant,
  Category,
  FamilyVariant,
  GalleryFamily,
} from "./types";

// The registry. To add a single background: copy _template.tsx to
// backgrounds/<slug>.tsx, import it here, and add it to `entries`. To add
// colourways to one background, make it a family (see eclipse.tsx) that exports
// `family` and import that instead. Order within a category is page order.

import * as peachyGlow from "./peachy-glow";
import * as risoSunset from "./riso-sunset";
import { family as eclipse } from "./eclipse";
import { family as borealis } from "./borealis";
import * as auroraVeil from "./aurora-veil";
import * as cottonCandy from "./cotton-candy";
import * as rawSilk from "./raw-silk";
import * as lavaLamp from "./lava-lamp";
import * as inkWash from "./ink-wash";
import * as dotMatrix from "./dot-matrix";
import * as checkerFade from "./checker-fade";
import * as constellation from "./constellation";
import * as starfield from "./starfield";
import * as fireflies from "./fireflies";
import * as dustMotes from "./dust-motes";
import * as wisp from "./wisp";

// Gradients
import * as abyss from "./abyss";
import * as limelight from "./limelight";
import * as nacre from "./nacre";
import * as gildedHour from "./gilded-hour";
import * as glacier from "./glacier";
// Mesh
import { family as pigment } from "./pigment";
import * as lagoon from "./lagoon";
import * as carrara from "./carrara";
import * as plume from "./plume";
// Patterns
import * as contour from "./contour";
import * as isometric from "./isometric";
import * as terrazzo from "./terrazzo";
// Particles
import * as snowfall from "./snowfall";
import * as sakura from "./sakura";
import * as bokeh from "./bokeh";
import * as bubbles from "./bubbles";
import * as meteors from "./meteors";

// Families (one parametrised component, several colourways)
import { family as halo } from "./halo";
import { family as beam } from "./beam";
import { family as spotlightGrid } from "./spotlight-grid";
import { family as grid } from "./grid";
import { family as shapeGrid } from "./shape-grid";
import { family as dotGrid } from "./dot-grid";
import { family as spotlight } from "./spotlight";
import { family as horizon } from "./horizon";
import { family as filament } from "./filament";
import { family as dither } from "./dither";
import { family as swell } from "./swell";
import { family as orbit } from "./orbit";
import { family as warp } from "./warp";
import { family as metaballs } from "./metaballs";

/** A registry entry is either a single background module or a family. */
type Entry = BackgroundModule | BackgroundFamily;

const entries: Entry[] = [
  // Gradients
  peachyGlow,
  risoSunset,
  eclipse,
  borealis,
  abyss,
  limelight,
  nacre,
  gildedHour,
  glacier,
  halo,
  beam,
  dither,
  // Mesh
  auroraVeil,
  cottonCandy,
  rawSilk,
  lavaLamp,
  inkWash,
  pigment,
  lagoon,
  carrara,
  plume,
  metaballs,
  // Patterns
  dotMatrix,
  checkerFade,
  contour,
  isometric,
  terrazzo,
  spotlightGrid,
  grid,
  shapeGrid,
  dotGrid,
  spotlight,
  horizon,
  swell,
  warp,
  // Particles
  constellation,
  starfield,
  fireflies,
  dustMotes,
  wisp,
  snowfall,
  sakura,
  bokeh,
  bubbles,
  meteors,
  filament,
  orbit,
];

function isFamily(entry: Entry): entry is BackgroundFamily {
  return (entry as BackgroundFamily).variants !== undefined;
}

/** Expand a registry entry into a gallery family (single backgrounds → 1 variant). */
function toGalleryFamily(entry: Entry): GalleryFamily {
  if (isFamily(entry)) {
    const fam = entry;
    const variants: FamilyVariant[] = fam.variants.map((v) => {
      const Bound = (props: BackgroundProps) =>
        createElement(fam.Background, { ...props, variant: v });
      Bound.displayName = `${fam.name}.${v.name}`;
      return {
        label: v.name,
        module: {
          meta: {
            slug: `${fam.slug}-${v.id}`,
            name: `${fam.name} ${v.name}`,
            category: fam.category,
            tech: fam.tech,
            isDark: v.isDark,
          },
          Background: Bound,
          code: fam.code(v),
        },
      };
    });
    return { slug: fam.slug, name: fam.name, category: fam.category, variants };
  }
  const mod = entry;
  return {
    slug: mod.meta.slug,
    name: mod.meta.name,
    category: mod.meta.category,
    variants: [{ label: mod.meta.name, module: mod }],
  };
}

const galleryFamilies: GalleryFamily[] = entries.map(toGalleryFamily);

// slug → its family + base variant, so the customizer can re-render a family
// background with edited props and regenerate its code.
const familyIndex = new Map<string, { family: BackgroundFamily; variant: BackgroundVariant }>();
for (const entry of entries) {
  if (isFamily(entry)) {
    for (const v of entry.variants) {
      familyIndex.set(`${entry.slug}-${v.id}`, { family: entry, variant: v });
    }
  }
}

/** The family + base variant behind a slug, or undefined for single backgrounds. */
export function getFamilyForSlug(
  slug: string,
): { family: BackgroundFamily; variant: BackgroundVariant } | undefined {
  return familyIndex.get(slug);
}

/** Every registered background, flattened across families, in declaration order. */
export const backgrounds: BackgroundModule[] = galleryFamilies.flatMap((f) =>
  f.variants.map((v) => v.module),
);

/** The order categories appear on the page. */
export const categoryOrder: Category[] = [
  "Gradients",
  "Mesh",
  "Patterns",
  "Particles",
];

/** Look up a single background (or family variant) by its slug. */
export function getBySlug(slug: string): BackgroundModule | undefined {
  return backgrounds.find((b) => b.meta.slug === slug);
}

/**
 * Flat grouping — every variant as its own entry. Used where each background is
 * listed individually (the command palette).
 */
export function byCategory(): { category: Category; items: BackgroundModule[] }[] {
  return categoryOrder
    .map((category) => ({
      category,
      items: backgrounds.filter((b) => b.meta.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

/**
 * Family grouping — one card per family, colourways nested inside. Used by the
 * gallery so variants don't spam the grid as near-duplicate cards.
 */
export function familiesByCategory(): { category: Category; families: GalleryFamily[] }[] {
  return categoryOrder
    .map((category) => ({
      category,
      families: galleryFamilies.filter((f) => f.category === category),
    }))
    .filter((group) => group.families.length > 0);
}

/** Pick a random slug, optionally excluding the one currently applied. */
export function randomSlug(exclude?: string | null): string | undefined {
  const pool = exclude
    ? backgrounds.filter((b) => b.meta.slug !== exclude)
    : backgrounds;
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)].meta.slug;
}
