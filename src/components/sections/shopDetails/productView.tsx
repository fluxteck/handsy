"use client";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip";
import { Eye, Heart, Shuffle } from "@/lib/icon";
import currencyFormatter from "currency-formatter";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ProductSorting from "@/components/sections/shopDetails/productSorting";
import Card, {
  CardDiscount,
  CardFooter,
  CardHeader,
  CardIcons,
  CardImg,
  CardLabel,
  CardPriceEnhanced,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/ui/pagination";
import calcluteDiscount from "@/lib/calcluteDiscount";
import { addToCompare } from "@/lib/features/CompareProductsSlice";
import { useAppDispatch } from "@/lib/reduxHooks";
import { useCart } from "@/lib/cart/cart-context";
import { ProductType } from "@/types/productType";
import type { CategoryType } from "@/db/categoriesData";
import { buildCatalogHref, type CatalogQuery, type SortKey } from "@/lib/catalog/filters";
import { productPath } from "@/lib/productPath";
import { useRouter } from "next/navigation";
import ProductQuickView, { ProductQuickViewProduct } from "./productQuickView";
import ProductsCategory from "./productsCategory";
import ShopSidebar from "./shopSidebar";
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
  bestSellers: ProductType[];
  currency: string;
  /** The product query failed, as opposed to matching nothing. */
  failed: boolean;
};

type ProductsViewPropsType = {
  isCategoryShow: boolean;
  isSortingProductTop: boolean;
  isGridDefaultView: boolean;
  isSidebarCategoryHide: boolean;
  data: ProductType[];
  catalog?: CatalogViewProps;
};

const ProductsView = ({
  isCategoryShow,
  isSortingProductTop,
  isGridDefaultView,
  isSidebarCategoryHide,
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
  const dispatch = useAppDispatch();
  const { add: addToCartLine } = useCart();
  const { add: addToWishlistEntry } = useWishlist();

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
                searchTerm={catalog?.query.q}
                sort={catalog?.query.sort}
                onSearch={catalog ? (q) => applyFilters({ q }) : undefined}
                onSortChange={catalog ? (sort: SortKey) => applyFilters({ sort }) : undefined}
              />
            </div>
          </div>
        )}
        <div className="grid lg:grid-cols-[minmax(220px,18%)_auto] grid-cols-1 gap-7.5">
          <ShopSidebar
            isSidebarCategoryHide={isSidebarCategoryHide}
            categories={catalog?.categories}
            tags={catalog?.tags}
            priceBounds={catalog?.priceBounds}
            bestSellers={catalog?.bestSellers}
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
                ? (tag) =>
                    applyFilters({
                      tags: catalog.query.tags.includes(tag)
                        ? catalog.query.tags.filter((t) => t !== tag)
                        : [...catalog.query.tags, tag],
                    })
                : undefined
            }
            onPriceApply={
              catalog ? ([min, max]) => applyFilters({ minPrice: min, maxPrice: max }) : undefined
            }
          />
          <div>
            {isSortingProductTop && (
              <ProductSorting
                isGridView={isGridView}
                setIsGridView={setIsGridView}
                searchTerm={catalog?.query.q}
                sort={catalog?.query.sort}
                onSearch={catalog ? (q) => applyFilters({ q }) : undefined}
                onSortChange={catalog ? (sort: SortKey) => applyFilters({ sort }) : undefined}
              />
            )}
            {catalog && data.length === 0 && (
              <p className="text-gray-1-foreground text-base mt-7.5">
                {catalog.failed
                  ? "We couldn't load products just now. Please refresh to try again."
                  : "No products match these filters."}
              </p>
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
                        <CardDiscount
                          isDiscountTrue={
                            prd.discountPercentage
                              ? prd.discountPercentage
                              : false
                          }
                        >
                          -{prd.discountPercentage}%
                        </CardDiscount>
                        <CardIcons product={prd} />
                      </CardHeader>
                      <CardFooter>
                        <CardTitle path={productPath(prd)}>
                          {prd.title}
                        </CardTitle>
                        <CardPriceEnhanced
                          price={prd.price}
                          discountPercentage={prd.discountPercentage}
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
                            <Tooltip
                              text={"Compare Products"}
                              className="bg-primary text-white"
                              arrowCalss="bg-primary"
                            >
                              <div
                                onClick={() =>
                                  dispatch(
                                    addToCompare({
                                      id,
                                      price,
                                      discountPercentage,
                                      thumbnail,
                                      title,
                                      stock,
                                      color: colors[0]?.code || "",
                                      size: "xl",
                                    })
                                  )
                                }
                                className="w-9 h-9 rounded-sm flex items-center justify-center border-[1.5px] border-primary text-secondary-foreground cursor-pointer hover:bg-primary hover:text-white transition-all duration-500"
                              >
                                <Shuffle
                                  className="w-5 h-5"
                                  strokeWidth={0.5}
                                />
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
