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
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const setActive = useCallback((slug: string) => setActiveSlug(slug), []);
  const reset = useCallback(() => setActiveSlug(null), []);
  const surprise = useCallback(() => {
    setActiveSlug((current) => randomSlug(current) ?? current);
  }, []);

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
    <BackgroundContext.Provider value={{ activeSlug, setActive, reset, surprise }}>
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
