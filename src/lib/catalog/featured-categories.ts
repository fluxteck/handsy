/**
 * The curated category strip shown on the homepage and on /shop.
 *
 * The catalogue holds 36 categories, most of them empty children. Rendering
 * all of them made the strip a wall of near-identical circles with nothing
 * behind most of them, so what appears here is an explicit editorial choice
 * rather than "whatever the API returned".
 *
 * Each entry names a catalogue **slug**, not a display name — the slug is what
 * `getCatalogPage` resolves a filter against, and it survives a rename in the
 * admin. `label` is free to differ from the category's stored name (the
 * catalogue calls it "Kitchen & Dining"; the strip says "Kitchen").
 *
 * An entry whose slug is not in the catalogue is dropped rather than rendered,
 * because an unresolvable filter silently falls back to showing *every*
 * product — a tile that quietly lies is worse than a tile that isn't there.
 * Add the category in the admin and its tile appears on the next revalidation.
 */
export interface FeaturedCategory {
  /** Text on the tile. May differ from the category's name in the catalogue. */
  label: string;
  /**
   * Catalogue slug to filter by. Omitted for a tile that is not a category at
   * all — "Bestsellers" is a sort order, so it carries an `href` instead.
   */
  slug?: string;
  /** Destination for tiles that aren't a category filter. */
  href?: string;
  /**
   * Shown when the category has no `imageUrl` set in the admin. A real image
   * uploaded against the category always wins over this.
   */
  fallbackImage: string;
}

export const FEATURED_CATEGORIES: readonly FeaturedCategory[] = [
  {
    label: "Bestsellers",
    // Not a category: the same "rating, descending" the Best Sellers rails use,
    // so one definition of "bestselling" holds across the whole storefront.
    href: "/shop?sort=popularity",
    fallbackImage: "/images/category/img-1.webp",
  },
  { label: "Lighting", slug: "lighting", fallbackImage: "/images/category/img-2.webp" },
  { label: "Furniture", slug: "furniture", fallbackImage: "/images/category/img-3.webp" },
  { label: "Kitchen", slug: "kitchen-dining", fallbackImage: "/images/category/img-4.webp" },
  { label: "Tabletop Decor", slug: "tabletop-decor", fallbackImage: "/images/category/img-5.webp" },
  { label: "Wall Hanging", slug: "wall-hanging", fallbackImage: "/images/category/img-6.webp" },
];
