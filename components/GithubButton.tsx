import { site } from "@/lib/site";

/**
 * GitHub link with a cube-flip label: the resting face reads "Contribute here",
 * and on hover the whole pill fills with an electric violet→fuchsia glow while
 * the cube rolls to reveal "Give us a star". Adapted from a Uiverse concept
 * (aguerquin) — re-themed to the site's chrome tokens, unified into one pill
 * (no icon divider), and rounded. The flip is orthographic (no perspective) so
 * it clips cleanly inside the rounded corners.
 */
export function GithubButton() {
  return (
    <a
      className="ghx"
      href={site.github}
      target="_blank"
      rel="noreferrer"
      aria-label="Star Pavora on GitHub"
    >
      <span className="ghx__icon" aria-hidden>
        <svg viewBox="0 0 24 24">
          <path
            d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.296997 12 0.296997Z"
            fill="currentColor"
          />
        </svg>
      </span>

      <span className="ghx__flip" aria-hidden>
        <span className="ghx__inner">
          <span className="ghx__face ghx__front">Contribute here</span>
          <span className="ghx__face ghx__top">Give us a star ★</span>
        </span>
      </span>

      <style>{`
        .ghx {
          --ghx-h: 38px;
          display: inline-flex;
          align-items: stretch;
          height: var(--ghx-h);
          border: 1px solid var(--chrome-border);
          border-radius: var(--radius-full);
          overflow: hidden;
          background: var(--chrome-surface);
          color: var(--chrome-ink);
          text-decoration: none;
          transition: background 0.28s var(--ease-out-quart),
            color 0.18s var(--ease-out-quart),
            border-color 0.28s var(--ease-out-quart),
            box-shadow 0.28s var(--ease-out-quart),
            transform 0.18s var(--ease-out-quart);
        }
        .ghx:hover {
          background: oklch(0.17 0.015 256);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 18px oklch(0.21 0.02 256 / 0.32);
        }
        .ghx:active { transform: scale(0.97); }

        /* Icon shares the pill surface — no divider, so the hover fill is
           continuous across the whole button. */
        .ghx__icon {
          display: grid;
          place-items: center;
          width: 38px;
          color: inherit;
        }
        .ghx__icon svg { width: 18px; height: 18px; display: block; }

        .ghx__flip {
          position: relative;
          width: 156px;
          height: 100%;
        }
        .ghx__inner {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transition: transform 0.42s var(--ease-out-expo);
        }
        .ghx:hover .ghx__inner {
          transform: translateZ(calc(var(--ghx-h) / -2)) rotateX(-90deg);
        }

        /* Faces are transparent — colour comes from the pill behind them, so
           icon and label stay one continuous surface through the flip. */
        .ghx__face {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding-right: 6px;
          color: inherit;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          backface-visibility: hidden;
        }
        .ghx__front { transform: translateZ(calc(var(--ghx-h) / 2)); }
        .ghx__top {
          transform: rotateX(90deg) translateZ(calc(var(--ghx-h) / 2));
        }

        @media (prefers-reduced-motion: reduce) {
          .ghx, .ghx__inner { transition: none; }
        }
      `}</style>
    </a>
  );
}
