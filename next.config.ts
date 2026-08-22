import type { NextConfig } from "next";
import path from "node:path";
import bundleAnalyzer from '@next/bundle-analyzer';

/**
 * The `@commercekitsdk/*` packages are linked from the sibling `ecommerce-sdk`
 * checkout (`file:` deps → symlinks in node_modules) so we can debug against
 * SDK source during development. `outputFileTracingRoot` is widened to the
 * directory holding both checkouts so the build traces files through those
 * symlinks. Switch back to published npm versions and this can go away.
 *
 * (A `turbopack.root` was here too; Next 15.3.6 rejects it as an unrecognized
 * key and warns on every boot, and resolution works without it.)
 */
const workspaceRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,
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