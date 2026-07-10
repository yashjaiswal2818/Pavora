"use client";

import { useState } from "react";
import { ArrowLeft, Code2, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { kitToCss, type ThemeKit } from "@/lib/kits";
import { KitBackground } from "./KitBackground";
import { KitThemeScope } from "./KitThemeScope";
import { TrackerDemo } from "./TrackerDemo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CodeBlock } from "@/components/ui/code-block";
import { copyCode } from "@/lib/copy";

/**
 * The full-screen "feel the whole system" surface. The paired background runs
 * live behind a floating app window; the window's contents are skinned by the
 * kit's tokens via KitThemeScope. The sales chrome (kit name, light/dark, the
 * paste-ready CSS, the buy CTA) sits outside the scope, in Pavora's own voice.
 */
export function KitShell({ kit }: { kit: ThemeKit }) {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [cssOpen, setCssOpen] = useState(false);
  const css = kitToCss(kit);

  return (
    <div className="kit-exp">
      <KitBackground slug={kit.backgroundSlug} />

      <header className="kit-bar">
        <a className="kit-back" href="/theme">
          <ArrowLeft size={16} />
          <span>Kits</span>
        </a>

        <div className="kit-id">
          <span className="kit-swatch" aria-hidden />
          <span className="kit-id-text">
            <span className="kit-id-name">{kit.name}</span>
            <span className="kit-id-sub">theme + background kit</span>
          </span>
        </div>

        <div className="kit-controls">
          <div className="kit-modes" role="group" aria-label="Preview mode">
            <button
              type="button"
              className={`kit-mode${mode === "light" ? " is-on" : ""}`}
              aria-pressed={mode === "light"}
              onClick={() => setMode("light")}
            >
              <Sun size={15} /> Light
            </button>
            <button
              type="button"
              className={`kit-mode${mode === "dark" ? " is-on" : ""}`}
              aria-pressed={mode === "dark"}
              onClick={() => setMode("dark")}
            >
              <Moon size={15} /> Dark
            </button>
          </div>

          <button type="button" className="kit-cta kit-cta--ghost" onClick={() => setCssOpen(true)}>
            <Code2 size={15} /> View theme CSS
          </button>

          <button
            type="button"
            className="kit-cta kit-cta--buy"
            onClick={() => toast("Checkout isn't wired up in this prototype yet")}
          >
            Get this kit · ${kit.price}
          </button>
        </div>
      </header>

      <div className="kit-stage">
        <KitThemeScope kit={kit} mode={mode}>
          <div className="kit-window">
            <div className="kit-titlebar">
              <span className="kit-lights" aria-hidden>
                <i style={{ background: "#ff5f57" }} />
                <i style={{ background: "#febc2e" }} />
                <i style={{ background: "#28c840" }} />
              </span>
              <span className="kit-url">app.northwind.io/boards/sprint-24</span>
              <span className="kit-titlebar-spacer" />
            </div>
            <div className="kit-windowbody">
              <TrackerDemo />
            </div>
          </div>
        </KitThemeScope>
      </div>

      <Dialog open={cssOpen} onOpenChange={setCssOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="px-5 py-4 pr-14 text-left">
            <DialogTitle>{kit.name} — theme tokens</DialogTitle>
            <DialogDescription className="mt-1">
              The exact CSS that skins this demo. Paste into your globals.css.
            </DialogDescription>
          </DialogHeader>
          <div className="px-3 pb-3">
            <CodeBlock code={css} onCopy={(c) => copyCode(c)} preClassName="max-h-[60vh]" />
          </div>
        </DialogContent>
      </Dialog>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
.kit-exp {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-family: var(--font-sans);
}

.kit-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  flex: none;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 11px clamp(14px, 3vw, 22px);
  color: #f4f4f5;
  background: color-mix(in oklab, #0a0a0d 60%, transparent);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
}

.kit-back {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 10px; border-radius: 999px;
  color: rgb(244 244 245 / 0.72);
  font-size: 13.5px; font-weight: 600; text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}
.kit-back:hover { background: rgb(255 255 255 / 0.08); color: #fff; }

.kit-id { display: flex; align-items: center; gap: 10px; }
.kit-swatch {
  width: 26px; height: 26px; border-radius: 8px; flex: none;
  background: linear-gradient(135deg, #fbbf24, #b45309);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.18), 0 2px 6px rgb(245 158 11 / 0.4);
}
.kit-id-text { display: flex; flex-direction: column; line-height: 1.25; }
.kit-id-name { font-size: 14px; font-weight: 700; letter-spacing: -0.01em; }
.kit-id-sub { font-size: 11.5px; color: rgb(244 244 245 / 0.55); }

.kit-controls { display: flex; align-items: center; gap: 10px; margin-left: auto; }

.kit-modes {
  display: flex; gap: 2px; padding: 3px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
  border: 1px solid rgb(255 255 255 / 0.06);
}
.kit-mode {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border: none; border-radius: 999px;
  background: transparent; color: rgb(244 244 245 / 0.66);
  font-size: 13px; font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;
}
.kit-mode:hover { color: #fff; }
.kit-mode.is-on { background: #fafafa; color: #18181b; }

.kit-cta {
  display: inline-flex; align-items: center; gap: 7px;
  height: 36px; padding: 0 15px; border-radius: 999px;
  font-size: 13.5px; font-weight: 600; border: 1px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.05s ease;
}
.kit-cta:active { transform: translateY(0.5px); }
.kit-cta--ghost {
  background: rgb(255 255 255 / 0.06);
  border-color: rgb(255 255 255 / 0.12);
  color: #f4f4f5;
}
.kit-cta--ghost:hover { background: rgb(255 255 255 / 0.12); }
.kit-cta--buy {
  background: linear-gradient(180deg, #fbbf24, #f59e0b);
  color: #1c1206;
  box-shadow: 0 4px 16px rgb(245 158 11 / 0.4);
}
.kit-cta--buy:hover { background: linear-gradient(180deg, #fcc94a, #f7a912); }

.kit-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 3vw, 32px) clamp(12px, 4vw, 44px) clamp(28px, 5vw, 52px);
  position: relative;
  z-index: 10;
}
.kit-scope { width: 100%; display: flex; justify-content: center; }

.kit-window {
  width: min(1180px, 100%);
  height: min(80vh, 760px);
  display: flex; flex-direction: column;
  border-radius: 16px; overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
  box-shadow: 0 40px 90px -28px rgb(0 0 0 / 0.62), 0 0 0 1px rgb(255 255 255 / 0.05);
}

.kit-titlebar {
  flex: none;
  display: flex; align-items: center; gap: 14px;
  height: 40px; padding: 0 14px;
  background: var(--card);
  border-bottom: 1px solid var(--border);
}
.kit-lights { display: inline-flex; gap: 7px; }
.kit-lights i { width: 11px; height: 11px; border-radius: 50%; display: block; }
.kit-url {
  flex: 1; max-width: 360px; margin: 0 auto;
  text-align: center;
  padding: 4px 12px; border-radius: 7px;
  background: var(--muted);
  color: var(--muted-foreground);
  font-size: 12px; font-family: var(--kit-font-mono, ui-monospace, monospace);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.kit-titlebar-spacer { width: 52px; flex: none; }
.kit-windowbody { flex: 1; min-height: 0; }

@media (max-width: 760px) {
  .kit-id-sub { display: none; }
  .kit-cta--ghost { display: none; }
  .kit-window { height: min(86vh, 680px); }
}
@media (prefers-reduced-motion: reduce) {
  .kit-bar { backdrop-filter: none; -webkit-backdrop-filter: none; background: #0c0c0f; }
}
`;
