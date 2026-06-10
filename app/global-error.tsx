"use client"; // Error boundaries must be Client Components

/**
 * Root-level error boundary. Replaces the whole document (so it must render its
 * own <html>/<body>) when an error escapes the root layout. Kept intentionally
 * plain — it can't rely on app chrome, fonts, or the background provider.
 */
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#fafaf9",
          color: "#1c1917",
        }}
      >
        <main style={{ textAlign: "center", padding: "2rem", maxWidth: "30rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#78716c", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
            An unexpected error interrupted the page. You can try again.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "999px",
              border: "none",
              background: "#1c1917",
              color: "#fafaf9",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
