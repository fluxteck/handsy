"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterDrawer from "@/components/sections/shopDetails/filterDrawer";
import ProductSorting from "@/components/sections/shopDetails/productSorting";
import ShopSidebar from "@/components/sections/shopDetails/shopSidebar";
import type { CategoryType } from "@/db/categoriesData";
import { Search } from "@/lib/icon";
import type { VendorType } from "@/types/vendorType";

const PAGE_SIZE = 8;

type SortKey = "recommended" | "name" | "rating";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "name", label: "Name (A–Z)" },
  { value: "rating", label: "Top rated" },
];

/**
 * Directory of every active maker storefront — search/filter/sort over the
 * real vendor list, all fetched once server-side (see `page.tsx`) and
 * filtered here in memory. A curated maker marketplace doesn't have enough
 * vendors to justify a server round trip per keystroke. Category and Location
 * sit in the site's shared Filter drawer.
 */
const VendorDirectory = ({ vendors }: { vendors: VendorType[] }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Every option offered is guaranteed to match at least one vendor, since
  // both are derived from the same real list rather than the full catalogue
  // taxonomy or an invented region list.
  const categoryOptions = useMemo(
    () => [...new Set(vendors.flatMap((vendor) => vendor.categories))].sort(),
    [vendors],
  );
  const categoryFilters = useMemo<CategoryType[]>(
    () =>
      categoryOptions.map((name) => ({
        id: name,
        categoryName: name,
        categoryImg: "",
        value: name,
        productCount: vendors.filter((vendor) => vendor.categories.includes(name)).length,
      })),
    [categoryOptions, vendors],
  );
  const locationOptions = useMemo(
    () => [...new Set(vendors.map((vendor) => vendor.location).filter(Boolean))].sort(),
    [vendors],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = vendors.filter((vendor) => {
      const matchesQuery =
        !q ||
        vendor.name.toLowerCase().includes(q) ||
        vendor.tagline.toLowerCase().includes(q) ||
        vendor.description.toLowerCase().includes(q);
      const matchesCategory = !category || vendor.categories.includes(category);
      const matchesLocation = !location || vendor.location === location;
      return matchesQuery && matchesCategory && matchesLocation;
    });

    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "rating") return b.rating - a.rating;
      return 0; // "Recommended" — the order the catalogue already returned.
    });
  }, [vendors, query, category, location, sort]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <section className="bg-home-bg-3 py-12 lg:py-16">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-heading font-semibold text-secondary-foreground">Our Vendors</h2>
          <div className="w-14 h-[3px] bg-primary mx-auto mt-4 mb-5" />
          <p className="text-gray-1-foreground leading-[170%]">
            Meet the independent makers behind every piece on Handsy Market — each one hand-vetted
            for craftsmanship and sourced from small, sustainable workshops.
          </p>
        </div>

        <div className="mt-10">
          <ProductSorting
            isGridView
            sort={sort}
            onSortChange={setSort}
            sortOptions={sortOptions}
            filterSlot={
              <div className="flex flex-wrap items-center gap-3">
                <FilterDrawer
                  activeCount={Number(Boolean(category)) + Number(Boolean(location))}
                  resultLabel={`Show ${filtered.length} ${filtered.length === 1 ? "vendor" : "vendors"}`}
                  onClearAll={() => {
                    setCategory("");
                    setLocation("");
                    setVisibleCount(PAGE_SIZE);
                  }}
                >
                  <ShopSidebar
                    isSidebarTagsHide
                    categories={categoryFilters}
                    selected={{ category, tags: [] }}
                    onCategoryChange={(value) => {
                      setCategory(value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    optionGroups={[
                      {
                        id: "location",
                        label: "Location",
                        allLabel: "All regions",
                        options: locationOptions.map((option) => ({
                          value: option,
                          label: option,
                          count: vendors.filter((vendor) => vendor.location === option).length,
                        })),
                        selected: location,
                        onChange: (value) => {
                          setLocation(value);
                          setVisibleCount(PAGE_SIZE);
                        },
                      },
                    ]}
                  />
                </FilterDrawer>
                <div className="relative w-[220px] sm:w-[280px]">
                  <Input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    placeholder="Search vendors…"
                    aria-label="Search vendors by name, craft, or material"
                    className="pl-10 h-9 border-border bg-background text-secondary-foreground text-sm"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-1-foreground" />
                </div>
              </div>
            }
          />
        </div>

        <div className="flex items-center justify-between gap-4 mt-10 mb-6">
          <p className="text-xl font-semibold text-secondary-foreground">All Vendors</p>
          {filtered.length > 0 && (
            <p className="text-sm text-gray-1-foreground">
              Showing {visible.length} of {filtered.length} vendors
            </p>
          )}
        </div>

        {visible.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {visible.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-home-bg-4 rounded-2xl p-6 flex flex-col items-center text-center"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-background ring-1 ring-border">
                    <Image
                      src={vendor.logo}
                      alt={`${vendor.name} logo`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 font-semibold text-lg text-secondary-foreground">
                    {vendor.name}
                  </p>
                  <p className="mt-1.5 text-sm text-gray-1-foreground line-clamp-2 min-h-10">
                    {vendor.tagline || vendor.description}
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-5 w-full">
                    <Link href={`/vendor/${vendor.slug}`}>View Store</Link>
                  </Button>
                </div>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  Load more vendors
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-1-foreground py-10">
            {vendors.length === 0
              ? "Our vendor directory is being set up — check back soon."
              : "No vendors match those filters. Try widening your search."}
          </p>
        )}
      </div>
    </section>
  );
};

export default VendorDirectory;
