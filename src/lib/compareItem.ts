import type { CompareType } from "@/lib/features/CompareProductsSlice";
import type { ProductType } from "@/types/productType";

/**
 * The snapshot stored when a product is added to the comparison.
 *
 * One builder rather than an object literal at each call site: the two places
 * that add to the comparison were already drifting — one sent a single colour
 * code and a hardcoded `size: "xl"`, the other something else again — so the
 * table could never rely on a field being there.
 *
 * Only attributes a shopper would actually weigh up. Description is left out
 * deliberately: a paragraph per column turns a comparison into a wall of text,
 * which the usability research on comparison tables warns against.
 */
export function toCompareItem(product: ProductType): CompareType {
  return {
    id: product.id,
    ...(product.variantId ? { variantId: product.variantId } : {}),
    ...(product.currency ? { currency: product.currency } : {}),
    price: product.price,
    discountPercentage: product.discountPercentage,
    ...(product.sellingPrice !== undefined ? { sellingPrice: product.sellingPrice } : {}),
    thumbnail: product.thumbnail,
    title: product.title,
    stock: product.stock,
    ...(product.slug ? { slug: product.slug } : {}),
    ...(product.rating ? { rating: product.rating } : {}),
    ...(product.totalRating ? { totalRating: product.totalRating } : {}),
    ...(product.brand ? { brand: product.brand } : {}),
    ...(product.category ? { category: product.category } : {}),
    // Colour codes are what the catalogue carries; the table renders them as
    // swatches rather than printing a hex value at the shopper.
    ...(product.colors?.length
      ? { colors: product.colors.map((c) => c.code).filter(Boolean) }
      : {}),
    ...(product.size?.length ? { sizes: product.size.filter(Boolean) } : {}),
  };
}
