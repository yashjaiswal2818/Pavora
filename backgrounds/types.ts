import type { ComponentType } from "react";

/** The category a background is grouped under in the gallery. */
export type Category = "Gradients" | "Mesh" | "Patterns" | "Particles";

/** How the background is built — pure CSS or a JS/canvas effect. */
export type Tech = "css" | "js";

export interface BackgroundMeta {
  /** URL-safe unique id. Matches the filename, e.g. "aurora-veil". */
  slug: string;
  /** Display name, e.g. "Aurora Veil". */
  name: string;
  category: Category;
  tech: Tech;
  /**
   * Is the background dark? When applied full-page, dark backgrounds flip the
   * site chrome to light so it stays readable.
   */
  isDark: boolean;
}

export interface BackgroundProps {
  /**
   * When false, animation is paused — the gallery does this until a card is
   * hovered. Applied full-page it's always true; static backgrounds ignore it.
   */
  playing?: boolean;
  className?: string;
}

/** One background = one module exporting these three things. */
export interface BackgroundModule {
  meta: BackgroundMeta;
  Background: ComponentType<BackgroundProps>;
  /** The exact code the Copy button puts on the clipboard. */
  code: string;
}

/**
 * A curated colorway / configuration of a background family. The registry
 * expands every variant into its own standalone BackgroundModule.
 */
export interface BackgroundVariant {
  /** Short id, unique within the family, e.g. "ember". */
  id: string;
  /** Switcher label, e.g. "Ember". */
  name: string;
  isDark: boolean;
  /** Props handed to the family's Background component and to `code()`. */
  props: Record<string, unknown>;
}

/** One editable colour on a family, surfaced live in the customizer. */
export interface FamilyControl {
  /** Which prop on the variant this edits. */
  key: string;
  /** Label shown next to the colour picker. */
  label: string;
  /** How the prop is stored, so the picker can convert to/from hex. */
  format: "hex" | "triplet";
}

/**
 * A background family: one parametrised component plus several curated
 * variants. One file → many gallery entries, so the catalog scales without one
 * file per colorway. A plain BackgroundModule is just a family of one.
 */
export interface BackgroundFamily {
  slug: string;
  name: string;
  category: Category;
  tech: Tech;
  Background: ComponentType<BackgroundProps & { variant?: BackgroundVariant }>;
  variants: BackgroundVariant[];
  /** Generates the paste-ready snippet for one variant. */
  code: (variant: BackgroundVariant) => string;
  /** Colours the customizer lets people edit live (omit for fixed families). */
  controls?: FamilyControl[];
}

/** One selectable colorway inside a gallery family card. */
export interface FamilyVariant {
  label: string;
  module: BackgroundModule;
}

/**
 * What the gallery renders: one card per family, with a colorway switcher when
 * it has more than one variant. Single backgrounds are a family of one.
 */
export interface GalleryFamily {
  slug: string;
  name: string;
  category: Category;
  variants: FamilyVariant[];
}
