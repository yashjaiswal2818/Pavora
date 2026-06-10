import { backgrounds } from "@/backgrounds";

export function Hero() {
  const count = backgrounds.length;
  return (
    <section className="hero" id="top">
      <h1 className="hero__title">Beautiful backgrounds, ready to paste.</h1>
      <p className="hero__sub">
        A free, open-source collection of CSS and JS backgrounds. Click any one to
        try it across the whole page, then copy the code.
      </p>
      <div className="hero__meta">
        <span className="hero__pill">
          {count} background{count === 1 ? "" : "s"}
        </span>
        <span className="hero__pill">MIT licensed</span>
        <span className="hero__pill">No sign-up</span>
      </div>
      <style>{`
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(3rem, 9vw, 6rem) clamp(1rem, 4vw, 2rem) 0;
          text-align: center;
          color: var(--chrome-ink);
        }
        .hero__title {
          font-size: clamp(2.25rem, 6vw, 4rem);
          line-height: 1.04;
          max-width: 16ch;
          margin: 0 auto;
        }
        .hero__sub {
          margin: 1.1rem auto 0;
          max-width: 52ch;
          font-size: clamp(1rem, 2vw, 1.15rem);
          line-height: 1.55;
          color: var(--chrome-muted);
        }
        .hero__meta {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.6rem;
        }
        .hero__pill {
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-full);
          background: var(--chrome-surface);
          border: 1px solid var(--chrome-border);
          color: var(--chrome-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
