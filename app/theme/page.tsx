import type { Metadata } from "next";
import { kits } from "@/lib/kits";
import { KitCard } from "@/components/kit/KitCard";

export const metadata: Metadata = {
  title: "Theme kits — Pavora",
  description:
    "Matched shadcn themes for Pavora backgrounds: light + dark tokens, a live full-app demo, and one-paste install. Backgrounds stay free.",
};

export default function ThemeIndexPage() {
  return (
    <section className="kits-page">
      <header className="kits-hero">
        <h1>Theme kits</h1>
        <p>
          The backgrounds are free. A kit pairs one with a matched shadcn theme — light
          and dark tokens, tuned fonts, and a live app you can feel before you buy.
        </p>
      </header>

      <div className="kits-grid">
        {kits.map((kit) => (
          <KitCard key={kit.slug} kit={kit} />
        ))}
      </div>

      <style>{`
        .kits-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: clamp(2.5rem, 7vw, 5rem) clamp(1rem, 4vw, 2rem) 5rem;
        }
        .kits-hero { max-width: 56ch; margin-bottom: clamp(2rem, 5vw, 3rem); }
        .kits-hero h1 {
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 800; letter-spacing: -0.03em; margin: 0 0 0.75rem;
        }
        .kits-hero p {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: var(--muted); line-height: 1.6; margin: 0;
        }
        .kits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: clamp(1.25rem, 3vw, 1.75rem);
        }
      `}</style>
    </section>
  );
}
