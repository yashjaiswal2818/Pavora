"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

/* A self-contained, dependency-free code viewer: a fixed dark panel (so it
   reads the same over light or dark site chrome), a toolbar with a language tag
   and copy button, a line-number gutter, and a tiny tokenizer that colours
   comments / strings / numbers / keywords / tags. Hex colours get a live swatch
   — fitting, for a backgrounds gallery. */

interface CodeBlockProps {
  code: string;
  /** Override the copy action (e.g. to fire the site toast). Defaults to a plain clipboard write. */
  onCopy?: (code: string) => void | Promise<void>;
  className?: string;
  /** Extra classes for the scrollable body (e.g. a max-height). */
  preClassName?: string;
}

type Tok = { type: string; value: string };

const SPECS: [string, RegExp][] = [
  ["comment", /\/\*[\s\S]*?\*\/|\/\/[^\n]*|<!--[\s\S]*?-->/y],
  ["string", /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/y],
  ["hex", /#[0-9a-fA-F]{3,8}\b/y],
  ["number", /\b\d+(?:\.\d+)?(?:px|rem|em|%|deg|s|ms|vh|vw|fr|x)?\b/y],
  [
    "keyword",
    /@[a-zA-Z-]+|!important|\b(?:import|from|export|default|const|let|var|function|return|if|else|for|while|new|await|async|of|in|type|interface|void|null|true|false|this)\b/y,
  ],
  ["tag", /<\/?[a-zA-Z][\w-]*|\/?>/y],
  ["punct", /[{}()[\];:,]/y],
];

function tokenize(code: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  let plainStart = 0;
  while (i < code.length) {
    let hit: Tok | null = null;
    for (const [type, re] of SPECS) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m.index === i) {
        hit = { type, value: m[0] };
        break;
      }
    }
    if (hit) {
      if (plainStart < i) out.push({ type: "plain", value: code.slice(plainStart, i) });
      out.push(hit);
      i += hit.value.length;
      plainStart = i;
    } else {
      i++;
    }
  }
  if (plainStart < code.length) out.push({ type: "plain", value: code.slice(plainStart) });
  return out;
}

function detectLang(code: string): string {
  const t = code.trimStart();
  if (t.startsWith('"use client"') || t.startsWith("import ")) return "tsx";
  if (t.startsWith("<")) return "html";
  return "css";
}

export function CodeBlock({ code, onCopy, className, preClassName }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => tokenize(code), [code]);
  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const lang = useMemo(() => detectLang(code), [code]);

  const handleCopy = async () => {
    if (onCopy) await onCopy(code);
    else await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div data-slot="code-block" className={cn("cb", className)}>
      <div className="cb__bar">
        <span className="cb__lang">{lang}</span>
        <button type="button" className="cb__copy" onClick={handleCopy} aria-label="Copy code">
          <span className="cb__icon">
            <Copy className={cn("cb__i", copied && "cb__i--out")} />
            <Check className={cn("cb__i cb__i--check", copied && "cb__i--in")} />
          </span>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className={cn("cb__body", preClassName)}>
        <div className="cb__gutter" aria-hidden>
          {Array.from({ length: lineCount }, (_, n) => (
            <span key={n}>{n + 1}</span>
          ))}
        </div>
        <pre className="cb__pre">
          <code>
            {tokens.map((t, i) =>
              t.type === "hex" ? (
                <span key={i} className="cb-hex">
                  <span className="cb-swatch" style={{ background: t.value }} />
                  {t.value}
                </span>
              ) : t.type === "plain" ? (
                t.value
              ) : (
                <span key={i} className={`cb-${t.type}`}>
                  {t.value}
                </span>
              ),
            )}
          </code>
        </pre>
      </div>

      <style>{`
        .cb {
          --cb-bg: oklch(0.205 0.018 256);
          --cb-bar: oklch(0.24 0.02 256);
          --cb-border: oklch(1 0 0 / 0.1);
          --cb-text: oklch(0.9 0.012 256);
          --cb-dim: oklch(0.6 0.02 256);
          position: relative;
          border-radius: var(--radius-lg);
          border: 1px solid var(--cb-border);
          background: var(--cb-bg);
          overflow: hidden;
          box-shadow: 0 1px 0 oklch(1 0 0 / 0.04) inset, var(--shadow-card);
        }
        .cb__bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 38px;
          padding: 0 0.5rem 0 0.9rem;
          background: var(--cb-bar);
          border-bottom: 1px solid var(--cb-border);
        }
        .cb__lang {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--cb-dim);
        }
        .cb__copy {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.32rem 0.6rem;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          background: transparent;
          color: oklch(0.78 0.015 256);
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s var(--ease-out-quart),
            color 0.15s var(--ease-out-quart), border-color 0.15s var(--ease-out-quart);
        }
        .cb__copy:hover {
          background: oklch(1 0 0 / 0.06);
          border-color: var(--cb-border);
          color: var(--cb-text);
        }
        .cb__copy:active { transform: translateY(0.5px); }
        .cb__copy:focus-visible {
          outline: 2px solid oklch(0.65 0.16 256);
          outline-offset: 1px;
        }
        .cb__icon { position: relative; display: inline-grid; width: 14px; height: 14px; }
        .cb__i {
          grid-area: 1 / 1;
          width: 14px;
          height: 14px;
          transition: transform 0.2s var(--ease-out-quart), opacity 0.2s var(--ease-out-quart);
        }
        .cb__i--out { transform: scale(0) rotate(90deg); opacity: 0; }
        .cb__i--check { transform: scale(0) rotate(-90deg); opacity: 0; color: oklch(0.8 0.16 150); }
        .cb__i--in { transform: scale(1) rotate(0); opacity: 1; }
        .cb__body {
          display: flex;
          overflow: auto;
          font-family: var(--font-mono);
          font-size: 12.5px;
          line-height: 1.65;
          tab-size: 2;
        }
        .cb__gutter {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 0.9rem 0.7rem 0.9rem 1rem;
          color: oklch(0.5 0.02 256);
          user-select: none;
          text-align: right;
          border-right: 1px solid oklch(1 0 0 / 0.05);
          position: sticky;
          left: 0;
          background: var(--cb-bg);
        }
        .cb__pre {
          flex: 1 1 auto;
          margin: 0;
          padding: 0.9rem 1.1rem;
          color: var(--cb-text);
          white-space: pre;
          overflow: visible;
        }
        .cb__pre code { font-family: inherit; }
        .cb-comment { color: oklch(0.58 0.03 160); font-style: italic; }
        .cb-string  { color: oklch(0.8 0.12 145); }
        .cb-number  { color: oklch(0.82 0.12 55); }
        .cb-keyword { color: oklch(0.76 0.13 285); }
        .cb-tag     { color: oklch(0.75 0.14 20); }
        .cb-punct   { color: oklch(0.64 0.02 256); }
        .cb-hex {
          color: oklch(0.85 0.1 70);
          white-space: nowrap;
        }
        .cb-swatch {
          display: inline-block;
          width: 0.72em;
          height: 0.72em;
          margin-right: 0.3em;
          border-radius: 3px;
          vertical-align: -0.05em;
          box-shadow: 0 0 0 1px oklch(1 0 0 / 0.25) inset;
        }
        .cb__body::-webkit-scrollbar { width: 10px; height: 10px; }
        .cb__body::-webkit-scrollbar-thumb {
          background: oklch(1 0 0 / 0.12);
          border-radius: 999px;
          border: 3px solid var(--cb-bg);
        }
        .cb__body::-webkit-scrollbar-thumb:hover { background: oklch(1 0 0 / 0.2); }
        .cb__body::-webkit-scrollbar-corner { background: transparent; }
        .cb__body { scrollbar-width: thin; scrollbar-color: oklch(1 0 0 / 0.15) transparent; }
        @media (prefers-reduced-motion: reduce) {
          .cb__copy, .cb__i { transition: none; }
        }
      `}</style>
    </div>
  );
}
