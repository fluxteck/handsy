"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorProductType, VendorType } from "@/types/vendorType";
import { productPath } from "@/lib/productPath";

type SortValue = "latest" | "low-to-high" | "high-to-low" | "top-rated";

const sortOptions: { value: SortValue; label: string }[] = [
  { value: "latest", label: "Sort by Latest" },
  { value: "top-rated", label: "Sort by average rating" },
  { value: "low-to-high", label: "Sort by price: low to high" },
  { value: "high-to-low", label: "Sort by price: high to low" },
];

const INITIAL_VISIBLE_COUNT = 8;

const pillTriggerClassName =
  "rounded-full border border-gray-2 px-4 py-1.5 text-sm capitalize md:text-sm lg:text-sm data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none";

const VendorProducts = ({ vendor, products }: { vendor: VendorType; products: VendorProductType[] }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortValue>("latest");
  const [showAll, setShowAll] = useState(false);

  const filteredProducts = useMemo(() => {
    const byCategory =
      activeCategory === "all"
        ? products
        : products.filter((product) => product.category === activeCategory);

    const sorted = [...byCategory];
    switch (sort) {
      case "low-to-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "top-rated":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sorted;
  }, [products, activeCategory, sort]);

  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = filteredProducts.length > visibleProducts.length;

  return (
    <section id="vendor-products" aria-label={`Products by ${vendor.name}`} className="pb-15 lg:pb-25">
      <div className="container">
        <div className="mb-7.5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-heading text-secondary-foreground">Products by {vendor.name}</h2>
          <p className="text-sm text-gray-1-foreground">{products.length} Products</p>
        </div>

        <Tabs
          value={activeCategory}
          onValueChange={(value) => {
            setActiveCategory(value);
            setShowAll(false);
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
              <TabsTrigger value="all" className={pillTriggerClassName}>
                All
              </TabsTrigger>
              {vendor.categories.map((category) => (
                <TabsTrigger key={category} value={category} className={pillTriggerClassName}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <Select value={sort} onValueChange={(value) => setSort(value as SortValue)}>
              <SelectTrigger className="border-none rounded-sm bg-home-bg-1 text-gray-1-foreground py-2 text-base leading-[162%] min-w-[218px]">
                <SelectValue placeholder="Sort by Latest" />
              </SelectTrigger>
              <SelectContent className="text-gray-1-foreground bg-home-bg-1 rounded-sm p-0">
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-sm focus:bg-primary focus:text-white"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tabs>

        {visibleProducts.length ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 mt-7.5 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardImg src={product.thumbnail} height={400} width={340} path={productPath(product)} />
                  <CardLabel isLabel={product.label ? product.label : false}>{product.label}</CardLabel>
                  <CardDiscount
                    isDiscountTrue={product.discountPercentage ? product.discountPercentage : false}
                  >
                    -{product.discountPercentage}%
                  </CardDiscount>
                  <CardIcons product={product} />
                </CardHeader>
                <CardFooter>
                  <CardTitle path={productPath(product)}>{product.title}</CardTitle>
                  <CardPriceEnhanced price={product.price} discountPercentage={product.discountPercentage} />
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
