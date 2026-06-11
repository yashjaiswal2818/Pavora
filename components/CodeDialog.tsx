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
import { CodeBlock } from "@/components/ui/code-block";
import { copyCode } from "@/lib/copy";

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
              <DialogHeader className="px-5 py-4 pr-14 text-left">
                <DialogTitle>{active.meta.name}</DialogTitle>
                <DialogDescription className="mt-1 truncate">
                  {active.meta.category}
                </DialogDescription>
              </DialogHeader>
              <div className="px-3 pb-3">
                <CodeBlock
                  code={active.code}
                  onCopy={(code) => copyCode(code)}
                  preClassName="max-h-[60vh]"
                />
              </div>
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
