"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

/* Adapted from cult-ui's CodeBlock (https://cult-ui.com/docs/components/code-block),
   single-block layout only — no tabs. Re-themed onto the --sd-* overlay bridge
   (it lives inside the code dialog, which flips dark), and the copy→check icon
   swap is plain CSS transitions instead of the `motion` dependency. */

interface CodeBlockProps {
  code: string;
  /** Override the copy action (e.g. to fire the site toast). Defaults to a plain clipboard write. */
  onCopy?: (code: string) => void | Promise<void>;
  className?: string;
  /** Extra classes for the inner <pre> (e.g. a max-height). */
  preClassName?: string;
}

export function CodeBlock({ code, onCopy, className, preClassName }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      await onCopy(code);
    } else {
      await navigator.clipboard.writeText(code);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-slot="code-block"
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border p-0.5",
        "bg-muted text-popover-foreground",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className={cn(
            "absolute top-2 right-2 z-10",
            "flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium",
            "text-muted-foreground",
            "bg-popover/80 backdrop-blur-sm",
            "border border-border/50",
            "opacity-70 group-hover:opacity-100",
            "hover:bg-accent hover:text-popover-foreground",
            "transition-all duration-150 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            "motion-reduce:transition-none motion-reduce:active:scale-100",
          )}
        >
          <span className="relative size-3.5">
            <Copy
              className={cn(
                "absolute inset-0 size-full transition-all duration-200 motion-reduce:transition-none",
                copied ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
              )}
            />
            <Check
              className={cn(
                "absolute inset-0 size-full transition-all duration-200 motion-reduce:transition-none",
                copied ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0",
              )}
            />
          </span>
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
        <pre
          className={cn(
            "m-0 overflow-auto rounded-[14px] bg-popover p-4 text-[13px] leading-relaxed",
            preClassName,
          )}
        >
          <code className="block font-mono whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
}
