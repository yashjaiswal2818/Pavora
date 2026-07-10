"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBySlug } from "@/backgrounds";
import type { ThemeKit } from "@/lib/kits";

/** One kit on the index: a live preview of the paired background with the
 *  theme's palette swatched over it, linking to the full demo. */
export function KitCard({ kit }: { kit: ThemeKit }) {
  const mod = getBySlug(kit.backgroundSlug);
  const Background = mod?.Background;
  const swatches = [
    kit.light.primary,
    kit.light["chart-1"],
    kit.light["chart-2"],
    kit.light["chart-3"],
    kit.light["chart-4"],
    kit.light["chart-5"],
  ].filter(Boolean);

  return (
    <Link href={`/theme/${kit.slug}`} className="kitcard">
      <div className="kitcard-preview">
        {Background ? <Background playing /> : null}
        <div className="kitcard-scrim" aria-hidden />
        <div className="kitcard-swatches" aria-hidden>
          {swatches.map((c, i) => (
            <span key={i} style={{ background: c }} />
          ))}
        </div>
      </div>
      <div className="kitcard-info">
        <div className="kitcard-head">
          <h3>{kit.name}</h3>
          <span className="kitcard-price">${kit.price}</span>
        </div>
        <p>{kit.tagline}</p>
        <span className="kitcard-cta">
          Open live demo <ArrowRight size={15} />
        </span>
      </div>
      <style>{`
        .kitcard {
          display: flex; flex-direction: column;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--sd-card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-card);
          text-decoration: none;
          color: var(--ink);
          transition: transform 0.2s var(--ease-out-quart), box-shadow 0.2s var(--ease-out-quart);
        }
        .kitcard:hover { transform: translateY(-3px); box-shadow: var(--shadow-lift); }
        .kitcard-preview {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #070708;
        }
        .kitcard-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgb(0 0 0 / 0.5));
        }
        .kitcard-swatches {
          position: absolute; left: 14px; bottom: 14px;
          display: flex; gap: 7px;
        }
        .kitcard-swatches span {
          width: 18px; height: 18px; border-radius: 50%;
          box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.3), 0 1px 3px rgb(0 0 0 / 0.4);
        }
        .kitcard-info { display: flex; flex-direction: column; gap: 7px; padding: 16px 18px 18px; }
        .kitcard-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .kitcard-head h3 { font-size: 1.15rem; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
        .kitcard-price {
          font-size: 0.85rem; font-weight: 700;
          padding: 2px 10px; border-radius: var(--radius-full);
          background: var(--surface-2); color: var(--ink);
        }
        .kitcard-info p { margin: 0; font-size: 0.92rem; color: var(--muted); line-height: 1.5; }
        .kitcard-cta {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 4px;
          font-size: 0.9rem; font-weight: 600; color: var(--primary);
        }
        .kitcard:hover .kitcard-cta { gap: 9px; }
        @media (prefers-reduced-motion: reduce) {
          .kitcard, .kitcard-cta { transition: none; }
        }
      `}</style>
    </Link>
  );
}
