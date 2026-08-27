import type { ProductType } from "@/types/productType";

/**
 * Where a product card should link.
 *
 * Catalogue-backed products carry a slug and route to the dynamic detail page.
 * Anything without one falls back to the shop listing rather than a product
 * URL: `/product-details/undefined` would 404, and the old bare
 * `/product-details` page it used to fall back to was template demo content
 * hardcoded to a single sample product, so it has been removed. Every product
 * surface is now catalogue-backed, which means this fallback should be
 * unreachable — it exists so a future slugless source degrades to a browsable
 * page instead of a dead end.
 */
export function productPath(product: Pick<ProductType, "slug">): string {
  return product.slug ? `/product-details/${product.slug}` : "/shop";
}
