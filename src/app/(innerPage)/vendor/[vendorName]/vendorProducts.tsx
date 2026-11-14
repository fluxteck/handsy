"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Card, {
  CardFooter,
  CardHeader,
  CardIcons,
  CardImg,
  CardLabel,
  CardPriceEnhanced,
  CardTitle,
} from "@/components/ui/card";
import FilterDrawer from "@/components/sections/shopDetails/filterDrawer";
import ProductSorting from "@/components/sections/shopDetails/productSorting";
import ShopSidebar from "@/components/sections/shopDetails/shopSidebar";
import type { CategoryType } from "@/db/categoriesData";
import type { SortKey } from "@/lib/catalog/filters";
import { VendorProductType, VendorType } from "@/types/vendorType";
import { productPath } from "@/lib/productPath";

const INITIAL_VISIBLE_COUNT = 8;

/** What the shopper pays — the exact selling price when known. */
const priceOf = (product: VendorProductType) => product.sellingPrice ?? product.price;

/**
 * A maker's products, filtered and sorted in the browser (the storefront loads
 * them all at once), through the same Filter drawer and sorting row as the
 * catalogue listings.
 */
const VendorProducts = ({ vendor, products }: { vendor: VendorType; products: VendorProductType[] }) => {
  const [activeCategory, setActiveCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>();
  const [sort, setSort] = useState<SortKey>("default");
  const [showAll, setShowAll] = useState(false);

  // The maker's categories, shaped for the shared Category section.
  const categoryFilters = useMemo<CategoryType[]>(
    () =>
      vendor.categories.map((name) => ({
        id: name,
        categoryName: name,
        categoryImg: "",
        value: name,
        productCount: products.filter((product) => product.category === name).length,
      })),
    [vendor.categories, products],
  );
  const priceBounds = useMemo(
    () => ({ min: 0, max: Math.ceil(Math.max(0, ...products.map(priceOf))) }),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        (!activeCategory || product.category === activeCategory) &&
        (!priceRange || (priceOf(product) >= priceRange[0] && priceOf(product) <= priceRange[1])),
    );

    const sorted = [...filtered];
    switch (sort) {
      case "low-to-high":
        sorted.sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case "high-to-low":
        sorted.sort((a, b) => priceOf(b) - priceOf(a));
        break;
      case "popularity":
      case "average":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sorted;
  }, [products, activeCategory, priceRange, sort]);

  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = filteredProducts.length > visibleProducts.length;
  const activeCount = Number(Boolean(activeCategory)) + Number(Boolean(priceRange));

  const filterDrawer = (
    <FilterDrawer
      activeCount={activeCount}
      resultLabel={`Show ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`}
      onClearAll={() => {
        setActiveCategory("");
        setPriceRange(undefined);
        setShowAll(false);
      }}
    >
      <ShopSidebar
        isSidebarTagsHide
        categories={categoryFilters}
        priceBounds={priceBounds}
        currency={products[0]?.currency}
        selected={{ category: activeCategory, tags: [], minPrice: priceRange?.[0], maxPrice: priceRange?.[1] }}
        onCategoryChange={(category) => {
          setActiveCategory(category);
          setShowAll(false);
        }}
        onPriceApply={(range) => {
          setPriceRange(range);
          setShowAll(false);
        }}
      />
    </FilterDrawer>
  );

  return (
    <section id="vendor-products" aria-label={`Products by ${vendor.name}`} className="pb-15 lg:pb-25">
      <div className="container">
        <div className="mb-7.5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-heading text-secondary-foreground">Products by {vendor.name}</h2>
          <p className="text-sm text-gray-1-foreground">{products.length} Products</p>
        </div>

        <ProductSorting isGridView sort={sort} onSortChange={setSort} filterSlot={filterDrawer} />

        {visibleProducts.length ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 mt-7.5 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardImg src={product.thumbnail} height={400} width={340} path={productPath(product)} />
                  <CardLabel isLabel={product.label ? product.label : false}>{product.label}</CardLabel>
                  <CardIcons product={product} />
                </CardHeader>
                <CardFooter>
                  <CardTitle path={productPath(product)}>{product.title}</CardTitle>
                  <CardPriceEnhanced price={product.price} discountPercentage={product.discountPercentage} finalPrice={product.sellingPrice} />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-7.5 text-gray-1-foreground">No products found in this category yet.</p>
        )}

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <Button variant="outline" onClick={() => setShowAll(true)}>
              View All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VendorProducts;
