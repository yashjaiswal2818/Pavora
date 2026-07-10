"use client";

import type { ReactNode } from "react";
import { BRIDGED_TOKENS, type ThemeKit, type Tokens } from "@/lib/kits";

/**
 * Applies a kit's shadcn tokens to its subtree only. It writes every token as a
 * raw `--<name>` var (read directly by the demo's chart/sidebar pieces) and
 * re-points Pavora's `--color-*` bridge at those raw vars, so any real shadcn
 * utility (`bg-card`, `text-muted-foreground`, …) inside the scope re-skins
 * with zero forks. Dark mode just flips `data-mode`, which re-sets the raw vars
 * the bridge already references. The site's gallery chrome outside the scope is
 * untouched.
 */
export function KitThemeScope({
  kit,
  mode,
  children,
}: {
  kit: ThemeKit;
  mode: "light" | "dark";
  children: ReactNode;
}) {
  const css = buildCss(kit);
  return (
    <div className="kit-scope" data-kit={kit.slug} data-mode={mode}>
      <style>{css}</style>
      {children}
    </div>
  );
}

function rawVars(tokens: Tokens): string {
  return Object.entries(tokens)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");
}

/** Map the bridged tokens onto Pavora's `--color-*` so shadcn utilities resolve. */
function bridgeVars(tokens: Tokens): string {
  return BRIDGED_TOKENS.filter((k) => k in tokens)
    .map((k) => `  --color-${k}: var(--${k});`)
    .join("\n");
}

function buildCss(kit: ThemeKit): string {
  const sel = `.kit-scope[data-kit="${kit.slug}"]`;
  return `${sel} {
${rawVars(kit.light)}
${bridgeVars(kit.light)}
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --kit-font-sans: ${kit.fonts.sans};
  --kit-font-mono: ${kit.fonts.mono};
  font-family: var(--kit-font-sans);
  color: var(--foreground);
}
${sel}[data-mode="dark"] {
${rawVars(kit.dark)}
}`;
}
