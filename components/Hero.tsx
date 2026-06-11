import Image from "next/image";
import { backgrounds } from "@/backgrounds";
import { site } from "@/lib/site";
import { GitHubIcon } from "./icons";
import { SurpriseButton } from "./SurpriseButton";
import { CommandTrigger } from "./CommandTrigger";

export function Hero() {
  const count = backgrounds.length;
  return (
    <section className="hero" id="top">
      <div className="hero__brand">
        <span className="hero__chip" aria-hidden />
        <span className="hero__word">{site.name}</span>
        <a
          className="hero__github"
          href={site.github}
          target="_blank"
          rel="noreferrer"
          aria-label="View source on GitHub"
        >
          <GitHubIcon size={20} />
        </a>
      </div>

      <div className="hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title">Beautiful backgrounds, ready to paste.</h1>
          <p className="hero__sub">
            A free, open-source collection of CSS and JS backgrounds. Click any
            one to try it across the whole page, then copy the code.
          </p>

          <div className="hero__actions">
            <CommandTrigger />
            <SurpriseButton />
          </div>

          <div className="hero__meta">
            <span className="hero__pill">
              {count} background{count === 1 ? "" : "s"}
            </span>
            <span className="hero__pill">MIT licensed</span>
            <span className="hero__pill">No sign-up</span>
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
          padding: clamp(2.5rem, 7vw, 4rem) clamp(1rem, 4vw, 2rem) 0;
          color: var(--chrome-ink);
        }
        .hero__brand {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          margin-bottom: clamp(2.5rem, 6vw, 4rem);
        }
        .hero__chip {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          box-shadow: var(--shadow-card);
        }
        .hero__word {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.03em;
        }
        .hero__github {
          display: inline-grid;
          place-items: center;
          width: 34px;
          height: 34px;
          margin-left: 0.35rem;
          border-radius: var(--radius-full);
          color: var(--chrome-ink);
          transition: background 0.18s var(--ease-out-quart);
        }
        .hero__github:hover { background: var(--chrome-surface); }
        .hero__grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          align-items: center;
          gap: clamp(2.5rem, 6vw, 5rem);
        }
        .hero__copy {
          animation: hero-rise 0.7s var(--ease-out-expo) backwards;
        }
        .hero__title {
          font-size: clamp(2.25rem, 5vw, 3.75rem);
          line-height: 1.04;
          max-width: 14ch;
          margin: 0;
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
          gap: 0.6rem;
          margin-top: 1.8rem;
        }
        .hero__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1.4rem;
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
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero__github { transition: none; }
          .hero__copy,
          .hero__art { animation: none; }
        }
      `}</style>
    </section>
  );
}
