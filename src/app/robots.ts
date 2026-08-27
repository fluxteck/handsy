import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config";

/**
 * robots.txt, generated so the `sitemap:` line resolves from the same origin
 * helper as the sitemap itself.
 *
 * This replaces a static `public/robots.txt` that hardcoded a placeholder
 * domain, which pointed crawlers at a sitemap on a host that does not exist.
 * The two files must agree on the origin, so they now share one source.
 *
 * Disallows mirror the static file exactly: per-visitor and transactional
 * routes only. Nothing in the catalogue is blocked.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      disallow: ["/downloads/", "/account/", "/cart", "/checkout", "/wishlist", "/compare"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
