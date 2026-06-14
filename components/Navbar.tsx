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
        <span className="nav__word">{site.name}</span>
        <span className="nav__dot" aria-hidden />
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
          gap: 0.42rem;
          text-decoration: none;
          color: inherit;
        }
       
        .nav__word {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 1.02rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          /* uppercase tracking adds space on the right; pad left so the word
             stays optically centred against the bead */
          padding-left: 0.22em;
        }
        .nav__dot {
          flex: none;
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          /* the one spot of colour on the page: an iridescent peacock / Pavo
             bead (green -> cyan -> indigo -> violet, like the aurora exhibits) */
          background:
            radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0) 46%),
            conic-gradient(from 200deg, #3bef8a, #23e0d2, #5b7bff, #d65cff, #3bef8a);
          box-shadow: 0 0 0 1px rgba(10, 10, 10, 0.06), 0 1px 3px rgba(10, 10, 10, 0.18);
          transition: transform 0.2s var(--ease-out-quart);
        }
        .nav__home:hover .nav__dot {
          transform: scale(1.15);
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
          .nav__github,
          .nav__dot {
            transition: none;
          }
        }
      `}</style>
    </header>
  );
}
