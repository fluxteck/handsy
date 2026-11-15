"use client";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip";
import { Eye, Heart } from "@/lib/icon";
import currencyFormatter from "currency-formatter";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ProductSorting from "@/components/sections/shopDetails/productSorting";
import Card, {
  CardFooter,
  CardHeader,
  CardIcons,
  CardImg,
  CardLabel,
  CardPriceEnhanced,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/ui/pagination";
import ShopEmptyState from "@/components/ui/shopEmptyState";
import { Clock, Sparkles } from "lucide-react";
import calcluteDiscount from "@/lib/calcluteDiscount";
import { useCart } from "@/lib/cart/cart-context";
import { ProductType } from "@/types/productType";
import type { CategoryType } from "@/db/categoriesData";
import { buildCatalogHref, type CatalogQuery, type SortKey } from "@/lib/catalog/filters";
import { toggleTag } from "@/lib/catalog/tagGroups";
import { productPath } from "@/lib/productPath";
import { useRouter } from "next/navigation";
import ProductQuickView, { ProductQuickViewProduct } from "./productQuickView";
import ProductsCategory from "./productsCategory";
import ShopSidebar from "./shopSidebar";
import FilterDrawer from "./filterDrawer";
import { useWishlist } from "@/lib/wishlist/wishlist-context";

/** Everything the catalogue-backed listing needs. Absent on pages still
 *  rendering the sample data, which keeps their original behaviour. */
export type CatalogViewProps = {
  /** Route the filters write back to, e.g. "/shop". */
  basePath: string;
  query: CatalogQuery;
  total: number;
  totalPages: number;
  categories: CategoryType[];
  tags: string[];
  priceBounds: { min: number; max: number };
  currency: string;
  /** The product query failed, as opposed to matching nothing. */
  failed: boolean;
};

type ProductsViewPropsType = {
  isCategoryShow: boolean;
  isSortingProductTop: boolean;
  isGridDefaultView: boolean;
  isSidebarCategoryHide: boolean;
  isSidebarTagsHide?: boolean;
  data: ProductType[];
  catalog?: CatalogViewProps;
};

const ProductsView = ({
  isCategoryShow,
  isSortingProductTop,
  isGridDefaultView,
  isSidebarCategoryHide,
  isSidebarTagsHide,
  data,
  catalog,
}: ProductsViewPropsType) => {
  const router = useRouter();

  /**
   * Every control funnels through here: change one field, reset to page 1
   * (except when it's the page itself), and navigate. The URL is the state, so
   * the server re-renders with fresh results and back/forward work for free.
   */
  const applyFilters = (patch: Partial<CatalogQuery>) => {
    if (!catalog) return;
    const isPageChange = "page" in patch;
    router.push(
      buildCatalogHref(catalog.basePath, { ...catalog.query, ...patch }, { resetPage: !isPageChange }),
      { scroll: true },
    );
  };
  const [isGridView, setIsGridView] = useState<boolean>(isGridDefaultView);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [product, setProduct] = useState<ProductQuickViewProduct>({
    id: 0,
    thumbnail: "",
    price: 0,
    discountPercentage: 0,
    title: "",
    stock: 0,
  });
  const { add: addToCartLine } = useCart();
  const { add: addToWishlistEntry } = useWishlist();

  // A category page that is empty with no search/tag/price filter applied has
  // genuinely no stock yet — as opposed to filters that simply matched nothing.
  const isAwaitingProducts = Boolean(
    catalog &&
      !catalog.failed &&
      catalog.total === 0 &&
      catalog.basePath.startsWith("/category/") &&
      !catalog.query.q &&
      catalog.query.tags.length === 0 &&
      catalog.query.minPrice === undefined &&
      catalog.query.maxPrice === undefined &&
      catalog.query.page <= 1
  );

  // Filters the shopper has applied, for the badge on the Filter button.
  const activeFilterCount = catalog
    ? (isSidebarCategoryHide ? 0 : Number(Boolean(catalog.query.category))) +
      (isSidebarTagsHide ? 0 : catalog.query.tags.length) +
      Number(catalog.query.minPrice !== undefined || catalog.query.maxPrice !== undefined)
    : 0;

  /* The filter panel lives in the shared left drawer opened from the sorting
     row, so the grid gets the full width. */
  const filterDrawer = (
    <FilterDrawer
      activeCount={activeFilterCount}
      resultLabel={
        !catalog || catalog.failed
          ? "Show results"
          : `Show ${catalog.total} ${catalog.total === 1 ? "product" : "products"}`
      }
      // Only what this drawer offers: a category page's own category comes
      // from its path, and search and sort are kept.
      onClearAll={() =>
        applyFilters({
          ...(isSidebarCategoryHide ? {} : { category: "" }),
          tags: [],
          minPrice: undefined,
          maxPrice: undefined,
        })
      }
    >
      <ShopSidebar
        isSidebarCategoryHide={isSidebarCategoryHide}
        isSidebarTagsHide={isSidebarTagsHide}
        categories={catalog?.categories}
        tags={catalog?.tags}
        priceBounds={catalog?.priceBounds}
        currency={catalog?.currency}
        selected={
          catalog && {
            category: catalog.query.category,
            tags: catalog.query.tags,
            minPrice: catalog.query.minPrice,
            maxPrice: catalog.query.maxPrice,
          }
        }
        onCategoryChange={catalog ? (category) => applyFilters({ category }) : undefined}
        onTagToggle={
          catalog
            ? (tag) => applyFilters({ tags: toggleTag(catalog.query.tags, tag) })
            : undefined
        }
        onPriceApply={
          catalog ? ([min, max]) => applyFilters({ minPrice: min, maxPrice: max }) : undefined
        }
      />
    </FilterDrawer>
  );

  return (
    <>
      <div className="container lg:pt-25 lg:pb-25 pt-15 pb-15">
        {isCategoryShow && (
          <div className="mb-7.5">
            <ProductsCategory />
            <div className="mt-15">
              <ProductSorting
                isGridView={isGridView}
                setIsGridView={setIsGridView}
                sort={catalog?.query.sort}
                onSortChange={catalog ? (sort: SortKey) => applyFilters({ sort }) : undefined}
                filterSlot={filterDrawer}
              />
            </div>
          </div>
        )}
        <div>
          <div>
            {isSortingProductTop && (
              <ProductSorting
                isGridView={isGridView}
                setIsGridView={setIsGridView}
                sort={catalog?.query.sort}
                onSortChange={catalog ? (sort: SortKey) => applyFilters({ sort }) : undefined}
                filterSlot={filterDrawer}
              />
            )}
            {catalog && data.length === 0 && (
              isAwaitingProducts ? (
                <ShopEmptyState
                  icon={Sparkles}
                  badgeIcon={Clock}
                  eyebrow="Coming Soon"
                  title="Something Beautiful Is Coming"
                  description="We're onboarding selected artisans and vendors to curate this collection. Check back soon."
                  ctaLabel="Explore Other Categories"
                  ctaHref="/shop"
                  className="mt-7.5"
                />
              ) : (
                <p className="text-gray-1-foreground text-base mt-7.5">
                  {catalog.failed
                    ? "We couldn't load products just now. Please refresh to try again."
                    : "No products match these filters."}
                </p>
              )
            )}
            {isGridView ? (
              <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-5 gap-y-10 mt-7.5">
                {data.map((prd) => {
                  return (
                    <Card key={prd.id}>
                      <CardHeader>
                        <CardImg src={prd.thumbnail} height={400} width={340} path={productPath(prd)} />
                        <CardLabel isLabel={prd.label ? prd.label : false}>
                          {prd.label}
                        </CardLabel>
                        <CardIcons product={prd} />
                      </CardHeader>
                      <CardFooter>
                        <CardTitle path={productPath(prd)}>
                          {prd.title}
                        </CardTitle>
                        <CardPriceEnhanced
                          price={prd.price}
                          discountPercentage={prd.discountPercentage}
                          finalPrice={prd.sellingPrice}
                          currency={prd.currency}
                        />
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-7.5 mt-7.5">
                {data.map((prd) => {
                    const {
                      discountPercentage,
                      id,
                      price,
                      thumbnail,
                      title,
                      colors,
                      stock,
                    } = prd;
                    const finalPrice = discountPercentage
                      ? calcluteDiscount(price, discountPercentage)
                      : price;
                    return (
                      <div
                        key={id}
                        className="grid sm:grid-cols-[32.2%_auto] grid-cols-1 items-center gap-7.5"
                      >
                        <Link
                          href={productPath(prd)}
                          aria-label="View product details"
                          className="bg-[#F2F2F2] rounded-xl block"
                        >
                          <Image
                            width={341}
                            height={400}
                            sizes="100vw"
                            src={thumbnail}
                            alt="img"
                            className="w-full rounded-xl"
                          />
                        </Link>
                        <div>
                          <Link
                            href={productPath(prd)}
                            className="text-[clamp(1.25rem,1.0769rem+0.7692vw,2rem)] leading-[131%] text-secondary-foreground font-medium capitalize line-clamp-1 multiline-hover inline-flex"
                          >
                            {title}
                          </Link>
                          <Link href={productPath(prd)} className="block mt-2.5">
                            <p className="text-gray-1-foreground leading-[155%]">
                              Elevate your dining experience with the Baxter
                              Colette Chair, a perfect blend of modern elegance
                              and timeless craftsmanship.
                            </p>
                          </Link>
                          <p className="text-secondary-foreground lg:text-2xl md:text-xl text-lg font-medium mt-5">
                            {discountPercentage ? (
                              <del className="text-gray-3-foreground font-normal">
                                {currencyFormatter.format(price, {
                                  code: prd.currency || "USD",
                                })}
                              </del>
                            ) : null}{" "}
                            <span>
                              {currencyFormatter.format(finalPrice, {
                                code: prd.currency || "USD",
                              })}
                            </span>{" "}
                            {prd.currency || "USD"}
                          </p>
                          <div className="flex gap-2.5 mt-5">
                            <Button
                              size={"sm"}
                              onClick={() =>
                                void addToCartLine({
                                  variantId: prd.variantId,
                                  quantity: 1,
                                  title,
                                  thumbnail,
                                  price: finalPrice,
                                  currency: prd.currency,
                                })
                              }
                              className="px-4 h-9 lg:text-sm"
                            >
                              Add To Cart
                            </Button>
                            <Tooltip
                              text={"Add To Whitelist"}
                              className="bg-primary text-white"
                              arrowCalss="bg-primary"
                            >
                              <div
                                onClick={() =>
                                  void addToWishlistEntry(prd)
                                }
                                className="w-9 h-9 rounded-sm flex items-center justify-center border-[1.5px] border-primary text-secondary-foreground cursor-pointer hover:bg-primary hover:text-white transition-all duration-500"
                              >
                                <Heart className="w-5 h-5" strokeWidth={0.5} />
                              </div>
                            </Tooltip>
                            <Tooltip
                              text={"Quick view"}
                              className="bg-primary text-white"
                              arrowCalss="bg-primary"
                            >
                              <div
                                onClick={() => {
                                  setIsDialogOpen(true);
                                  setProduct(prd);
                                }}
                                className="w-9 h-9 rounded-sm flex items-center justify-center border-[1.5px] border-primary text-secondary-foreground cursor-pointer hover:bg-primary hover:text-white transition-all duration-500"
                              >
                                <Eye className="w-5 h-5" strokeWidth={0.5} />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
            {catalog ? (
              catalog.totalPages > 1 && (
                <Pagination
                  page={catalog.query.page}
                  totalPages={catalog.totalPages}
                  onPageChange={(page) => applyFilters({ page })}
                />
              )
            ) : (
              data.length > 9 && <Pagination />
            )}
          </div>
        </div>
        <ProductQuickView
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          product={product}
        />
      </div>
    </>
  );
};

export default ProductsView;
