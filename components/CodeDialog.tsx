"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { BackgroundModule } from "@/backgrounds/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { copyCode } from "@/lib/copy";
import { CopyIcon } from "./icons";

interface CodeDialogContextValue {
  /** Open the code viewer for a background module. */
  openCode: (module: BackgroundModule) => void;
}

const CodeDialogContext = createContext<CodeDialogContextValue | null>(null);

/**
 * Provides a single shared "view & copy the source" dialog. Cards and the
 * preview bar call `openCode(module)` instead of mounting a dialog each.
 */
export function CodeDialogProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<BackgroundModule | null>(null);
  const openCode = useCallback((module: BackgroundModule) => setActive(module), []);

  return (
    <CodeDialogContext.Provider value={{ openCode }}>
      {children}
      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
          {active && (
            <>
              <DialogHeader className="flex-row items-center justify-between gap-4 space-y-0 border-b border-border px-5 py-4 pr-14 text-left">
                <div className="min-w-0">
                  <DialogTitle>{active.meta.name}</DialogTitle>
                  <DialogDescription className="mt-1 truncate">
                    {active.meta.tech === "css" ? "CSS" : "JavaScript"}
                    {active.meta.animated ? " · animated" : ""} · by{" "}
                    {active.meta.author}
                  </DialogDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyCode(active.code)}
                  className="shrink-0"
                >
                  <CopyIcon />
                  Copy
                </Button>
              </DialogHeader>
              <pre className="m-0 max-h-[60vh] overflow-auto bg-muted px-5 py-4 text-[13px] leading-relaxed">
                <code className="font-mono text-popover-foreground">
                  {active.code}
                </code>
              </pre>
            </>
          )}
        </DialogContent>
      </Dialog>
    </CodeDialogContext.Provider>
  );
}

export function useCodeDialog() {
  const ctx = useContext(CodeDialogContext);
  if (!ctx) {
    throw new Error("useCodeDialog must be used within a CodeDialogProvider");
  }
  return ctx;
}
