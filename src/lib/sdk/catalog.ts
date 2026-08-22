import { cache } from "react";
import {
  isCommerceError,
  type AdapterContext,
  type Brand,
  type ProductFilters,
} from "@commercekitsdk/core";
import type { CategoryType } from "@/db/categoriesData";
import type { ReviewType } from "@/types/reviewType";
import { getEnv } from "../config";
import { toCategoryTypes } from "../mappers/category";
import {
  toProductDetail,
  toProductTypes,
  type HomeProduct,
  type ProductDetailView,
} from "../mappers/product";
import { toReviewTypes } from "../mappers/review";
import { toProductFilters, type CatalogQuery } from "../catalog/filters";
import { getStorefrontClient } from "./client";

/**
 * Server-backed catalog reads for the homepage.
 *
 * Deliberately separate from `src/lib/data.ts`: that module's
 * `getProductsData()` still feeds the header, mega-menu, search popup and the
 * inner pages, all of which are out of scope for this phase. Adding new
 * functions here rather than rewriting that one keeps the change confined to
 * the homepage.
 *
 * Every function fails soft. A section rendering empty is a far better outcome
 * than a 500 on the whole page when the server is down or mid-deploy, so the
 * error is logged and an empty list returned. `react.cache` dedupes within a
 * single render pass.
 */

/** `client.categories` isn't sugar-wrapped on `CommerceClient`, so category
 *  reads go through the raw adapter and need a context built by hand. */
function ctx(): AdapterContext {
  return { currency: getEnv().NEXT_PUBLIC_CURRENCY, locale: "en-US" };
}

export const getHomeCategories = cache(async (): Promise<CategoryType[]> => {
  try {
    const categories = await getStorefrontClient().adapter.categories!.list(ctx());
    return toCategoryTypes(categories);
  } catch (err) {
    console.error("[handsy:home] categories failed to load", err);
    return [];
  }
});

/** Shared list helper — one place for the fail-soft behaviour. `filter` is
 *  stamped onto each product so the Featured Products tabs can group them. */
async function listProducts(
  label: string,
  filters: ProductFilters,
  filter = "",
): Promise<HomeProduct[]> {
  try {
    const { items } = await getStorefrontClient().products.list(filters);
    return toProductTypes(items, filter);
  } catch (err) {
    console.error(`[handsy:home] ${label} failed to load`, err);
    return [];
  }
}

/** Top Collections rail — newest first, enough to fill the 5.35-per-view swiper. */
export const getTopCollections = cache(async (): Promise<HomeProduct[]> => {
  return listProducts("top collections", {
    sortBy: "createdAt",
    sortDirection: "desc",
    limit: 12,
  });
});

/**
 * Featured Products — the three tabs, flattened into the single array
 * `featuredProducts.tsx` expects.
 *
 * That component groups by `prd.filter === <tab label>`, so each product is
 * stamped with its tab label and the results concatenated. Returning the shape
 * the existing component already consumes means neither it nor
 * `ProductCarousel` needs a single line changed.
 *
 * Where the static catalog had someone type `filter: "Best Sellers"` into a
 * JSON file, each tab is now a real query — best sellers are genuinely the
 * top-rated rows. Fetched concurrently; the tabs are independent.
 *
 * A product qualifying for two tabs appears once per tab, which is correct:
 * each tab renders its own carousel, so keys stay unique within a subtree.
 */
export const getFeaturedProducts = cache(async (): Promise<HomeProduct[]> => {
  const [bestSellers, newArrivals, featured] = await Promise.all([
    listProducts(
      "best sellers",
      { sortBy: "rating", sortDirection: "desc", limit: 8 },
      "Best Sellers",
    ),
    listProducts(
      "new arrivals",
      { sortBy: "createdAt", sortDirection: "desc", limit: 8 },
      "New arrivals",
    ),
    listProducts("featured", { tags: ["featured"], limit: 8 }, "featured"),
  ]);

  return [...bestSellers, ...newArrivals, ...featured];
});

// ── Product detail ───────────────────────────────────────────────────────

/**
 * One product by slug (the server resolves id-or-slug on the same route).
 *
 * Returns null when the product doesn't exist or is unpublished — the server's
 * public guards hide drafts, which surfaces as `not_found`. The caller turns
 * that into Next's `notFound()`. Unlike the list helpers this does NOT swallow
 * other failures: a page that can't load its subject should error rather than
 * render a product-shaped hole.
 */
export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetailView | null> => {
    try {
      return toProductDetail(await getStorefrontClient().products.get(slug));
    } catch (err) {
      if (isCommerceError(err) && err.code === "not_found") return null;
      throw err;
    }
  },
);

/**
 * Products to show alongside this one. The server has a dedicated
 * `/products/:id/related` endpoint, but `adapter-rest` exposes no operation for
 * it, so we approximate with the product's primary category and drop the
 * product itself from the result. Fails soft — a missing rail is far better
 * than a dead product page.
 */
export const getRelatedProducts = cache(
  async (productId: string, categoryId?: string): Promise<HomeProduct[]> => {
    const filters: ProductFilters = { limit: 8 };
    if (categoryId) filters.categoryId = categoryId;
    const items = await listProducts("related products", filters);
    return items.filter((p) => String(p.id) !== productId).slice(0, 4);
  },
);

/** Top-rated products, for the sidebar's Best Sellers rail. */
export const getTopRatedProducts = cache(
  async (limit = 3): Promise<HomeProduct[]> =>
    listProducts("best sellers rail", {
      sortBy: "rating",
      sortDirection: "desc",
      limit,
    }),
);

/** Published reviews for a product. Fails soft — reviews are supplementary. */
export const getProductReviews = cache(
  async (productId: string): Promise<ReviewType[]> => {
    try {
      const reviews = await getStorefrontClient().adapter.reviews!.list(
        productId,
        ctx(),
      );
      return toReviewTypes(reviews.items);
    } catch (err) {
      console.error("[handsy:pdp] reviews failed to load", err);
      return [];
    }
  },
);

// ── Listing / collection page ────────────────────────────────────────────

export interface CatalogPage {
  items: HomeProduct[];
  /**
   * True when the product query itself failed (backend down, slow enough to
   * trip the fetch timeout, …). Distinct from an empty result set: "nothing
   * matches your filters" and "we couldn't reach the catalogue" need different
   * messages, and conflating them tells the shopper to widen filters that were
   * never the problem.
   */
  failed: boolean;
  /** Total matching products, for the pager. */
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** Facet data for the sidebar, derived from the live catalogue. */
  categories: CategoryType[];
  tags: string[];
  /** Price bounds across the whole catalogue, in major units. */
  priceBounds: { min: number; max: number };
}

/**
 * Everything the listing page renders, in one call.
 *
 * `products.search` is used when there's a query and `products.list` otherwise
 * — the search route runs full-text matching server-side, which a client-side
 * filter over one page of results could never do correctly.
 *
 * Facets (categories, tags, price bounds) are derived from a separate
 * unfiltered read so the sidebar keeps offering the full set of choices rather
 * than narrowing to whatever the current filter already matched — a sidebar
 * that removes the option you just deselected is a trap.
 */
export const getCatalogPage = cache(
  async (query: CatalogQuery): Promise<CatalogPage> => {
    const client = getStorefrontClient();

    /*
     * Latency discipline. Each catalogue query is a round trip to the
     * database, so anything that can overlap must. Only the category branch
     * genuinely has to wait — the API filters by id, so the slug has to be
     * resolved before the product query can be built. With no category
     * selected (the common case) all three reads go out together, turning
     * three sequential round trips into one.
     */
    const categoriesPromise = getHomeCategories();
    const facetsPromise = getCatalogFacets();

    let categoryId: string | undefined;
    if (query.category) {
      const resolved = (await categoriesPromise).find((c) => c.value === query.category);
      categoryId = resolved ? String(resolved.id) : undefined;
    }

    const filters = toProductFilters(query, categoryId);

    const productsPromise = (async () => {
      try {
        const result = query.q
          ? await client.products.search({ ...filters, query: query.q })
          : await client.products.list(filters);
        return {
          items: toProductTypes(result.items),
          total: result.total ?? result.items.length,
          failed: false,
        };
      } catch (err) {
        console.error("[handsy:catalog] listing failed to load", err);
        return { items: [] as HomeProduct[], total: 0, failed: true };
      }
    })();

    const [products, categories, facets] = await Promise.all([
      productsPromise,
      categoriesPromise,
      facetsPromise,
    ]);
    const { items, total, failed } = products;
    const pageSize = filters.limit ?? items.length ?? 1;

    return {
      items,
      failed,
      total,
      page: query.page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      categories,
      tags: facets.tags,
      priceBounds: facets.priceBounds,
    };
  },
);

/**
 * Tag list and price bounds across the catalogue.
 *
 * The API exposes no facet endpoint through the adapter contract, so this
 * reads a page of products and derives them. `limit` is capped at the server's
 * maximum; on a catalogue larger than that the bounds would be approximate,
 * which is why the slider clamps rather than rejects out-of-range input.
 */
const getCatalogFacets = cache(
  async (): Promise<{ tags: string[]; priceBounds: { min: number; max: number } }> => {
    try {
      const { items } = await getStorefrontClient().products.list({ limit: 100 });
      const tags = [...new Set(items.flatMap((p) => p.tags ?? []))].sort();
      const amounts = items.map((p) => p.priceFrom.amount).filter((a) => a > 0);
      return {
        tags,
        priceBounds: {
          min: 0,
          // Major units, rounded up so the top-priced product is reachable.
          max: amounts.length ? Math.ceil(Math.max(...amounts) / 100) : 0,
        },
      };
    } catch (err) {
      console.error("[handsy:catalog] facets failed to load", err);
      return { tags: [], priceBounds: { min: 0, max: 0 } };
    }
  },
);

/** Category name for the breadcrumb. Null when unknown — the caller omits the crumb. */
export const getCategoryName = cache(
  async (categoryId: string | undefined): Promise<CategoryType | null> => {
    if (!categoryId) return null;
    try {
      const category = await getStorefrontClient().adapter.categories!.get(
        categoryId,
        ctx(),
      );
      return toCategoryTypes([category])[0] ?? null;
    } catch {
      return null;
    }
  },
);

/**
 * Maker (brand) storefronts — the pages served at `/vendor/[vendorName]`.
 *
 * Backed by the SDK's `brands` namespace, which is optional: a store without
 * brand pages simply has no adapter support, so these resolve to null/empty
 * rather than throwing and taking a route down.
 */
export const getVendorBySlug = cache(async (slug: string): Promise<Brand | null> => {
  const brands = getStorefrontClient().adapter.brands;
  if (!brands || !slug) return null;
  try {
    return await brands.get(slug, ctx());
  } catch {
    // Unknown or unpublished maker — the page renders notFound().
    return null;
  }
});

export const getVendorSlugs = cache(async (): Promise<string[]> => {
  const brands = getStorefrontClient().adapter.brands;
  if (!brands) return [];
  try {
    // Only used to pre-render pages at build time, so one page is plenty.
    const page = await brands.list({ limit: 100 }, ctx());
    return page.items.map((brand) => brand.slug);
  } catch {
    return [];
  }
});

/**
 * A maker's products, plus the category labels to build the filter pills.
 *
 * The pills are derived from the products actually listed rather than stored on
 * the brand, so they can never offer a filter that matches nothing.
 */
export const getVendorProducts = cache(
  async (slug: string): Promise<{ products: HomeProduct[]; categories: string[] }> => {
    const brands = getStorefrontClient().adapter.brands;
    if (!brands) return { products: [], categories: [] };
    try {
      const page = await brands.products(slug, { limit: 24 }, ctx());
      const products = toProductTypes(page.items);

      const categoryIds = [...new Set(page.items.flatMap((p) => p.categoryIds ?? []))];
      const names = await Promise.all(categoryIds.map((id) => getCategoryName(id)));
      const categories = names
        .map((category) => category?.categoryName)
        .filter((title): title is string => Boolean(title));

      return { products, categories };
    } catch {
      return { products: [], categories: [] };
    }
  },
);
