"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface GalleryTab {
  value: string;
  label: string;
  count: number;
}

interface IndicatorRect {
  left: number;
  top: number;
  width: number;
  height: number;
  ready: boolean;
}

const HIDDEN: IndicatorRect = { left: 0, top: 0, width: 0, height: 0, ready: false };

/**
 * Category filter as a segmented control. A single measured pill glides between
 * triggers instead of each tab lifting on its own, so switching categories reads
 * as one continuous motion. Built on Radix Tabs to keep roving-tabindex keyboard
 * navigation; the indicator is decorative and sits behind the (transparent)
 * triggers. Surfaces use the sd / chrome tokens so the control stays legible
 * when a dark background is applied site-wide.
 */
export function GalleryTabs({
  tabs,
  value,
  onValueChange,
}: {
  tabs: GalleryTab[];
  value: string;
  onValueChange: (next: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<IndicatorRect>(HIDDEN);

  const measure = useCallback(() => {
    const list = rootRef.current?.querySelector<HTMLElement>(
      '[data-slot="tabs-list"]',
    );
    const active = list?.querySelector<HTMLElement>(
      '[data-slot="tabs-trigger"][data-state="active"]',
    );
    if (!list || !active) return;
    const lr = list.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    setRect({
      // Resolve against the list's padding box, accounting for its border and
      // any horizontal scroll (the list scrolls on narrow viewports).
      left: ar.left - lr.left - list.clientLeft + list.scrollLeft,
      top: ar.top - lr.top - list.clientTop + list.scrollTop,
      width: ar.width,
      height: ar.height,
      ready: true,
    });
  }, []);

  // Re-measure synchronously before paint when the active tab changes, so the
  // pill animates from its previous box to the new one.
  useLayoutEffect(() => {
    measure();
  }, [value, tabs, measure]);

  useEffect(() => {
    const list = rootRef.current?.querySelector<HTMLElement>(
      '[data-slot="tabs-list"]',
    );
    if (!list) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(list);
    list.addEventListener("scroll", measure, { passive: true });
    // Webfonts change label widths after first paint; re-measure once loaded.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      ro.disconnect();
      list.removeEventListener("scroll", measure);
    };
  }, [measure]);

  return (
    <div className="gtabs" ref={rootRef}>
      <Tabs value={value} onValueChange={onValueChange} className="gtabs__tabs">
        <TabsList className="gtabs__list">
          <span
            className="gtabs__pill"
            aria-hidden
            data-ready={rect.ready}
            style={{
              transform: `translate(${rect.left}px, ${rect.top}px)`,
              width: rect.width,
              height: rect.height,
            }}
          />
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gtabs__trigger"
            >
              <span className="gtabs__label">{tab.label}</span>
              <span className="gtabs__count">{tab.count}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <style>{`
        .gtabs { min-width: 0; }
        .gtabs__tabs { gap: 0; }
        .gtabs__list {
          position: relative;
          height: auto;
          width: auto;
          max-width: 100%;
          padding: 5px;
          gap: 2px;
          border-radius: var(--radius-full);
          background: var(--sd-muted);
          border: 1px solid var(--sd-border);
        }
        /* The gliding active key. */
        .gtabs__pill {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: var(--radius-full);
          background: var(--sd-card);
          box-shadow:
            inset 0 1px 0 oklch(1 0 0 / 0.6),
            0 1px 2px oklch(0.21 0.02 256 / 0.08),
            0 4px 12px oklch(0.21 0.02 256 / 0.10);
          opacity: 0;
          z-index: 0;
          transition:
            transform 0.42s var(--ease-out-expo),
            width 0.42s var(--ease-out-expo),
            opacity 0.2s var(--ease-out-quart);
          will-change: transform, width;
        }
        .gtabs__pill[data-ready="true"] { opacity: 1; }
        /* The token ramp puts the card below the muted tray in dark mode, which
           would make the active key recede. Lift the pill (and sink the tray) so
           it reads as raised, the same as light mode. */
        [data-theme="dark"] .gtabs__list {
          background: oklch(0.27 0.02 256);
          border-color: oklch(1 0 0 / 0.07);
        }
        [data-theme="dark"] .gtabs__pill {
          background: oklch(0.38 0.025 256);
          box-shadow:
            inset 0 1px 0 oklch(1 0 0 / 0.13),
            0 1px 2px oklch(0 0 0 / 0.35),
            0 6px 16px oklch(0 0 0 / 0.4);
        }
        /* Triggers ride above the pill and supply no background of their own. */
        .gtabs__list [data-slot="tabs-trigger"].gtabs__trigger {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          height: auto;
          gap: 0.4rem;
          padding: 0.5rem 1.05rem;
          border: 0;
          border-radius: var(--radius-full);
          background: transparent;
          box-shadow: none;
          color: var(--chrome-muted);
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          transition: color 0.22s var(--ease-out-quart);
        }
        .gtabs__trigger:hover { color: var(--chrome-ink); }
        .gtabs__trigger[data-state="active"] { color: var(--chrome-ink); }
        .gtabs__trigger[data-state="active"]:focus-visible {
          outline: none;
        }
        .gtabs__trigger:focus-visible {
          outline: 2px solid var(--sd-ring);
          outline-offset: 1px;
        }
        /* Counts use the site's muted token at full strength (no extra opacity,
           which would drop this small text below the contrast floor). They read
           as secondary against the heavier ink/muted labels next to them. */
        .gtabs__count {
          font-size: 0.74rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          line-height: 1;
          color: var(--chrome-muted);
        }

        @media (max-width: 640px) {
          .gtabs { width: 100%; }
          .gtabs__list {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            justify-content: flex-start;
            scrollbar-width: none;
          }
          .gtabs__list::-webkit-scrollbar { display: none; }
        }
        @media (max-width: 460px) {
          .gtabs__count { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gtabs__pill { transition: opacity 0.2s linear; }
          .gtabs__trigger, .gtabs__count { transition: none; }
        }
      `}</style>
    </div>
  );
}
