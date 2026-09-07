import type { Money, Product, Variant } from "@commercekitsdk/core";
import type { ProductType } from "@/types/productType";
import { safeImageUrl } from "../images";
import { richTextToPlain } from "@/lib/richText";

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
  /* The exact charged figure, carried alongside the percentage.
     The percentage is rounded to a whole number for the badge, so a card
     deriving the price from it lands on a different number whenever the
     discount is not a clean percentage — a flat amount off, or a selling price
     the admin rounded. Passing the real one keeps the card and the cart
     agreeing. */
  const sellingPrice = toMajor(selling);
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
    sellingPrice,
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

/**
 * `{ woodType: "walnut" }` → `"Wood Type"`.
 *
 * The admin namespaces an operator's own metafields with `mf_` so they cannot
 * collide with the fields the form owns. That prefix is bookkeeping, and a row
 * labelled "Mf Bulb Type" would put it on the page — so it comes off here.
 */
function humanizeKey(key: string): string {
  return key
    .replace(/^mf_/, "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}


/*
 * Product metadata carries two different things under one key space: the
 * attributes a shopper reads, and the settings the admin form keeps for
 * itself. Rendering the whole object turned the Specification list into a dump
 * of internals — the SEO title, the raw `optionDefs` JSON, the discount
 * controls — beside the two or three rows anyone actually wanted.
 *
 * The split is a deny-list rather than an allow-list on purpose. Operators add
 * their own attributes, through the form's custom metafields and through the
 * JSON importer, and those keys cannot be known ahead of time; an allow-list
 * would silently swallow exactly the fields someone deliberately added. The
 * internal keys, by contrast, are a closed set — every one is written by
 * `productMeta` in the admin's product-schema, so they can be named here.
 *
 * Anything added to that object in future defaults to visible. That is the
 * safer failure: a stray row on the page is embarrassing and obvious, whereas
 * a missing attribute is invisible until a customer asks about it.
 */
const INTERNAL_METADATA_KEYS = new Set([
  // For search engines, not for the page.
  "seoTitle",
  "seoDescription",
  // Pricing controls. Their effect is already in the price on screen; the
  // inputs behind it are the operator's business, not the shopper's.
  "discountType",
  "discountValue",
  "priceRounding",
  // Inventory behaviour, expressed on the page as stock state.
  "trackQuantity",
  "continueSellingWhenOutOfStock",
  "isPhysical",
  // The variant matrix's source data, already on the page as the option picker.
  "optionDefs",
  // Units, folded into the values they qualify rather than standing alone —
  // a row reading "Dimension Unit: cm" tells nobody anything.
  "weightUnit",
  "dimensionUnit",
  // Internal references: a customs classification and the supplier's slug.
  "hsCode",
  "vendor",
]);

/*
 * Fields the product form offers that this catalogue has no use for.
 *
 * The admin's form carries a set of apparel attributes — how a garment fits,
 * its size chart, how to wash it. This shop sells lighting: chandeliers,
 * pendants, sconces. The fields have no meaning here, and the data proves it
 * rather than the label — the one product that fills `fit` has "Table Lamp" in
 * it, and `careInstructions` holds the words "Care instructions".
 *
 * Held separately from the internal keys above because the reason differs, and
 * the reason is what a future reader needs: those are plumbing that no shop
 * would show, these are real shopper-facing fields that simply belong to a
 * different trade. If this catalogue ever sells something worn, this is the
 * set to empty.
 *
 * The form still offers these inputs, so anything typed into them is stored
 * and simply not shown. Removing the inputs is the other half of this, and it
 * belongs in the admin rather than here.
 */
const FIELDS_NOT_USED_BY_THIS_CATALOGUE = new Set([
  "fit",
  "sizeChart",
  "careInstructions",
]);

/** Held back from the flat list because they are composed into one row. */
const DIMENSION_KEYS = ["dimensionLength", "dimensionWidth", "dimensionHeight"] as const;

/**
 * Order the rows a shopper is most likely to be looking for.
 *
 * Object key order otherwise follows however the admin form happened to build
 * the object, which puts the size chart above the product type for no reason a
 * reader could infer. Keys absent from this list keep their original order and
 * follow — that is where an operator's own attributes land.
 */
const SPEC_ORDER = [
  "productType",
  "fit",
  "material",
  "dimensions",
  "countryOfOrigin",
];

/**
 * `dimensionLength/Width/Height` plus `dimensionUnit` as a single row.
 *
 * Four rows of bare numbers, one of them a unit on its own, is not how anyone
 * writes down the size of a lamp. Partial data still reads correctly: two of
 * the three renders as `32 × 32 cm` rather than inventing a missing side.
 */
function formatDimensions(metadata: Record<string, unknown>): string | null {
  // A zero is the form's empty state, not a measurement — every product that
  // has never had its size entered stores "0" for all three. Rendering those
  // gives "0 × 0 × 0 cm", which reads as a fact about the product rather than
  // as missing data, so they are dropped alongside the blanks.
  const parts = DIMENSION_KEYS.map((key) => metadata[key])
    .map((value) => Number(String(value ?? "").trim()))
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => String(value));

  if (parts.length === 0) return null;

  const unit = metadata.dimensionUnit ? String(metadata.dimensionUnit).trim() : "";
  return unit ? `${parts.join(" × ")} ${unit}` : parts.join(" × ");
}

/**
 * A metadata value as a shopper should read it.
 *
 * Booleans reach the page as the strings `"true"` and `"false"`, which is how
 * the database stores them and not how anyone answers the question "is it
 * dimmable?". Everything else is left exactly as the operator typed it —
 * values like `E27` and `40W` are already correct, and second-guessing them
 * would mangle more than it tidied.
 *
 * Markup is flattened here too: a value written in a rich editor arrives as
 * `<p>23 x 24 cm</p>`, and each row is one `label: value` line with nowhere to
 * put a paragraph.
 */
function formatSpecValue(value: unknown): string {
  const text = richTextToPlain(String(value));
  if (text === "true") return "Yes";
  if (text === "false") return "No";
  return text;
}

/**
 * The Specification rows for a product, from its metadata.
 */
function toSpecifications(
  metadata: Record<string, unknown>,
): Array<{ label: string; value: string }> {
  const dimensions = formatDimensions(metadata);

  const entries = Object.entries(metadata)
    .filter(([key]) => !INTERNAL_METADATA_KEYS.has(key))
    .filter(([key]) => !FIELDS_NOT_USED_BY_THIS_CATALOGUE.has(key))
    .filter(([key]) => !(DIMENSION_KEYS as readonly string[]).includes(key))
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => ({
      key,
      label: humanizeKey(key),
      value: formatSpecValue(value),
    }))
    .filter((entry) => entry.value !== "");

  if (dimensions) {
    entries.push({ key: "dimensions", label: "Dimensions", value: dimensions });
  }

  const rank = (key: string) => {
    const index = SPEC_ORDER.indexOf(key);
    return index === -1 ? SPEC_ORDER.length : index;
  };

  return entries
    .sort((a, b) => rank(a.key) - rank(b.key))
    .map(({ label, value }) => ({ label, value }));
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

  const additionalInfo = toSpecifications(product.metadata ?? {});

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
