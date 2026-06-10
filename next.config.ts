import type { NextConfig } from "next";

// Security headers applied to every response. This is a static site with no
// user input, so the goal is defense-in-depth (clickjacking, MIME-sniffing,
// referrer leakage, transport), not blocking an injection vector that exists.
//
// The CSP is deliberately the "safe subset": frame-ancestors / base-uri /
// object-src harden without a script-src/style-src that would break Next's
// inline hydration scripts and the page's inline <style> blocks (those would
// require nonces). Add script-src/style-src with a nonce only if dynamic,
// user-influenced content is ever introduced.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  },
];

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Next infer the wrong
  // workspace root. Pin it to this project so build/start trace the right files.
  turbopack: {
    root: import.meta.dirname,
  },
  outputFileTracingRoot: import.meta.dirname,
  // The local audit/screenshot scripts hit the dev server over 127.0.0.1, which
  // Next 16 treats as a cross-origin dev request and blocks by default (kills HMR).
  allowedDevOrigins: ["127.0.0.1"],
  // Drop the `X-Powered-By: Next.js` header — no functional value, just tech
  // fingerprinting that helps target version-specific exploits.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
