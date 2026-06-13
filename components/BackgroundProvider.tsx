"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getBySlug, randomSlug } from "@/backgrounds";

interface BackgroundContextValue {
  /** Slug of the background applied to the whole site, or null. */
  activeSlug: string | null;
  /** Apply a background site-wide. */
  setActive: (slug: string) => void;
  /** Clear the applied background (back to the plain gallery). */
  reset: () => void;
  /** Apply a random background (excludes the current one). */
  surprise: () => void;
  /** Live colour overrides for the applied background, keyed by prop. */
  customColors: Record<string, string> | null;
  /** Override one editable colour on the applied background. */
  setCustomColor: (key: string, value: string) => void;
  /** Drop all colour overrides, back to the chosen colourway. */
  resetColors: () => void;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [customColors, setCustomColors] = useState<Record<string, string> | null>(null);

  const setActive = useCallback((slug: string) => setActiveSlug(slug), []);
  const reset = useCallback(() => setActiveSlug(null), []);
  const surprise = useCallback(() => {
    setActiveSlug((current) => randomSlug(current) ?? current);
  }, []);
  const setCustomColor = useCallback((key: string, value: string) => {
    setCustomColors((prev) => ({ ...(prev ?? {}), [key]: value }));
  }, []);
  const resetColors = useCallback(() => setCustomColors(null), []);

  // Switching (or clearing) the applied background drops any colour edits.
  useEffect(() => {
    setCustomColors(null);
  }, [activeSlug]);

  // Auto-contrast: flip the site chrome to light while a dark background is applied.
  useEffect(() => {
    const active = activeSlug ? getBySlug(activeSlug) : undefined;
    const root = document.documentElement;
    if (active?.meta.isDark) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
  }, [activeSlug]);

  // Esc clears the applied background.
  useEffect(() => {
    if (!activeSlug) return;
    function onKey(e: KeyboardEvent) {
      // Radix calls preventDefault() when Escape dismisses the top layer (the
      // command palette or code dialog). Only clear the applied background when
      // no overlay handled the key, so closing a dialog doesn't also reset.
      if (e.key === "Escape" && !e.defaultPrevented) reset();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSlug, reset]);

  return (
    <BackgroundContext.Provider
      value={{ activeSlug, setActive, reset, surprise, customColors, setCustomColor, resetColors }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return ctx;
}
