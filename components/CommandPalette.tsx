"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
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
 * `backdrop:command` window event (dispatched by the nav search button).
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
    window.addEventListener("backdrop:command", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("backdrop:command", onOpenEvent);
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
    >
      <CommandInput placeholder="Search backgrounds…" />
      <CommandList>
        <CommandEmpty>No backgrounds found.</CommandEmpty>
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
            {group.items.map((module) => (
              <CommandItem
                key={module.meta.slug}
                value={`${module.meta.name} ${module.meta.category} ${
                  module.meta.isDark ? "dark" : "light"
                }`}
                onSelect={() => run(() => setActive(module.meta.slug))}
              >
                <span className="relative h-[18px] w-7 shrink-0 overflow-hidden rounded-[5px] border border-border bg-muted">
                  {module.meta.tech === "css" ? (
                    // CSS backgrounds render a cheap live preview swatch.
                    <module.Background playing={false} />
                  ) : (
                    // JS/canvas backgrounds get a static chip — no need to spin
                    // up a real canvas context + resize listener for a 28px box.
                    <span
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 26% 36%, oklch(0.96 0 0 / 0.9) 0.5px, transparent 1.2px), radial-gradient(circle at 66% 60%, oklch(0.96 0 0 / 0.7) 0.5px, transparent 1.2px), radial-gradient(circle at 46% 82%, oklch(0.96 0 0 / 0.6) 0.5px, transparent 1.2px), oklch(0.2 0.03 256)",
                      }}
                    />
                  )}
                </span>
                {module.meta.name}
                <CommandShortcut>
                  {module.meta.tech === "css" ? "CSS" : "JS"}
                  {module.meta.isDark ? " · dark" : ""}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
