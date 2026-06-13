"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True while the element is near the viewport, false once it scrolls well away.
 * Cards use this to mount their (sometimes expensive — blurred gradients, live
 * canvases) background only while on screen and drop it again after, so the
 * gallery stays smooth no matter how many backgrounds are registered.
 *
 * The default 600px rootMargin mounts a card about a screen early, so the
 * background is ready before it scrolls into view. Falls back to always-on when
 * IntersectionObserver is unavailable (old browsers, SSR).
 */
export function useInView<T extends Element>(rootMargin = "600px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
