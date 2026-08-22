import type { NextConfig } from "next";
import path from "node:path";
import bundleAnalyzer from '@next/bundle-analyzer';

/**
 * `outputFileTracingRoot` is only needed when the `@commercekitsdk/*` packages
 * are symlinked from a sibling `ecommerce-sdk` checkout for local debugging:
 * without a wider root the bundler will not follow a symlink that escapes the
 * project directory.
 *
 * It must NOT be set on Vercel. There the project is checked out at
 * `/vercel/path0`, so `../..` resolves to `/`, and the build then computes
 * `.next`'s location relative to that root and re-joins it onto the project
 * directory — producing `/vercel/path0/vercel/path0/.next` and failing the
 * deploy with a missing `routes-manifest-deterministic.json`, *after* a
 * successful build.
 *
 * The packages now come from npm, so this is dormant; the guard keeps local
 * symlink debugging available without breaking deploys.
 */
const workspaceRoot = path.resolve(__dirname, "../..");
const tracingRoot = process.env.VERCEL ? {} : { outputFileTracingRoot: workspaceRoot };

const nextConfig: NextConfig = {
  ...tracingRoot,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.dummyjson.com",
        port: "",
        pathname: "/**",
      },
      // Supabase Storage, when the server serves media via
      // @commercekitsdk/media-supabase. Keep this list in sync with
      // ALLOWED_HOSTS in src/lib/images.ts.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  experimental: {
    // missingSuspenseWithCSRBailout: false,
    optimizePackageImports: [
      "lucide-react",
      "@/lib/icon",
      "@/components/ui",
      "@/components/sections",
    ],
  },
  compiler: {
    /*
     * Strip console noise in production, but KEEP `console.error` and
     * `console.warn`. The template stripped all of it, which also removed the
     * `[handsy:sdk]` / `[handsy:catalog]` diagnostics — so a failed catalogue
     * read left no trace in production logs, exactly where it matters most
     * (Next replaces RSC errors with an opaque digest, and those log lines are
     * the only thing that identifies the failing URL and status).
     */
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};


const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);