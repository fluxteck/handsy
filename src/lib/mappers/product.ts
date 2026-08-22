import type { Money, Product, Variant } from "@commercekitsdk/core";
import type { ProductType } from "@/types/productType";
import { safeImageUrl } from "../images";

/**
 * SDK `Product` → the template's `ProductType`.
 *
 * This mapper is the reason no presentation component had to change. The
 * template's cards, sliders and grids all speak `ProductType`; the server
 * speaks the SDK's normalized `Product` (variants, `Money` in minor units,
 * `compareAtPrice`). Translating once here means `card.tsx`, `topCollections`
 * and friends keep their markup, classes and props exactly as shipped.
 *
 * Fields the SDK has no equivalent for (`brand`, `label`, `category`,
 * `filter`) resolve to empty strings — the components already treat those as
 * optional and skip the corresponding badge when falsy.
 */

/** Carries the slug alongside the template shape so links can be made real
 *  once the PDP route exists. Assignable anywhere `ProductType` is expected. */
export type HomeProduct = ProductType & { slug: string; variantId?: string };

/**
 * Local stand-ins for products whose imagery is missing or points at a host
 * `next/image` isn't configured for — the seed catalog uses `cdn.example`,
 * which resolves to nothing. Cycled by position so a grid of placeholder
 * products doesn't render as the same picture repeated.
 */
const FALLBACK_IMAGES = [
  "/images/home-1/top-collections/img-1.webp",
  "/images/home-1/top-collections/img-2.webp",
  "/images/home-1/top-collections/img-3.webp",
  "/images/home-1/top-collections/img-4.webp",
];

/**
 * Minor units → major. `Money.amount` is an integer in the currency's minor
 * unit (1099 === $10.99). Two decimal places covers USD and INR; a zero-decimal
 * currency like JPY would need its own exponent here.
 */
function toMajor(money: Money | undefined): number {
  if (!money) return 0;
  return money.amount / 100;
}

/** The variant a listing card represents: the cheapest one, matching the
 *  server's own `priceFrom` denormalization. */
function cheapestVariant(product: Product): Variant | undefined {
  if (product.variants.length === 0) return undefined;
  return product.variants.reduce((lowest, v) =>
    v.price.amount < lowest.price.amount ? v : lowest,
  );
}

/**
 * `2400` → `"2.4k"`. The template prints this string verbatim next to the
 * star rating.
 */
function formatReviewCount(count: number | undefined): string {
  if (!count || count <= 0) return "0";
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}k`;
}

/**
 * @param index  Position in its list, used to vary the placeholder image.
 * @param filter Tab this product belongs to. `featuredProducts.tsx` groups its
 *               tabs by matching this against the tab label, so the value has
 *               to be the label verbatim ("Best Sellers", "New arrivals",
 *               "featured"). Supplying it here is what lets that component and
 *               `ProductCarousel` stay exactly as written.
 */
export function toProductType(product: Product, index = 0, filter = ""): HomeProduct {
  const fallbackImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]!;
  const variant = cheapestVariant(product);
  const selling = variant?.price ?? product.priceFrom;
  const compareAt = variant?.compareAtPrice;

  /*
   * `CardPriceEnhanced` derives what it displays: it strikes through `price`
   * and shows `price - price * discountPercentage / 100` as the live figure.
   * So when a variant is on offer we must hand it the ORIGINAL price plus the
   * percentage off — handing it the selling price would discount an already
   * discounted number. With no `compareAtPrice`, the percentage is 0 and the
   * card renders the single price with no strike-through and no badge.
   */
  const onOffer = Boolean(compareAt && compareAt.amount > selling.amount);
  const price = onOffer ? toMajor(compareAt) : toMajor(selling);
  const discountPercentage = onOffer
    ? Math.round((1 - selling.amount / compareAt!.amount) * 100)
    : 0;

  return {
    id: product.id,
    slug: product.slug,
    // The variant the displayed price belongs to — carried so a card's
    // add-to-cart has something the server's cart can key on.
    ...(variant ? { variantId: String(variant.id) } : {}),
    title: product.title,
    description: product.description,
    price,
    currency: selling.currency,
    discountPercentage,
    rating: product.rating ?? 0,
    totalRating: formatReviewCount(product.reviewCount),
    stock: product.variants.reduce((sum, v) => sum + (v.available ?? 0), 0),
    // No SDK counterpart. The components skip these badges when falsy.
    brand: "",
    label: "",
    category: "",
    filter,
    thumbnail: safeImageUrl(product.images[0]?.url, fallbackImage),
    // Unrenderable entries are dropped rather than replaced — the gallery is
    // better short than padded with the same placeholder repeated.
    images: product.images
      .map((image) => image.url)
      .filter((url) => safeImageUrl(url, "") !== ""),
    // `Variant.options` carries option *values* ("Walnut"), not swatch hexes —
    // the server's `swatch_hex` isn't part of the core `Variant` contract. The
    // homepage cards don't render `CardColors`, and `CardIcons` reads this
    // defensively, so an empty list is safe.
    colors: [],
  };
}

export function toProductTypes(products: Product[], filter = ""): HomeProduct[] {
  return products.map((product, index) => toProductType(product, index, filter));
}

/** Everything the product-detail page's components need, in their own prop shapes. */
export interface ProductDetailView {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  discountPercentage: number;
  stock: number;
  thumbnail: string;
  images: string[];
  /** One entry per variant — see the note on `code` below. */
  colors: Array<{ code: string; label: string; image: string }>;
  /** Spec rows built from the product's metadata bag. */
  additionalInfo: Array<{ label: string; value: string }>;
  categoryIds: string[];
}

/** `{ woodType: "walnut" }` → `"Wood Type"`. */
function humanizeKey(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function toProductDetail(product: Product): ProductDetailView {
  const base = toProductType(product);

  /*
   * The colour picker renders each entry as an <Image>, using `code` only as a
   * React key and for equality when highlighting the selection — it never
   * treats it as a CSS colour. That's what lets variants drive this control
   * without a swatch hex: the variant id is a perfectly good identity, and the
   * variant title ("Walnut / Natural Oil") is a better label than a colour name.
   *
   * Variants without their own imagery fall back to the product's primary
   * image, so every swatch renders something.
   */
  const colors = product.variants.map((variant) => ({
    code: String(variant.id),
    label:
      variant.title ||
      Object.values(variant.options ?? {}).join(" / ") ||
      "Default",
    image: safeImageUrl(
      variant.imageUrls?.[0] ?? variant.imageUrl,
      base.thumbnail,
    ),
  }));

  const additionalInfo = Object.entries(product.metadata ?? {})
    .filter(([, value]) => value !== null && value !== "")
    .map(([key, value]) => ({ label: humanizeKey(key), value: String(value) }));

  return {
    id: String(product.id),
    slug: product.slug,
    title: base.title,
    description: base.description,
    price: base.price,
    currency: base.currency,
    discountPercentage: base.discountPercentage,
    stock: base.stock,
    thumbnail: base.thumbnail,
    // Fall back to the single thumbnail so the gallery is never handed an
    // empty array, which would render a blank frame with dead arrows.
    images: base.images.length > 0 ? base.images : [base.thumbnail],
    colors,
    additionalInfo,
    categoryIds: product.categoryIds.map(String),
  };
}
