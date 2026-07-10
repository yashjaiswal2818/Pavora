/**
 * Theme kits — the paid layer on top of the free backgrounds. A kit pairs one
 * background colourway with a full shadcn token set (light + dark) plus the
 * fonts it was tuned for. The `/theme/[slug]` demo renders a real app skinned
 * entirely by these tokens, on top of the paired background, so a buyer feels
 * the whole design system at full scale before paying.
 *
 * Backgrounds stay free and MIT; this is the only place money enters.
 */

/** A shadcn token map keyed by the raw variable name (no leading `--`). */
export type Tokens = Record<string, string>;

export interface ThemeKit {
  /** URL-safe id, e.g. "filament-amber". */
  slug: string;
  /** Display name, e.g. "Filament Amber". */
  name: string;
  /** One line shown on the demo + index. */
  tagline: string;
  /** The free background slug this theme is paired with (see backgrounds/). */
  backgroundSlug: string;
  /** One-time price in whole USD. Placeholder pricing for the prototype. */
  price: number;
  /** Light-mode tokens (the shadcn `:root` set). */
  light: Tokens;
  /** Dark-mode tokens (the shadcn `.dark` set). */
  dark: Tokens;
  /** Font stacks the theme was tuned for. */
  fonts: { sans: string; mono: string; serif?: string };
}

/**
 * The tokens that bridge to Pavora's shadcn utilities (`bg-card`,
 * `text-muted-foreground`, …) via the `--color-*` mapping in globals.css.
 * Everything else (chart-*, sidebar-*, radius) is read raw by the demo.
 */
export const BRIDGED_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
] as const;

export const filamentAmber: ThemeKit = {
  slug: "filament-amber",
  name: "Filament Amber",
  tagline: "Warm amber UI tuned to live over the Filament background.",
  backgroundSlug: "filament-amber",
  price: 12,
  fonts: {
    sans: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    mono: "var(--font-jetbrains), ui-monospace, monospace",
    serif: "ui-serif, Georgia, serif",
  },
  light: {
    background: "#ffffff",
    foreground: "#262626",
    card: "#ffffff",
    "card-foreground": "#262626",
    popover: "#ffffff",
    "popover-foreground": "#262626",
    primary: "#f59e0b",
    "primary-foreground": "#1c1206",
    secondary: "#f3f4f6",
    "secondary-foreground": "#4b5563",
    muted: "#f9fafb",
    "muted-foreground": "#6b7280",
    accent: "#fffbeb",
    "accent-foreground": "#92400e",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#e5e7eb",
    input: "#e5e7eb",
    ring: "#f59e0b",
    "chart-1": "#f59e0b",
    "chart-2": "#d97706",
    "chart-3": "#b45309",
    "chart-4": "#0ea5e9",
    "chart-5": "#10b981",
    sidebar: "#f9fafb",
    "sidebar-foreground": "#262626",
    "sidebar-primary": "#f59e0b",
    "sidebar-primary-foreground": "#1c1206",
    "sidebar-accent": "#fffbeb",
    "sidebar-accent-foreground": "#92400e",
    "sidebar-border": "#e5e7eb",
    "sidebar-ring": "#f59e0b",
    radius: "0.5rem",
  },
  dark: {
    background: "#171717",
    foreground: "#e5e5e5",
    card: "#212121",
    "card-foreground": "#e5e5e5",
    popover: "#212121",
    "popover-foreground": "#e5e5e5",
    primary: "#f59e0b",
    "primary-foreground": "#1c1206",
    secondary: "#262626",
    "secondary-foreground": "#e5e5e5",
    muted: "#262626",
    "muted-foreground": "#a3a3a3",
    accent: "#3a2a0c",
    "accent-foreground": "#fde68a",
    destructive: "#f87171",
    "destructive-foreground": "#1a0a0a",
    border: "#333333",
    input: "#3a3a3a",
    ring: "#f59e0b",
    "chart-1": "#fbbf24",
    "chart-2": "#f59e0b",
    "chart-3": "#d97706",
    "chart-4": "#38bdf8",
    "chart-5": "#34d399",
    sidebar: "#0f0f0f",
    "sidebar-foreground": "#e5e5e5",
    "sidebar-primary": "#f59e0b",
    "sidebar-primary-foreground": "#1c1206",
    "sidebar-accent": "#3a2a0c",
    "sidebar-accent-foreground": "#fde68a",
    "sidebar-border": "#2a2a2a",
    "sidebar-ring": "#f59e0b",
  },
};

export const kits: ThemeKit[] = [filamentAmber];

export function getKit(slug: string): ThemeKit | undefined {
  return kits.find((k) => k.slug === slug);
}

/**
 * Render a kit as the exact paste-ready CSS a buyer gets — the same tweakcn-flavoured
 * `:root` / `.dark` / `@theme inline` block that skins the live demo. What you
 * copy is what you saw.
 */
export function kitToCss(kit: ThemeKit): string {
  const block = (tokens: Tokens) =>
    Object.entries(tokens)
      .map(([k, v]) => `  --${k}: ${v};`)
      .join("\n");

  const fontVars = [
    `  --font-sans: ${kit.fonts.sans};`,
    `  --font-mono: ${kit.fonts.mono};`,
    kit.fonts.serif ? `  --font-serif: ${kit.fonts.serif};` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const themeKeys = Array.from(
    new Set([...Object.keys(kit.light), ...Object.keys(kit.dark)]),
  ).filter((k) => k !== "radius");

  const themeInline = themeKeys
    .map((k) => `  --color-${k}: var(--${k});`)
    .join("\n");

  return `:root {
${block(kit.light)}
${fontVars}
}

.dark {
${block(kit.dark)}
}

@theme inline {
${themeInline}
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}`;
}
