"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { BackgroundFamily, BackgroundProps, BackgroundVariant } from "./types";

/* A dim grid in the dark that lights up only where you point: a bright copy of
   the grid is revealed through a soft circular mask that follows the cursor, so
   moving the pointer feels like sweeping a torch across it. Rests at centre
   until you move, and stays still under reduced motion. */

type SplColors = { bg: string; line: string; glow: string };

const COLORWAYS: { id: string; name: string; isDark: boolean; props: SplColors }[] = [
  { id: "cobalt", name: "Cobalt", isDark: true, props: { bg: "#07090f", line: "rgba(255, 255, 255, 0.05)", glow: "rgba(120, 160, 255, 0.85)" } },
  { id: "emerald", name: "Emerald", isDark: true, props: { bg: "#04100c", line: "rgba(255, 255, 255, 0.05)", glow: "rgba(80, 230, 170, 0.85)" } },
  { id: "violet", name: "Violet", isDark: true, props: { bg: "#09060f", line: "rgba(255, 255, 255, 0.05)", glow: "rgba(170, 120, 255, 0.85)" } },
  { id: "amber", name: "Amber", isDark: true, props: { bg: "#0d0904", line: "rgba(255, 255, 255, 0.05)", glow: "rgba(255, 190, 90, 0.9)" } },
];

function Background({ className, variant }: BackgroundProps & { variant?: BackgroundVariant }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--spl-x", ((e.clientX - r.left) / r.width) * 100 + "%");
      el.style.setProperty("--spl-y", ((e.clientY - r.top) / r.height) * 100 + "%");
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const c = (variant?.props as SplColors | undefined) ?? COLORWAYS[0].props;
  const vars = { "--spl-bg": c.bg, "--spl-line": c.line, "--spl-glow": c.glow } as CSSProperties;

  return (
    <div ref={ref} className={`spl-root ${className ?? ""}`} style={vars} aria-hidden>
      <style>{`
        .spl-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: var(--spl-bg);
        }
        .spl-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--spl-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--spl-line) 1px, transparent 1px);
          background-size: 36px 36px;
        }
        .spl-root::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--spl-glow) 1px, transparent 1px),
            linear-gradient(90deg, var(--spl-glow) 1px, transparent 1px);
          background-size: 36px 36px;
          -webkit-mask-image: radial-gradient(24% 32% at var(--spl-x, 50%) var(--spl-y, 40%), #000 0%, transparent 70%);
                  mask-image: radial-gradient(24% 32% at var(--spl-x, 50%) var(--spl-y, 40%), #000 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
}

function code(variant: BackgroundVariant): string {
  const c = variant.props as SplColors;
  return `<!-- Spotlight · ${variant.name} — a grid that lights up under the cursor -->
<div class="bg-spotlight"></div>

<style>
.bg-spotlight {
  position: relative;
  overflow: hidden;
  background: ${c.bg};
}
.bg-spotlight::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(${c.line} 1px, transparent 1px),
    linear-gradient(90deg, ${c.line} 1px, transparent 1px);
  background-size: 36px 36px;
}
.bg-spotlight::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(${c.glow} 1px, transparent 1px),
    linear-gradient(90deg, ${c.glow} 1px, transparent 1px);
  background-size: 36px 36px;
  -webkit-mask-image: radial-gradient(24% 32% at var(--spl-x, 50%) var(--spl-y, 40%), #000 0%, transparent 70%);
          mask-image: radial-gradient(24% 32% at var(--spl-x, 50%) var(--spl-y, 40%), #000 0%, transparent 70%);
}
</style>

<script>
(function () {
  var el = document.querySelector(".bg-spotlight");
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.addEventListener("pointermove", function (e) {
    var r = el.getBoundingClientRect();
    el.style.setProperty("--spl-x", (e.clientX - r.left) / r.width * 100 + "%");
    el.style.setProperty("--spl-y", (e.clientY - r.top) / r.height * 100 + "%");
  });
})();
</script>`;
}

export const family: BackgroundFamily = {
  slug: "spotlight",
  name: "Spotlight",
  category: "Patterns",
  tech: "js",
  Background,
  variants: COLORWAYS.map((c) => ({ id: c.id, name: c.name, isDark: c.isDark, props: c.props })),
  code,
};
