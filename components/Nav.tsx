import { site } from "@/lib/site";
import { GitHubIcon } from "./icons";
import { SurpriseButton } from "./SurpriseButton";
import { CommandTrigger } from "./CommandTrigger";

export function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="nav__brand" href="#top" aria-label={`${site.name} home`}>
          <span className="nav__chip" aria-hidden />
          <span className="nav__word">{site.name}</span>
        </a>
        <div className="nav__actions">
          <CommandTrigger />
          <SurpriseButton />
          <a
            className="nav__icon"
            href={site.github}
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
          >
            <GitHubIcon size={20} />
          </a>
        </div>
      </div>
      <style>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 20;
          background: var(--chrome-surface);
          -webkit-backdrop-filter: saturate(1.4) blur(12px);
          backdrop-filter: saturate(1.4) blur(12px);
          border-bottom: 1px solid var(--chrome-border);
          color: var(--chrome-ink);
        }
        .nav__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.75rem clamp(1rem, 4vw, 2rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .nav__brand {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          text-decoration: none;
          color: inherit;
        }
        .nav__chip {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          box-shadow: var(--shadow-card);
        }
        .nav__word {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.03em;
        }
        .nav__actions {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav__icon {
          display: inline-grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          color: var(--chrome-ink);
          transition: background 0.18s var(--ease-out-quart);
        }
        .nav__icon:hover { background: var(--chrome-surface); }
        @media (prefers-reduced-motion: reduce) {
          .nav__icon { transition: none; }
        }
      `}</style>
    </header>
  );
}
