"use client";

import { useEffect, useState } from "react";
import { RotateCcw, SearchX, Sparkles } from "lucide-react";
import { byCategory } from "@/backgrounds";
import { useBackground } from "./BackgroundProvider";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

/**
 * ⌘K / Ctrl+K command palette. Fuzzy-search every background and apply it
 * site-wide, or run a quick action. Opens on the keyboard shortcut or on a
 * `pavora:command` window event (dispatched by the search field).
 *
 * Each result carries a live preview tile, a CSS/JS tag, and an "Applied"
 * marker for the background currently on the page. A footer documents the
 * keyboard model. All surfaces use the sd / chrome tokens so the palette flips
 * with the chrome over a dark applied background.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { setActive, reset, surprise, activeSlug } = useBackground();
  const groups = byCategory();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("pavora:command", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pavora:command", onOpenEvent);
    };
  }, []);

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search backgrounds"
      description="Find and apply a background, or run a quick action."
      showCloseButton={false}
      className="palette sm:max-w-xl"
    >
      <CommandInput placeholder="Search backgrounds, categories, CSS or JS…" />
      <CommandList className="palette__list max-h-[min(62vh,440px)]">
        <CommandEmpty>
          <div className="palette__empty">
            <SearchX className="palette__empty-icon" aria-hidden />
            <p className="palette__empty-title">No backgrounds found</p>
            <p className="palette__empty-sub">
              Try another name, or a category like &ldquo;mesh&rdquo; or
              &ldquo;gradient&rdquo;.
            </p>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Quick actions">
          <CommandItem
            value="surprise me random shuffle"
            onSelect={() => run(surprise)}
          >
            <Sparkles />
            Surprise me
            <CommandShortcut>random</CommandShortcut>
          </CommandItem>
          {activeSlug && (
            <CommandItem
              value="reset clear background"
              onSelect={() => run(reset)}
            >
              <RotateCcw />
              Reset background
              <CommandShortcut>Esc</CommandShortcut>
            </CommandItem>
          )}
        </CommandGroup>
        <CommandSeparator />

        {groups.map((group) => (
          <CommandGroup key={group.category} heading={group.category}>
            {group.items.map((module) => {
              const isActive = module.meta.slug === activeSlug;
              return (
                <CommandItem
                  key={module.meta.slug}
                  value={`${module.meta.name} ${module.meta.category} ${
                    module.meta.tech
                  } ${module.meta.isDark ? "dark" : "light"}`}
                  onSelect={() => run(() => setActive(module.meta.slug))}
                  data-active={isActive}
                >
                  <span className="palette__swatch">
                    {module.meta.tech === "css" ? (
                      // CSS backgrounds render a cheap live preview tile.
                      <module.Background playing={false} />
                    ) : (
                      // JS/canvas backgrounds get a static chip — no need to
                      // spin up a real canvas context just for a preview tile.
                      <span
                        aria-hidden
                        className="palette__swatch-js"
                      />
                    )}
                  </span>
                  <span className="palette__name">{module.meta.name}</span>
                  {isActive ? (
                    <span className="palette__badge palette__badge--applied">
                      <span className="palette__dot" aria-hidden />
                      Applied
                    </span>
                  ) : (
                    <span className="palette__badge palette__badge--tech">
                      {module.meta.tech === "css" ? "CSS" : "JS"}
                    </span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>

      <div className="palette__footer" aria-hidden>
        <span className="palette__hints">
          <span className="palette__hint">
            <kbd className="palette__key">↑</kbd>
            <kbd className="palette__key">↓</kbd>
            navigate
          </span>
          <span className="palette__hint">
            <kbd className="palette__key">↵</kbd>
            apply
          </span>
        </span>
        <span className="palette__hint">
          <kbd className="palette__key">esc</kbd>
          close
        </span>
      </div>

      <style>{`
        /* The input is auto-focused whenever the palette opens, so the global
           focus ring would always draw a clipped box at the dialog's top edge.
           The blinking caret and placeholder already signal focus here. */
        .palette [data-slot="command-input"]:focus-visible,
        .palette [data-slot="command-input"]:focus {
          outline: none;
        }
        .palette__list { scroll-padding-block: 0.5rem; }
        .palette__swatch {
          position: relative;
          flex: none;
          width: 52px;
          height: 34px;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid var(--sd-border);
          background: var(--sd-muted);
          box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.04);
        }
        .palette__swatch-js {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 26% 34%, oklch(0.96 0 0 / 0.9) 0.5px, transparent 1.4px),
            radial-gradient(circle at 64% 58%, oklch(0.96 0 0 / 0.7) 0.5px, transparent 1.4px),
            radial-gradient(circle at 44% 82%, oklch(0.96 0 0 / 0.55) 0.5px, transparent 1.4px),
            radial-gradient(circle at 80% 26%, oklch(0.96 0 0 / 0.6) 0.5px, transparent 1.4px),
            linear-gradient(135deg, oklch(0.24 0.04 264), oklch(0.2 0.03 256));
        }
        .palette__name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
        }
        .palette__badge {
          flex: none;
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.34rem;
          height: 1.4rem;
          padding: 0 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 600;
          line-height: 1;
        }
        .palette__badge--tech {
          letter-spacing: 0.04em;
          color: var(--sd-muted-foreground);
          background: color-mix(in oklch, var(--sd-popover-foreground) 7%, transparent);
        }
        .palette__badge--applied {
          color: var(--sd-popover-foreground);
          background: color-mix(in oklch, var(--accent) 16%, transparent);
        }
        .palette__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 22%, transparent);
        }
        /* Keep the applied row gently highlighted even when another row is the
           keyboard selection, so you can always see what's on the page. */
        [data-slot="command-item"][data-active="true"] {
          background: color-mix(in oklch, var(--accent) 7%, transparent);
        }

        .palette__empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          padding: 2.2rem 1rem 2rem;
          text-align: center;
        }
        .palette__empty-icon {
          width: 26px;
          height: 26px;
          margin-bottom: 0.3rem;
          color: var(--sd-muted-foreground);
          opacity: 0.85;
        }
        .palette__empty-title {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--sd-popover-foreground);
        }
        .palette__empty-sub {
          margin: 0;
          max-width: 30ch;
          font-size: 0.82rem;
          color: var(--sd-muted-foreground);
        }

        .palette__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.6rem 0.85rem;
          border-top: 1px solid var(--sd-border);
          background: color-mix(in oklch, var(--sd-popover-foreground) 3%, transparent);
        }
        .palette__hints {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
        }
        .palette__hint {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.74rem;
          font-weight: 500;
          color: var(--sd-muted-foreground);
        }
        .palette__key {
          display: inline-grid;
          place-items: center;
          min-width: 1.3rem;
          height: 1.3rem;
          padding: 0 0.3rem;
          border-radius: 6px;
          border: 1px solid var(--sd-border);
          background: var(--sd-popover);
          color: var(--sd-popover-foreground);
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 600;
          line-height: 1;
        }
      `}</style>
    </CommandDialog>
  );
}
