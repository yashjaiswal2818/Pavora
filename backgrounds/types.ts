import type { ComponentType } from "react";

/** The category a background is grouped under on the gallery page. */
export type Category = "Gradients" | "Mesh" | "Patterns" | "Particles";

/** How the background is built — pure CSS or a JS/canvas effect. */
export type Tech = "css" | "js";

export interface BackgroundMeta {
  /** URL-safe unique id. Must match the filename, e.g. "aurora-veil". */
  slug: string;
  /** Human-friendly display name, e.g. "Aurora Veil". */
  name: string;
  category: Category;
  tech: Tech;
  /** Does it move? Drives the "Animated" badge and reduced-motion handling. */
  animated: boolean;
  /**
   * Is the background dark? When applied full-page, dark backgrounds flip the
   * site chrome (nav, preview bar) to light so it stays readable.
   */
  isDark: boolean;
  /** Contributor's display name, shown as credit on the card. */
  author: string;
  /** Full URL to the contributor's GitHub profile. */
  github: string;
  /** Short descriptive tags used for search/labels later. */
  tags: string[];
}

export interface BackgroundProps {
  /**
   * When false, animations are paused (used in the gallery grid until hover).
   * When applied full-page it is always true. Static backgrounds ignore it.
   */
  playing?: boolean;
  className?: string;
}

/** One background = one module exporting these three things. */
export interface BackgroundModule {
  meta: BackgroundMeta;
  Background: ComponentType<BackgroundProps>;
  /** The exact code the "Copy" button puts on the clipboard. */
  code: string;
}
