import { getHomeCategories } from "@/lib/sdk";

/**
 * A category rendered as navigation.
 *
 * Several client components — the search placeholder rotation, the empty-cart
 * and empty-shop suggestions — offer the shopper a list of categories to jump
 * to. They cannot read the catalogue themselves, so a server ancestor resolves
 * this and passes it down.
 */
export interface CategoryLink {
  label: string;
  href: string;
}

/**
 * The catalogue's categories, as navigation links.
 *
 * These surfaces previously read `menuList` from `src/db` directly, which is
 * the purchased template's editorial menu: it advertises Furniture, Mattresses
 * and Modular, none of which exist in this catalogue. Every such link led to a
 * category page matching nothing.
 *
 * Fails soft to an empty list, in which case callers render no suggestions
 * rather than dead ones.
 */
export async function getCategoryLinks(): Promise<CategoryLink[]> {
  const categories = await getHomeCategories();
  return categories
    .filter((category) => Boolean(category.value))
    .map((category) => ({
      label: category.categoryName,
      href: `/category/${category.value}`,
    }));
}
