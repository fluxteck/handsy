import type { Brand } from "@commercekitsdk/core";
import type { VendorType } from "@/types/vendorType";
import { safeImageUrl } from "../images";

/**
 * SDK `Brand` → the template's `VendorType`.
 *
 * Handsy's "vendor" pages are maker storefronts, and the maker *is* the brand a
 * product is attributed to — so they are backed by `brands`, which already owns
 * that attribution through `products.brand_id`. The server's `vendors` table is
 * a different thing entirely (a supplier record holding payment terms and bank
 * details) and is deliberately not exposed here.
 *
 * Every storefront field is optional on a `Brand`, because a store may use
 * brands purely as a catalogue filter. Each one therefore falls back to
 * something presentable rather than rendering "undefined".
 */

const FALLBACK_LOGO = "/images/home-1/top-collections/img-1.webp";
const FALLBACK_COVER = "/images/home-1/hero/hero-img.webp";

/** "1.2k" reads better than "1200" in the review-count badge. */
function compactCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(count);
}

export function toVendorType(brand: Brand, categories: string[] = []): VendorType {
  const cover = safeImageUrl(brand.coverImageUrl, FALLBACK_COVER);
  return {
    id: brand.id,
    slug: brand.slug,
    name: brand.name,
    tagline: brand.tagline ?? "",
    logo: safeImageUrl(brand.logoUrl, FALLBACK_LOGO),
    coverImage: cover,
    // The about section reuses the cover when no dedicated image is set, which
    // keeps the layout intact instead of leaving a hole.
    aboutImage: safeImageUrl(brand.aboutImageUrl, cover),
    location: brand.location ?? "",
    rating: brand.rating ?? 0,
    totalReviews: compactCount(brand.reviewCount ?? 0),
    // 0 is falsy but also not a year; the component renders "since {n}" only
    // when truthy, so this stays 0 rather than inventing a date.
    sellingSince: brand.sellingSince ?? 0,
    isVerified: Boolean(brand.isVerified),
    responseTime: brand.responseTime ?? "",
    description: brand.description ?? "",
    highlights: brand.highlights ?? [],
    social: {
      ...(brand.social?.instagram ? { instagram: brand.social.instagram } : {}),
      ...(brand.social?.facebook ? { facebook: brand.social.facebook } : {}),
      ...(brand.social?.twitter ? { twitter: brand.social.twitter } : {}),
    },
    /* Derived from the maker's own products rather than stored: the filter
       pills must match what is actually listed below them. */
    categories,
  };
}
