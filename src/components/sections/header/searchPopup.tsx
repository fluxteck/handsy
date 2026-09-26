"use client";
import { Input } from "@/components/ui/input";
import { Close, Search } from "@/lib/icon";
import { cn } from "@/lib/utils";
import type { CategoryLink } from "@/lib/categoryLinks";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useProductSearch } from "@/lib/sdk/use-search";
import { productPath } from "@/lib/productPath";

const PLACEHOLDER_ROTATE_MS = 2500;

const SearchPopup = ({ categories = [] }: { categories?: CategoryLink[] }) => {
  // Rotating placeholder ("Search for Pendants...") built from the real
  // catalogue; it used to name the template's categories, advertising a range
  // this store does not carry.
  const categoryLabels = categories.map(({ label }) => label);
  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  /* Server-side full-text search, debounced — see `useProductSearch`. The
     previous implementation filtered one preloaded page in the browser, so it
     could only ever find products that had already been shipped to the page. */
  const { results: searchProducts } = useProductSearch(searchInput);

  useEffect(() => {
    setIsOpen(searchInput.trim() !== "");
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsMobileOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
      setIsMobileOpen(false);
      setSearchInput("");
    };

    if (isOpen || isMobileOpen) {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, isMobileOpen]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || categoryLabels.length <= 1) return;

    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % categoryLabels.length);
    }, PLACEHOLDER_ROTATE_MS);

    return () => clearInterval(timer);
  }, []);

  const animatedPlaceholder = searchInput.trim() === "" && (
    <span
      key={placeholderIndex}
      aria-hidden
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 truncate max-w-[calc(100%-24px)] text-gray-1-foreground/70 text-base animate-in fade-in slide-in-from-bottom-1 duration-500 fill-mode-both"
    >
      {categoryLabels.length ? `Search for ${categoryLabels[placeholderIndex]}...` : "Search products..."}
    </span>
  );

  const resultsDropdown = searchProducts.length > 0 && (
    <div data-lenis-prevent className="hidden md:block absolute top-full left-0 mt-2 w-full bg-background shadow-lg rounded-md border border-border max-h-[300px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      {searchProducts.map(({ id, title, slug }) => (
        <div key={id} className="px-4 py-2">
          <Link
            href={productPath({ slug })}
            className="text-secondary-foreground capitalize hover:text-secondary-foreground transition-all duration-500"
          >
            {title}
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div ref={popupRef} className="relative w-full">
      {/* Persistent inline search bar (tablet & desktop) */}
      <form
        action=""
        onSubmit={(e) => e.preventDefault()}
        className="hidden md:flex items-center border border-border bg-home-bg-1 relative rounded-full transition-colors duration-300 focus-within:border-primary"
      >
        <span className="pl-4 text-gray-1-foreground shrink-0">
          <Search />
        </span>
        <div className="relative flex-1 min-w-0">
          <Input
            value={searchInput}
            onFocus={() => searchInput.trim() !== "" && setIsOpen(true)}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder=""
            aria-label="Search products"
            className="rounded-full focus-visible:ring-0 border-none bg-transparent"
          />
          {animatedPlaceholder}
        </div>
      </form>
      {isOpen && resultsDropdown}

      {/* Compact icon trigger (mobile only) */}
      <div className="md:hidden flex justify-end">
        <button
          aria-label="search-icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={cn(
            "text-gray-1-foreground -rotate-90 cursor-pointer p-1.5 -m-1.5 rounded-full transition-colors duration-300 hover:bg-black/[0.04] active:bg-black/[0.06]"
          )}
        >
          <Search />
        </button>
      </div>
      {isMobileOpen && (
        <div className="fixed top-14 left-0 w-full bg-background [&_.close-orginal]:hidden pt-5 pb-6 px-5 shadow-lg rounded-b-md z-50">
          <button
            aria-label="close-btn"
            onClick={() => setIsMobileOpen(false)}
            className="absolute right-0 top-0 w-8 h-8 rounded-full bg-background flex justify-center items-center text-gray-2-foreground hover:text-secondary-foreground transition-all duration-500"
          >
            <Close className="w-5 h-5" />
          </button>
          <p className=" text-secondary-foreground font-semibold mb-2">
            Search Products
          </p>
          <form
            action=""
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center border border-border bg-home-bg-1 relative rounded-full transition-colors duration-300 focus-within:border-primary"
          >
            <span className="pl-4 text-gray-1-foreground shrink-0">
              <Search />
            </span>
            <div className="relative flex-1 min-w-0">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder=""
                aria-label="Search products"
                className="rounded-full focus-visible:ring-0 border-none bg-transparent"
              />
              {animatedPlaceholder}
            </div>
          </form>
          <div data-lenis-prevent className="max-h-[300px] overflow-y-auto">
            {searchProducts.map(({ id, title, slug }) => (
              <div key={id} className="py-2">
                <Link
                  href={productPath({ slug })}
                  className="text-secondary-foreground capitalize hover:text-secondary-foreground transition-all duration-500"
                >
                  {title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPopup;
