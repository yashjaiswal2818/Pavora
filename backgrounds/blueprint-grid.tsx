"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "blueprint-grid",
  name: "Blueprint Grid",
  category: "Patterns",
  tech: "css",
  animated: false,
  isDark: false,
  author: "your-username",
  github: "https://github.com/your-username",
  tags: ["grid", "light", "technical"],
};

export function Background({ className }: BackgroundProps) {
  return (
    <div className={`bp-root ${className ?? ""}`} aria-hidden>
      <style>{`
        .bp-root {
          position: absolute;
          inset: 0;
          background-color: #fbfdff;
          background-image:
            linear-gradient(to right, #cfe0f7 1px, transparent 1px),
            linear-gradient(to bottom, #cfe0f7 1px, transparent 1px),
            linear-gradient(to right, #e8f1fb 1px, transparent 1px),
            linear-gradient(to bottom, #e8f1fb 1px, transparent 1px);
          background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px;
        }
      `}</style>
    </div>
  );
}

export const code = `/* Blueprint Grid — graph-paper grid */
.bg-blueprint-grid {
  background-color: #fbfdff;
  background-image:
    linear-gradient(to right, #cfe0f7 1px, transparent 1px),
    linear-gradient(to bottom, #cfe0f7 1px, transparent 1px),
    linear-gradient(to right, #e8f1fb 1px, transparent 1px),
    linear-gradient(to bottom, #e8f1fb 1px, transparent 1px);
  background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px;
}`;
