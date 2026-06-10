import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Hero />
      <Gallery />
      <footer className="footer">
        <p>
          Open source and free to use.{" "}
          <a href={site.github} target="_blank" rel="noreferrer">
            Contribute a background on GitHub
          </a>
          .
        </p>
        <style>{`
          .footer {
            max-width: 1200px;
            margin: 0 auto;
            padding: clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem);
            text-align: center;
            color: var(--chrome-muted);
            font-size: 0.9rem;
          }
          .footer a {
            color: var(--chrome-ink);
            font-weight: 600;
            text-decoration: underline;
            text-underline-offset: 3px;
            text-decoration-color: var(--chrome-border);
          }
          .footer a:hover { text-decoration-color: currentColor; }
        `}</style>
      </footer>
    </>
  );
}
