"use client";

import type { BackgroundFamily, BackgroundVariant } from "@/backgrounds/types";
import { useBackground } from "./BackgroundProvider";

function toHex(value: string, format: "hex" | "triplet"): string {
  if (format === "hex") return value;
  const [r, g, b] = value.trim().split(/\s+/).map((n) => parseInt(n, 10));
  const h = (n: number) => Math.max(0, Math.min(255, n || 0)).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function fromHex(hex: string, format: "hex" | "triplet"): string {
  if (format === "hex") return hex;
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * The live colour editor for the applied background. Reads each editable colour
 * from the family's controls, shows a native colour picker per role, and writes
 * overrides into the background context so the whole page updates as you drag.
 */
export function Customizer({
  family,
  variant,
}: {
  family: BackgroundFamily;
  variant: BackgroundVariant;
}) {
  const { customColors, setCustomColor, resetColors } = useBackground();
  const controls = family.controls ?? [];
  if (!controls.length) return null;

  return (
    <div className="customizer" role="group" aria-label={`Customize ${family.name}`}>
      <div className="customizer__swatches">
        {controls.map((ctrl) => {
          const value = customColors?.[ctrl.key] ?? (variant.props[ctrl.key] as string);
          return (
            <label key={ctrl.key} className="customizer__swatch">
              <input
                type="color"
                value={toHex(value, ctrl.format)}
                onChange={(e) => setCustomColor(ctrl.key, fromHex(e.target.value, ctrl.format))}
                aria-label={ctrl.label}
              />
              <span>{ctrl.label}</span>
            </label>
          );
        })}
      </div>
      {customColors ? (
        <button type="button" className="customizer__reset" onClick={resetColors}>
          Reset colours
        </button>
      ) : null}
      <style>{`
        .customizer {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          flex-wrap: wrap;
        }
        .customizer__swatches {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .customizer__swatch {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--chrome-ink);
          cursor: pointer;
        }
        .customizer__swatch input[type="color"] {
          inline-size: 26px;
          block-size: 26px;
          padding: 0;
          border: 1px solid var(--chrome-border);
          border-radius: 8px;
          background: none;
          cursor: pointer;
        }
        .customizer__swatch input[type="color"]::-webkit-color-swatch-wrapper { padding: 2px; }
        .customizer__swatch input[type="color"]::-webkit-color-swatch { border: none; border-radius: 6px; }
        .customizer__swatch input[type="color"]::-moz-color-swatch { border: none; border-radius: 6px; }
        .customizer__reset {
          padding: 0.4rem 0.7rem;
          border: none;
          border-radius: var(--radius-full);
          background: transparent;
          color: var(--chrome-muted);
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.16s var(--ease-out-quart);
        }
        .customizer__reset:hover { color: var(--chrome-ink); }
        @media (prefers-reduced-motion: reduce) {
          .customizer__reset { transition: none; }
        }
      `}</style>
    </div>
  );
}
