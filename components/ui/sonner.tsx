"use client";

import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Themed Sonner Toaster. Unlike the stock shadcn version this does NOT depend on
 * next-themes — Pavora flips its chrome via [data-theme="dark"], and the
 * `--sd-*` overlay tokens flip with it, so the toasts follow automatically.
 */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      offset={24}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:font-semibold group-[.toaster]:shadow-[var(--shadow-float)]",
        },
      }}
      style={
        {
          "--normal-bg": "var(--sd-popover)",
          "--normal-text": "var(--sd-popover-foreground)",
          "--normal-border": "var(--sd-border)",
          "--border-radius": "var(--radius-full)",
          fontFamily: "var(--font-sans)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
