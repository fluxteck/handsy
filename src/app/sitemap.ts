import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config";
import {
  getBrandEntries,
  getCategoryEntries,
  getProductEntries,
  type SitemapEntry,
} from "@/lib/sdk/catalog";

/**
 * The sitemap, generated from the live catalogue.
 *
 * Previously this was a hardcoded list whose categories came from the
 * purchased template's static menu, so it advertised seven categories that do
 * not exist in this store and none of the ones that do — and listed no
 * products or maker pages at all. Everything dynamic now comes from the same
 * SDK reads that render the pages themselves, so the sitemap cannot drift from
 * the catalogue.
 *
 * Marketing and legal pages that genuinely exist as static routes. Excluded by
 * design: anything personal or transactional (`/account/**`, `/cart`,
 * `/checkout`, `/login`, `/wishlist`, `/compare`), which is per-visitor and
 * must not be indexed. The template's leftover demo routes (`/shop-2`,
 * `/blog-3`, `/404-1`, the bare `/product-details`) have been removed from the
 * codebase entirely, so there is nothing left here to exclude.
 */
const STATIC_ROUTES = [
  "",
  "/shop",
  "/category",
  "/about-us",
  "/b2b",
  "/interior-solutions",
  "/vendor",
  "/contact-us",
  "/faq",
  "/privacy-policy",
  "/terms-conditions",
] as const;

/**
 * Relative importance within this site. Google ignores `priority`, but Bing and
 * several other crawlers still read it, and it costs nothing to state honestly:
 * the homepage first, then the listing pages that lead to everything else.
 */
const PRIORITY = {
  home: 1,
  listing: 0.8,
  product: 0.7,
  category: 0.6,
  maker: 0.5,
  page: 0.4,
} as const;

function staticEntry(path: string, generatedAt: Date): MetadataRoute.Sitemap[number] {
  const priority =
    path === "" ? PRIORITY.home : path === "/shop" || path === "/category" ? PRIORITY.listing : PRIORITY.page;
  return {
    url: `${getSiteUrl()}${path}`,
    // Static pages have no tracked modification time; the build is the best
    // available answer and is stable for the life of the deployment.
    lastModified: generatedAt,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority,
  };
}

function catalogEntries(
  prefix: string,
  entries: SitemapEntry[],
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  fallback: Date,
): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return entries.map((entry) => ({
    url: `${siteUrl}${prefix}/${encodeURIComponent(entry.slug)}`,
    lastModified: entry.updatedAt ? new Date(entry.updatedAt) : fallback,
    changeFrequency,
    priority,
  }));
}

/**
 * An upper bound on staleness, not the usual interval.
 *
 * Next renders `sitemap.ts` statically at build time by default, so without
 * this a newly published product would stay invisible to crawlers until the
 * next deploy. In practice the route regenerates every 60s, because Next takes
 * the *minimum* of this value and the revalidate on every fetch made during the
 * render, and each catalogue read carries the shared 60s TTL from
 * `CATALOGUE_REVALIDATE_SECONDS` in `lib/sdk/client.ts` — the build output
 * reports `1m` for this route accordingly.
 *
 * This value therefore only governs the case where no catalogue fetch
 * registered a revalidate at all — i.e. every namespace failed soft and the
 * sitemap fell back to static routes. Without it that degraded sitemap would be
 * cached indefinitely; with it, the next hour repairs itself.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedAt = new Date();

  // Fetched concurrently and independently: each helper already fails soft to
  // an empty list, so one unreachable namespace costs its own URLs rather than
  // the whole sitemap. A sitemap that is missing a section still helps; one
  // that 500s helps nobody.
  const [products, categories, brands] = await Promise.all([
    getProductEntries(),
    getCategoryEntries(),
    getBrandEntries(),
  ]);

  return [
    ...STATIC_ROUTES.map((path) => staticEntry(path, generatedAt)),
    ...catalogEntries("/product-details", products, PRIORITY.product, "weekly", generatedAt),
    ...catalogEntries("/category", categories, PRIORITY.category, "weekly", generatedAt),
    ...catalogEntries("/vendor", brands, PRIORITY.maker, "monthly", generatedAt),
  ];
}
