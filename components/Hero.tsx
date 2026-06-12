import Image from "next/image";
import { backgrounds } from "@/backgrounds";
import { SurpriseButton } from "./SurpriseButton";

export function Hero() {
  const count = backgrounds.length;
  return (
    <section className="hero" id="top">
      <div className="hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title">
            Beautiful backgrounds,
            <br />
            ready to paste.
          </h1>
          <p className="hero__sub">
            A free, open-source collection of CSS and JS backgrounds. Click any
            one to try it across the whole page, then copy the code.
          </p>

          <div className="hero__actions">
            <SurpriseButton />
            <span className="hero__pill">
              {count} background{count === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="hero__art">
          <Image
            src="/hero-art.png"
            alt="A patchwork of hand-painted pastel tiles: brush strokes, arches, dots, and leaves"
            width={1254}
            height={1254}
            priority
          />
        </div>
      </div>

      <style>{`
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem) 0;
          color: var(--chrome-ink);
        }
        .hero__grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          align-items: start;
          gap: clamp(2.5rem, 6vw, 5rem);
        }
        .hero__copy {
          animation: hero-rise 0.7s var(--ease-out-expo) backwards;
        }
        .hero__title {
          font-size: clamp(2rem, 4.3vw, 3.4rem);
          line-height: 1.06;
          margin: 0;
          /* The <br> defines the two lines; balance would re-wrap to three. */
          text-wrap: initial;
        }
        .hero__sub {
          margin: 1.2rem 0 0;
          max-width: 46ch;
          font-size: clamp(1rem, 2vw, 1.15rem);
          line-height: 1.55;
          color: var(--chrome-muted);
        }
        .hero__actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.8rem;
          margin-top: 1.8rem;
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
        .hero__art {
          margin-top: -0.5rem;
          animation: hero-rise 0.7s var(--ease-out-expo) 0.12s backwards;
        }
        .hero__art img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: var(--radius-lg);
          border: 1px solid var(--chrome-border);
          box-shadow: var(--shadow-card);
        }
        @keyframes hero-rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (max-width: 880px) {
          .hero__grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .hero__art {
            max-width: 480px;
            margin-top: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero__copy,
          .hero__art {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
