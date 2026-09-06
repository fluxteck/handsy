import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/sections/pageHeader";
import ProductsView from "@/components/sections/shopDetails/productView";
import Newsletter from "@/components/sections/newsletter";
import InstagramGallery from "@/components/sections/instagramGallery";
import { parseCatalogQuery, type RawSearchParams } from "@/lib/catalog/filters";
import { getCollectionPage, getTopRatedProducts } from "@/lib/sdk";
import { getStoreCurrency, getSiteUrl } from "@/lib/config";

/**
 * A collection's landing page.
 *
 * Deliberately the same furniture as `/shop` and `/category/[slug]` —
 * `PageHeader`, `ProductsView`, the sidebar and the pager — so a collection
 * looks like every other listing. What differs is only where the products come
 * from: `/collections/{slug}/products`, which applies the collection's rules,
 * its pins and the order its operator chose.
 *
 * Dynamic rather than ISR: the output depends on the query string, and caching
 * one variant would serve the wrong products for every other.
 */
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
};

/**
 * Filtered and sorted variants are kept out of the index.
 *
 * Google's guidance is explicit that a paginated page should be canonical to
 * *itself* rather than to page one, and that filter and sort permutations
 * should be suppressed. Left alone, one collection with 12 tags, a price range
 * and six sorts is thousands of crawlable URLs holding the same products.
 *
 * `follow`, not `nofollow`: the products linked from a filtered page are still
 * worth discovering; only this particular combination is uninteresting.
 */
function indexability(slug: string, params: RawSearchParams): Metadata {
  const filtered = ["tags", "minPrice", "maxPrice", "sort", "q"].some((k) => params[k]);
  const page = Number(params.page) > 1 ? `?page=${Number(params.page)}` : "";

  /*
   * Self-canonical in every case, including page 2 and filtered variants.
   *
   * Pointing a filtered page's canonical at the bare URL while also marking it
   * `noindex` sends two contradictory instructions — "do not index this" and
   * "index that one instead". `noindex` alone is the unambiguous half, so the
   * canonical stays honest about which URL this is.
   */
  const self = `${getSiteUrl()}/collections/${slug}${filtered ? "" : page}`;
  return {
    alternates: { canonical: self },
    ...(filtered ? { robots: { index: false, follow: true } } : {}),
  };
}

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const raw = await searchParams;
  const collection = await getCollectionPage(slug, parseCatalogQuery(raw));
  if (!collection) return {};
  return {
    title: collection.name,
    ...(collection.description ? { description: collection.description } : {}),
    ...indexability(slug, raw),
  };
};

const CollectionPage = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params;
  const query = parseCatalogQuery(await searchParams);

  const [collection, bestSellers] = await Promise.all([
    getCollectionPage(slug, query),
    getTopRatedProducts(3),
  ]);
  // Unknown or unpublished. A real 404 rather than an empty grid: an empty
  // collection is a page that will fill up, a missing one is not a page.
  if (!collection) notFound();

  return (
    <main>
      <PageHeader
        pageTitle={collection.name}
        currentPage={collection.name}
        breadcrumbLink="/collections"
        breadcrumbLabel="Collections"
        renderHeading={false}
      />
      <ProductsView
        isCategoryShow={false}
        isSortingProductTop={true}
        isGridDefaultView={true}
        isSidebarCategoryHide={true}
        data={collection.items}
        catalog={{
          basePath: `/collections/${slug}`,
          query,
          total: collection.total,
          totalPages: collection.totalPages,
          categories: collection.categories,
          tags: collection.tags,
          priceBounds: collection.priceBounds,
          bestSellers,
          currency: getStoreCurrency(),
          failed: collection.failed,
        }}
      />
      <Newsletter />
      <InstagramGallery />
    </main>
  );
};

export default CollectionPage;
