import type { Category } from "@commercekitsdk/core";
import type { CategoryType } from "@/db/categoriesData";
import { safeImageUrl } from "../images";

/**
 * SDK `Category` → the template's `CategoryType`, so `homeCategory.tsx` keeps
 * its markup unchanged.
 */

/**
 * Categories in the catalog may have no `imageUrl` set yet. The circular
 * category tiles are the loudest element on that row, so rather than render a
 * hole we cycle the template's own artwork by index — deterministic, so a
 * given category keeps the same image between renders.
 */
const FALLBACK_IMAGES = [
  "/images/home-1/category/img-1.webp",
  "/images/home-1/category/img-2.webp",
  "/images/home-1/category/img-3.webp",
  "/images/home-1/category/img-4.webp",
  "/images/home-1/category/img-5.webp",
];

export function toCategoryType(category: Category, index: number): CategoryType {
  return {
    id: category.id,
    categoryName: category.name,
    categoryImg: safeImageUrl(
      category.imageUrl,
      FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]!,
    ),
    value: category.slug,
  };
}

export function toCategoryTypes(categories: Category[]): CategoryType[] {
  return categories.map(toCategoryType);
}
