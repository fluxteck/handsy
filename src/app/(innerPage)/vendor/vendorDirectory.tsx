"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "@/lib/icon";
import type { VendorType } from "@/types/vendorType";

const PAGE_SIZE = 8;
const ALL = "all";

type SortKey = "recommended" | "name" | "rating";

/**
 * Directory of every active maker storefront — search/filter/sort over the
 * real vendor list, all fetched once server-side (see `page.tsx`) and
 * filtered here in memory. A curated maker marketplace doesn't have enough
 * vendors to justify a server round trip per keystroke.
 */
const VendorDirectory = ({ vendors }: { vendors: VendorType[] }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Every option offered is guaranteed to match at least one vendor, since
  // both are derived from the same real list rather than the full catalogue
  // taxonomy or an invented region list.
  const categoryOptions = useMemo(
    () => [...new Set(vendors.flatMap((vendor) => vendor.categories))].sort(),
    [vendors],
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
      const matchesCategory = category === ALL || vendor.categories.includes(category);
      const matchesLocation = location === ALL || vendor.location === location;
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

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="sm:col-span-2 lg:col-span-1 text-sm text-gray-1-foreground">
            Search vendors
            <div className="relative mt-2">
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search by name, craft, or material…"
                className="pl-11 border-[#999796] bg-background text-secondary-foreground"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-1-foreground" />
            </div>
          </label>

          <label className="text-sm text-gray-1-foreground">
            Category
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              <SelectTrigger className="mt-2 w-full border-[#999796] bg-background text-secondary-foreground">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All categories</SelectItem>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option} className="capitalize">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="text-sm text-gray-1-foreground">
            Location
            <Select
              value={location}
              onValueChange={(v) => {
                setLocation(v);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              <SelectTrigger className="mt-2 w-full border-[#999796] bg-background text-secondary-foreground">
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All regions</SelectItem>
                {locationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="text-sm text-gray-1-foreground">
            Sort by
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="mt-2 w-full border-[#999796] bg-background text-secondary-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="name">Name (A–Z)</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
              </SelectContent>
            </Select>
          </label>
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
