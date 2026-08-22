import type { ProductType } from "@/types/productType";

/**
 * Where a product card should link.
 *
 * Catalog-backed products carry a slug and route to the dynamic detail page.
 * The static sample data (still behind the header mega-menu, search popup and
 * the shop pages) has no slug, so those keep pointing at the original
 * `/product-details` page — linking them to `/product-details/undefined` would
 * 404. Both paths stay valid until every surface is on the catalog.
 */
export function productPath(product: Pick<ProductType, "slug">): string {
  return product.slug ? `/product-details/${product.slug}` : "/product-details";
}
