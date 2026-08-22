"use client";

import { Button } from "@/components/ui/button";
import { Close } from "@/lib/icon";
import type { CategoryType } from "@/db/categoriesData";
import { productPath } from "@/lib/productPath";
import type { ProductType } from "@/types/productType";
import currencyFormatter from "currency-formatter";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PriceRangeSlider from "./priceRangeSlider";

export const categoriesDataSidebar = [
  {
    id: 1,
    categoryName: "Furniture (2200)",
    categoryImg: "",
    value: "furniture",
  },
  {
    id: 2,
    categoryName: "Living Room (720)",
    categoryImg: "",
    value: "Living Room",
  },
  {
    id: 3,
    categoryName: "Decoration (210)",
    categoryImg: "",
    value: "Decoration",
  },
  {
    id: 4,
    categoryName: "Office (210)",
    categoryImg: "",
    value: "Office",
  },
  {
    id: 5,
    categoryName: "Accessories (580)",
    categoryImg: "",
    value: "Accessories",
  },
];
const colors = [
  "#1A1A19",
  "#D9D9D9",
  "#96532A",
  "#0000001A",
  "#FFA34E",
  "#FBDBAC",
  "#EADDC9",
];

const bestProducts = [
  {
    id: 1,
    thumbnail: "/images/sidebar/img-1.webp",
    title: "Modular sofa with wood",
    price: 100,
  },
  {
    id: 2,
    thumbnail: "/images/sidebar/img-2.webp",
    title: "Modern Accent Chair",
    price: 299,
  },
  {
    id: 3,
    thumbnail: "/images/sidebar/img-3.webp",
    title: "Wooden Black Chair",
    price: 280,
  },
];

const tags = [
  "furniture",
  "Bed Room",
  "Living Room",
  "Office",
  "Decoration",
  "Lighting",
  "Accessories",
];

/**
 * Filter sidebar.
 *
 * Two modes. Without the catalogue props it renders exactly as it always has,
 * on the sample data the un-migrated pages still use. With them, each control
 * drives the URL and the results come from the server.
 *
 * Two blocks are hidden in catalogue mode:
 *
 *  - **Filter by Color.** The API exposes variant options as value strings
 *    (`{ Wood: "Walnut" }`); the `swatch_hex` those circles need never crosses
 *    the SDK boundary, so the control could only ever render decorative dots
 *    that filter nothing.
 *  - **Best Sellers**, when no real products are supplied — a hardcoded rail of
 *    products that aren't in the catalogue, sitting beside ones that are, reads
 *    as broken.
 */
const ShopSidebar = ({
  isSidebarCategoryHide,
  categories,
  tags: catalogTags,
  priceBounds,
  selected,
  currency = "USD",
  bestSellers,
  onCategoryChange,
  onTagToggle,
  onPriceApply,
}: {
  isSidebarCategoryHide?: boolean;
  categories?: CategoryType[];
  tags?: string[];
  priceBounds?: { min: number; max: number };
  selected?: { category: string; tags: string[]; minPrice?: number; maxPrice?: number };
  currency?: string;
  bestSellers?: ProductType[];
  onCategoryChange?: (slug: string) => void;
  onTagToggle?: (tag: string) => void;
  onPriceApply?: (range: [number, number]) => void;
}) => {
  const [isSidebarActive, setIsSidebatActive] = useState(false);
  const isCatalogMode = Boolean(categories && selected);

  const categoryItems = isCatalogMode
    ? categories!.map((c) => ({
        id: c.id,
        categoryName: c.categoryName,
        value: c.value ?? String(c.id),
      }))
    : categoriesDataSidebar;
  const tagItems = isCatalogMode ? (catalogTags ?? []) : tags;
  const bestSellerItems = isCatalogMode ? (bestSellers ?? []) : bestProducts;

  return (
    <aside className="relative">
      <Button
        size={"sm"}
        className="lg:hidden inline-flex"
        onClick={() => setIsSidebatActive(true)}
      >
        Filter
      </Button>
      <div
        className={`bg-background max-w-[340px] pr-5 py-7.5 absolute top-0 z-40 lg:static lg:max-w-full lg:pr-0 lg:py-0 transition-all duration-500 ${
          isSidebarActive ? "left-0" : "-left-[150%] lg:left-0"
        }`}
      >
        <div
          className="text-gray-1-foreground absolute right-5 lg:hidden"
          onClick={() => setIsSidebatActive(false)}
        >
          <Close className="size-5" />
        </div>
        {isSidebarCategoryHide || (
          <div className="pb-10 border-b border-b-[#999796]">
            <strong className="font-medium text-xl text-secondary-foreground uppercase">
              Categories
            </strong>
            <ul className="mt-5 flex flex-col gap-2.5">
              {categoryItems.map(({ categoryName, id, value }) => (
                <li key={id}>
                  {isCatalogMode ? (
                    <button
                      type="button"
                      onClick={() => onCategoryChange?.(selected!.category === value ? "" : value)}
                      className={`text-base leading-[162%] transition-all duration-500 text-left ${selected!.category === value ? "text-secondary-foreground" : "text-gray-1-foreground hover:text-secondary-foreground"}`}
                    >
                      {categoryName}
                    </button>
                  ) : (
                    <Link
                      href={`/category?name=${value}`}
                      className="text-gray-1-foreground text-base leading-[162%] hover:text-secondary-foreground transition-all duration-500"
                    >
                      {categoryName}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-10 pb-10 border-b border-b-[#999796]">
          <strong className="font-medium text-xl text-secondary-foreground uppercase">
            Filter by Price
          </strong>
          <PriceRangeSlider
            min={priceBounds?.min}
            max={priceBounds?.max}
            currency={currency}
            value={
              selected && (selected.minPrice !== undefined || selected.maxPrice !== undefined)
                ? [selected.minPrice ?? priceBounds?.min ?? 0, selected.maxPrice ?? priceBounds?.max ?? 0]
                : undefined
            }
            onApply={onPriceApply}
          />
        </div>
        {!isCatalogMode && (
          <div className="mt-10 pb-10 border-b border-b-[#999796]">
            <strong className="font-medium text-xl text-secondary-foreground uppercase">
              Filter by Color
            </strong>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {colors.map((color, index) => (
                <li
                  key={index}
                  className={`rounded-full w-7.5 h-7.5 cursor-pointer`}
                  style={{ backgroundColor: color }}
                >
                  {" "}
                </li>
              ))}
            </ul>
          </div>
        )}
        {bestSellerItems.length > 0 && (
          <div className="mt-10 pb-10">
            <strong className="font-medium text-xl text-secondary-foreground uppercase">
              Best Sellers
            </strong>
            <div className="mt-5 flex flex-col gap-5">
              {bestSellerItems.map((prd) => {
                const { id, price, thumbnail, title } = prd;
                return (
                  <div key={id} className="flex items-center gap-5">
                    <Image
                      width={90}
                      height={70}
                      sizes="100vw"
                      src={thumbnail}
                      alt="img"
                      className="rounded-sm"
                    />
                    <div>
                      <Link
                        href={isCatalogMode ? productPath(prd as ProductType) : "/product-details"}
                        className="capitalize text-gray-1-foreground font-medium hover:text-secondary-foreground transition-all duration-500"
                      >
                        {title}
                      </Link>
                      <p className="text-secondary-foreground mt-1 font-medium">
                        {isCatalogMode
                          ? currencyFormatter.format(price, { code: currency || "USD" })
                          : `$${price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {tagItems.length > 0 && (
          <div className="mt-10 pb-10">
            <strong className="font-medium text-xl text-secondary-foreground uppercase">
              Tags
            </strong>
            <div className="mt-5 flex flex-wrap gap-x-[15px] gap-y-2.5">
              {tagItems.map((tag, index) => {
                const isActive = isCatalogMode && selected!.tags.includes(tag);
                return isCatalogMode ? (
                  <button
                    type="button"
                    key={index}
                    onClick={() => onTagToggle?.(tag)}
                    className={`underline decoration-skip-ink-none text-underline-position capitalize text-base transition-all duration-500 ${isActive ? "text-secondary-foreground" : "text-gray-1-foreground hover:text-secondary-foreground"}`}
                  >
                    {tag}
                  </button>
                ) : (
                  <Link
                    href={"#"}
                    key={index}
                    className="underline decoration-skip-ink-none text-underline-position capitalize text-gray-1-foreground text-base hover:text-secondary-foreground transition-all duration-500"
                  >
                    {tag}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ShopSidebar;
