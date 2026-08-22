import type { ProductFilters } from "@commercekitsdk/core";

/**
 * The listing page's filter state, and its translation to/from the URL.
 *
 * The URL is the single source of truth: filters, sort and page all live in
 * the query string. That makes a filtered view shareable, bookmarkable and
 * back-button correct, and it keeps the page a server component — results are
 * fetched on the server per request rather than refetched in the browser.
 *
 * Prices are held here in MAJOR units (what the shopper sees, e.g. 6999) and
 * converted to the minor units the API expects (699900) only at the boundary.
 */

/** Products per page. The server caps `limit` at 100. */
export const PAGE_SIZE = 12;

/** Sort options, keyed by the value the existing select already renders. */
export const SORT_OPTIONS = {
  default: { sortBy: undefined, sortDirection: undefined },
  popularity: { sortBy: "rating", sortDirection: "desc" },
  average: { sortBy: "rating", sortDirection: "desc" },
  latest: { sortBy: "createdAt", sortDirection: "desc" },
  "low-to-high": { sortBy: "price", sortDirection: "asc" },
  "high-to-low": { sortBy: "price", sortDirection: "desc" },
} as const satisfies Record<
  string,
  { sortBy?: ProductFilters["sortBy"]; sortDirection?: ProductFilters["sortDirection"] }
>;

export type SortKey = keyof typeof SORT_OPTIONS;

export function isSortKey(value: string | undefined): value is SortKey {
  return !!value && value in SORT_OPTIONS;
}

export interface CatalogQuery {
  q: string;
  /** Category **slug**, resolved to an id before hitting the API. */
  category: string;
  tags: string[];
  /** Major units, as shown to the shopper. */
  minPrice?: number;
  maxPrice?: number;
  sort: SortKey;
  /** 1-based. */
  page: number;
}

/** Next's `searchParams` shape. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : fallback;
}

function toMoney(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseCatalogQuery(params: RawSearchParams): CatalogQuery {
  const rawTags = params.tags;
  const tags = (Array.isArray(rawTags) ? rawTags : rawTags ? [rawTags] : [])
    .flatMap((t) => t.split(","))
    .map((t) => t.trim())
    .filter(Boolean);

  const sort = first(params.sort);
  const min = toMoney(first(params.minPrice));
  const max = toMoney(first(params.maxPrice));

  return {
    q: (first(params.q) ?? "").trim(),
    category: (first(params.category) ?? "").trim(),
    tags,
    // Guard against an inverted range arriving from a hand-edited URL, which
    // would otherwise silently return zero results.
    minPrice: min !== undefined && max !== undefined ? Math.min(min, max) : min,
    maxPrice: min !== undefined && max !== undefined ? Math.max(min, max) : max,
    sort: isSortKey(sort) ? sort : "default",
    page: toPositiveInt(first(params.page), 1),
  };
}

/**
 * Serialise back to a query string. Defaults are omitted so the common view
 * has a clean URL, and `page` resets whenever a filter changes — staying on
 * page 4 of a result set that now has one page shows an empty grid.
 */
export function buildCatalogHref(
  base: string,
  query: Partial<CatalogQuery>,
  options: { resetPage?: boolean } = {},
): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.tags?.length) params.set("tags", query.tags.join(","));
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.sort && query.sort !== "default") params.set("sort", query.sort);
  const page = options.resetPage ? 1 : (query.page ?? 1);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Translate to the SDK's `ProductFilters`.
 *
 * Two conversions matter:
 *  - price major → minor units, because the API compares against the stored
 *    integer amount;
 *  - page → `cursor`. The server treats `cursor` as a numeric OFFSET
 *    (`offset = Number(cursor)`) and returns `nextCursor = offset + limit`,
 *    so a 1-based page maps to `(page - 1) * PAGE_SIZE`. That's what lets the
 *    numbered pager work at all — a genuinely opaque cursor could only ever
 *    do next/previous.
 */
export function toProductFilters(
  query: CatalogQuery,
  categoryId?: string,
): ProductFilters {
  const { sortBy, sortDirection } = SORT_OPTIONS[query.sort];
  const filters: ProductFilters = {
    limit: PAGE_SIZE,
    cursor: String((query.page - 1) * PAGE_SIZE),
  };
  if (categoryId) filters.categoryId = categoryId;
  if (query.tags.length) filters.tags = query.tags;
  if (query.minPrice !== undefined) filters.minPrice = Math.round(query.minPrice * 100);
  if (query.maxPrice !== undefined) filters.maxPrice = Math.round(query.maxPrice * 100);
  if (sortBy) filters.sortBy = sortBy;
  if (sortDirection) filters.sortDirection = sortDirection;
  return filters;
}
