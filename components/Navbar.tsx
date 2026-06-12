import { site } from "@/lib/site";
import { GitHubIcon } from "./icons";

/**
 * Invisible top navbar: no surface, no border, just the brand and links
 * sitting directly on the page background.
 */
export function Navbar() {
  return (
    <header className="nav">
      <a className="nav__home" href="#top">
        <span className="nav__chip" aria-hidden />
        <span className="nav__word">{site.name}</span>
      </a>
      <nav className="nav__links" aria-label="Site">
        <a className="nav__link" href="#about">
          About us
        </a>
        <a
          className="nav__github"
          href={site.github}
          target="_blank"
          rel="noreferrer"
          aria-label="View source on GitHub"
        >
          <GitHubIcon size={20} />
        </a>
      </nav>
      <style>{`
        .nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(1.25rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem) 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          color: var(--chrome-ink);
        }
        .nav__home {
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
        .nav__links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav__link {
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-full);
          color: var(--chrome-muted);
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.18s var(--ease-out-quart),
            background 0.18s var(--ease-out-quart);
        }
        .nav__link:hover {
          color: var(--chrome-ink);
          background: var(--chrome-surface);
        }
        .nav__github {
          display: inline-grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          color: var(--chrome-ink);
          transition: background 0.18s var(--ease-out-quart);
        }
        .nav__github:hover {
          background: var(--chrome-surface);
        }
        @media (prefers-reduced-motion: reduce) {
          .nav__link,
          .nav__github {
            transition: none;
          }
        }
      `}</style>
    </header>
  );
}
