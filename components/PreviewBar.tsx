"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { getBySlug, getFamilyForSlug } from "@/backgrounds";
import { useBackground } from "./BackgroundProvider";
import { useCodeDialog } from "./CodeDialog";
import { Customizer } from "./Customizer";
import { CopyIcon } from "./icons";

export function PreviewBar() {
  const { activeSlug, reset, customColors } = useBackground();
  const { openCode } = useCodeDialog();
  const [tweaking, setTweaking] = useState(false);

  const active = activeSlug ? getBySlug(activeSlug) : undefined;
  const fam = activeSlug ? getFamilyForSlug(activeSlug) : undefined;
  if (!active) return null;

  const canCustomize = !!fam?.family.controls?.length;
  const showPanel = tweaking && canCustomize;

  const openActiveCode = () => {
    const code = fam
      ? fam.family.code({ ...fam.variant, props: { ...fam.variant.props, ...(customColors ?? {}) } })
      : active.code;
    openCode({ ...active, code });
  };

  return (
    <div className="preview-wrap">
      {showPanel && fam ? (
        <div className="preview-panel">
          <Customizer family={fam.family} variant={fam.variant} />
        </div>
      ) : null}

      <div className="preview-bar" role="region" aria-label="Background preview controls">
        <span className="preview-bar__label">
          <span className="preview-bar__dot" aria-hidden />
          Previewing <strong>{active.meta.name}</strong>
        </span>
        <div className="preview-bar__actions">
          {canCustomize ? (
            <button
              type="button"
              className="preview-bar__tweak"
              data-active={showPanel}
              aria-pressed={showPanel}
              onClick={() => setTweaking((v) => !v)}
            >
              <Palette size={16} aria-hidden />
              Customize
            </button>
          ) : null}
          <button type="button" className="preview-bar__copy" onClick={openActiveCode}>
            <CopyIcon />
            View code
          </button>
          <button type="button" className="preview-bar__reset" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <style>{`
        .preview-wrap {
          position: fixed;
          left: 50%;
          bottom: 1.5rem;
          transform: translateX(-50%);
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          max-width: calc(100vw - 2rem);
        }
        .preview-panel {
          display: flex;
          padding: 0.6rem 1.05rem;
          border-radius: var(--radius-lg);
          background: var(--chrome-surface);
          -webkit-backdrop-filter: saturate(1.5) blur(16px);
          backdrop-filter: saturate(1.5) blur(16px);
          border: 1px solid var(--chrome-border);
          box-shadow: var(--shadow-float);
          animation: preview-bar-in 0.3s var(--ease-out-expo);
          max-width: 100%;
        }
        .preview-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0.5rem 0.5rem 1.1rem;
          border-radius: var(--radius-full);
          background: var(--chrome-surface);
          -webkit-backdrop-filter: saturate(1.5) blur(16px);
          backdrop-filter: saturate(1.5) blur(16px);
          border: 1px solid var(--chrome-border);
          color: var(--chrome-ink);
          box-shadow: var(--shadow-float);
          animation: preview-bar-in 0.4s var(--ease-out-expo);
          max-width: 100%;
        }
        .preview-bar__label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          white-space: nowrap;
        }
        .preview-bar__label strong { font-weight: 700; }
        .preview-bar__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 4px oklch(0.7 0.17 38 / 0.2);
        }
        .preview-bar__actions {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .preview-bar__tweak {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 0.85rem;
          border: 1px solid transparent;
          border-radius: var(--radius-full);
          background: transparent;
          color: var(--chrome-ink);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s var(--ease-out-quart),
            border-color 0.18s var(--ease-out-quart);
        }
        .preview-bar__tweak:hover,
        .preview-bar__tweak[data-active="true"] {
          background: var(--sd-secondary);
          border-color: var(--chrome-border);
        }
        .preview-bar__copy {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1rem;
          border: none;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: var(--primary-ink);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s var(--ease-out-quart);
        }
        .preview-bar__copy:hover { background: var(--primary-hover); }
        .preview-bar__reset {
          padding: 0.55rem 0.9rem;
          border: none;
          border-radius: var(--radius-full);
          background: transparent;
          color: var(--chrome-ink);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s var(--ease-out-quart);
        }
        .preview-bar__reset:hover { background: var(--sd-secondary); }
        @keyframes preview-bar-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .preview-panel, .preview-bar { animation: none; }
          .preview-bar__copy, .preview-bar__reset, .preview-bar__tweak { transition: none; }
        }
      `}</style>
    </div>
  );
}
