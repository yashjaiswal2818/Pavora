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
