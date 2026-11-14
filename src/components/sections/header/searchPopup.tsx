"use client";
import { Input } from "@/components/ui/input";
import { CardPriceEnhanced } from "@/components/ui/card";
import { Search, WhatsApp } from "@/lib/icon";
import { cn } from "@/lib/utils";
import type { CategoryLink } from "@/lib/categoryLinks";
import type { CategoryType } from "@/db/categoriesData";
import type { ProductType } from "@/types/productType";
import { ArrowUpLeft, History, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useProductSearch } from "@/lib/sdk/use-search";
import { productPath } from "@/lib/productPath";

const PLACEHOLDER_ROTATE_MS = 2500;
/** Mirrors `MIN_QUERY_LENGTH` in `use-search.ts`: below it the hook returns nothing. */
const MIN_QUERY_LENGTH = 2;
const RECENT_SEARCHES_KEY = "handsy:recent-searches";
const MAX_RECENT_SEARCHES = 5;
/** The business line used site-wide — Contact Us, B2B, the product page's Need Help card. */
const WHATSAPP_NUMBER = "919205028025";

type Variant = "desktop" | "mobile";

const optionId = (listboxId: string, variant: Variant, index: number) =>
  `${listboxId}-${variant}-option-${index}`;

const whatsappHref = (query: string) => {
  const message = query
    ? `Hi! I was searching for "${query}" on Handsy Market and could use some help.`
    : "Hi! I need some help finding a product on Handsy Market.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/* Recent searches live in this browser only. Storage can be unavailable
   (private mode, blocked site data), in which case the section just stays
   hidden. */
const readRecentSearches = (): string[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((term): term is string => typeof term === "string").slice(0, MAX_RECENT_SEARCHES)
      : [];
  } catch {
    return [];
  }
};

const writeRecentSearches = (terms: string[]) => {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(terms));
  } catch {
    // Not persisted; the in-memory list still works for this visit.
  }
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Bolds the parts of a title that match the typed words. */
const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
  const words = query.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (!words.length) return <>{text}</>;
  // A capturing split puts the matches at the odd indices.
  const parts = text.split(new RegExp(`(${words.join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="bg-transparent font-semibold text-secondary-foreground">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
};

const SearchPopup = ({
  categories = [],
  popularCategories = [],
}: {
  categories?: CategoryLink[];
  /** Image tiles shown before the shopper types — the homepage's featured strip. */
  popularCategories?: CategoryType[];
}) => {
  // Rotating placeholder ("Search for Pendants...") built from the real
  // catalogue; it used to name the template's categories, advertising a range
  // this store does not carry.
  const categoryLabels = categories.map(({ label }) => label);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  /* Server-side full-text search, debounced — see `useProductSearch`. The
     previous implementation filtered one preloaded page in the browser, so it
     could only ever find products that had already been shipped to the page. */
  const { results: searchProducts, isSearching } = useProductSearch(searchInput);
  const trimmedQuery = searchInput.trim();
  const hasQuery = trimmedQuery.length >= MIN_QUERY_LENGTH;
  const showResults = hasQuery && searchProducts.length > 0;
  const tiles = popularCategories.filter(({ value, href }) => Boolean(href ?? value));

  const closeAll = useCallback(() => {
    setIsOpen(false);
    setIsMobileOpen(false);
    setActiveIndex(-1);
  }, []);

  // A new result set invalidates whichever row the keyboard was on. Reset
  // during render rather than in an effect, so the stale row never paints.
  const [resultsShown, setResultsShown] = useState(searchProducts);
  if (resultsShown !== searchProducts) {
    setResultsShown(searchProducts);
    setActiveIndex(-1);
  }

  // Re-read on every open so a search made in another tab shows up too.
  const openDesktop = () => {
    if (!isOpen) setRecentSearches(readRecentSearches());
    setIsOpen(true);
  };

  const toggleMobile = () => {
    if (!isMobileOpen) setRecentSearches(readRecentSearches());
    setIsMobileOpen(!isMobileOpen);
  };

  useEffect(() => {
    if (!isOpen && !isMobileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closeAll();
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };

    // The desktop panel hangs off the sticky header, so a page scroll leaves
    // it floating over unrelated content. Close it, but keep what was typed so
    // refocusing picks up where the shopper left off. The mobile sheet locks
    // page scroll instead (below), so it needs no listener.
    const handleScroll = () => setIsOpen(false);

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    if (isOpen) window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, isMobileOpen, closeAll]);

  // Keep the page behind the full-screen mobile sheet still.
  useEffect(() => {
    if (!isMobileOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || categoryLabels.length <= 1) return;

    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % categoryLabels.length);
    }, PLACEHOLDER_ROTATE_MS);

    return () => clearInterval(timer);
  }, []);

  // Follow the keyboard selection when the list scrolls.
  useEffect(() => {
    if (activeIndex < 0) return;
    const variant: Variant = isMobileOpen ? "mobile" : "desktop";
    document.getElementById(optionId(listboxId, variant, activeIndex))?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isMobileOpen, listboxId]);

  const rememberSearch = (query: string) => {
    const term = query.trim();
    if (term.length < MIN_QUERY_LENGTH) return;
    const next = [term, ...recentSearches.filter((saved) => saved.toLowerCase() !== term.toLowerCase())].slice(
      0,
      MAX_RECENT_SEARCHES,
    );
    setRecentSearches(next);
    writeRecentSearches(next);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    writeRecentSearches([]);
  };

  const finishSearch = () => {
    rememberSearch(searchInput);
    setSearchInput("");
    closeAll();
  };

  const openProduct = (product: ProductType) => {
    finishSearch();
    desktopInputRef.current?.blur();
    router.push(productPath(product));
  };

  const applySearch = (term: string, variant: Variant) => {
    setSearchInput(term);
    (variant === "desktop" ? desktopInputRef : mobileInputRef).current?.focus();
  };

  const clearInput = (variant: Variant) => {
    setSearchInput("");
    (variant === "desktop" ? desktopInputRef : mobileInputRef).current?.focus();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showResults) return;
    const count = searchProducts.length;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % count);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? count - 1 : index - 1));
    } else if (event.key === "Enter") {
      // Enter opens the highlighted product, or the best match if none is.
      event.preventDefault();
      openProduct(searchProducts[Math.max(activeIndex, 0)]!);
    }
  };

  const animatedPlaceholder = searchInput.trim() === "" && (
    <span
      key={placeholderIndex}
      aria-hidden
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 truncate max-w-[calc(100%-24px)] text-gray-1-foreground/70 text-[15px] animate-in fade-in slide-in-from-bottom-1 duration-500 fill-mode-both"
    >
      {categoryLabels.length ? `Search for ${categoryLabels[placeholderIndex]}...` : "Search products..."}
    </span>
  );

  const searchField = (variant: Variant) => {
    const expanded = variant === "desktop" ? isOpen : isMobileOpen;
    return (
      <form
        role="search"
        action=""
        onSubmit={(e) => e.preventDefault()}
        className={cn(
          "flex items-center rounded-full border transition-all duration-300 focus-within:border-primary focus-within:bg-background focus-within:shadow-[0_0_0_4px_rgba(26,26,25,0.06)]",
          expanded ? "border-primary bg-background" : "border-border bg-home-bg-1 hover:border-gray-2",
        )}
      >
        <span className="pl-4 text-gray-1-foreground shrink-0">
          <Search className="size-5" />
        </span>
        <div className="relative flex-1 min-w-0">
          <Input
            ref={variant === "desktop" ? desktopInputRef : mobileInputRef}
            value={searchInput}
            autoFocus={variant === "mobile"}
            onFocus={variant === "desktop" ? openDesktop : undefined}
            onClick={variant === "desktop" ? openDesktop : undefined}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (variant === "desktop") openDesktop();
            }}
            onKeyDown={handleInputKeyDown}
            placeholder=""
            aria-label="Search products"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={expanded && showResults}
            aria-controls={`${listboxId}-${variant}-listbox`}
            aria-activedescendant={activeIndex >= 0 ? optionId(listboxId, variant, activeIndex) : undefined}
            autoComplete="off"
            enterKeyHint="search"
            className="h-11 rounded-full focus-visible:ring-0 border-none bg-transparent text-[15px]"
          />
          {animatedPlaceholder}
        </div>
        <div className="flex items-center gap-1 pr-2 shrink-0">
          {isSearching && (
            <Loader2 aria-label="Searching" className="size-4 animate-spin text-gray-1-foreground" />
          )}
          {searchInput && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => clearInput(variant)}
              className="flex size-7 items-center justify-center rounded-full text-gray-1-foreground transition-colors duration-200 hover:bg-black/[0.05] hover:text-secondary-foreground cursor-pointer animate-in fade-in zoom-in-75 duration-200"
            >
              <X className="size-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </form>
    );
  };

  const recentSection = (variant: Variant) =>
    recentSearches.length > 0 && (
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-secondary-foreground">Recent Searches</h3>
          <button
            type="button"
            onClick={clearRecentSearches}
            className="text-xs text-gray-1-foreground underline-offset-4 transition-colors duration-200 hover:text-secondary-foreground hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {recentSearches.map((term) => (
            <li key={term}>
              <button
                type="button"
                onClick={() => applySearch(term, variant)}
                className="group/chip inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-home-bg-1 px-3.5 py-1.5 text-sm text-secondary-foreground transition-all duration-300 hover:-translate-y-px hover:border-primary hover:bg-background cursor-pointer"
              >
                <History className="size-3.5 shrink-0 text-gray-1-foreground" strokeWidth={1.75} />
                <span className="truncate">{term}</span>
                <ArrowUpLeft
                  className="size-3.5 shrink-0 text-gray-1-foreground transition-transform duration-300 group-hover/chip:-translate-x-px group-hover/chip:-translate-y-px"
                  strokeWidth={1.75}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>
    );

  const categoriesSection = tiles.length > 0 && (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-secondary-foreground">Popular Categories</h3>
      <ul className="grid grid-cols-3 sm:grid-cols-6 gap-x-3 gap-y-4">
        {tiles.map(({ id, categoryName, categoryImg, value, href }) => (
          <li key={id}>
            <Link
              href={href ?? `/category/${value}`}
              onClick={closeAll}
              className="group/tile flex flex-col items-center gap-2 text-center"
            >
              <span className="relative block w-full aspect-square overflow-hidden rounded-full bg-home-bg-1 ring-1 ring-border transition-all duration-300 group-hover/tile:-translate-y-0.5 group-hover/tile:ring-primary group-hover/tile:shadow-3xl">
                <Image
                  src={categoryImg}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 90px, 30vw"
                  className="object-cover transition-transform duration-500 group-hover/tile:scale-105"
                />
              </span>
              <span className="line-clamp-2 text-xs sm:text-[13px] leading-tight text-gray-1-foreground transition-colors duration-200 group-hover/tile:text-secondary-foreground">
                {categoryName}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );

  const resultsSection = (variant: Variant) => (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-secondary-foreground">Products</h3>
      <ul id={`${listboxId}-${variant}-listbox`} role="listbox" aria-label="Product suggestions" className="-mx-2">
        {searchProducts.map((product, index) => (
          <li key={product.id} id={optionId(listboxId, variant, index)} role="option" aria-selected={index === activeIndex}>
            <Link
              href={productPath(product)}
              onClick={finishSearch}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-200",
                index === activeIndex && "bg-home-bg-1",
              )}
            >
              <span className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-lg bg-home-bg-1 ring-1 ring-border">
                <Image src={product.thumbnail} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1 line-clamp-2 text-sm sm:text-[15px] leading-snug text-gray-1-foreground capitalize">
                <HighlightMatch text={product.title} query={trimmedQuery} />
              </span>
              <CardPriceEnhanced
                price={product.price}
                discountPercentage={product.discountPercentage}
                finalPrice={product.sellingPrice}
                currency={product.currency}
                className="shrink-0 mt-0 text-right text-sm leading-tight text-secondary-foreground [&>del]:block [&>del]:text-xs"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );

  const loadingSection = (
    <div aria-hidden className="space-y-3">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3 animate-pulse">
          <span className="size-12 sm:size-14 shrink-0 rounded-lg bg-home-bg-1" />
          <span className="h-3 flex-1 rounded-full bg-home-bg-1" />
          <span className="h-3 w-14 rounded-full bg-home-bg-1" />
        </div>
      ))}
    </div>
  );

  const panelBody = (variant: Variant) => {
    if (showResults) return resultsSection(variant);
    if (hasQuery && isSearching) return loadingSection;
    if (hasQuery) {
      return (
        <div className="space-y-6">
          <div className="py-4 text-center">
            <p className="font-medium text-secondary-foreground">
              No matches for &ldquo;{trimmedQuery}&rdquo;
            </p>
            <p className="mt-1 text-sm text-gray-1-foreground">
              Check the spelling, try a broader term, or browse a category below.
            </p>
          </div>
          {categoriesSection}
        </div>
      );
    }
    return (
      <div className="space-y-6">
        {recentSection(variant)}
        {categoriesSection}
      </div>
    );
  };

  const needHelp = (
    <div className="flex items-center gap-3 border-t border-border bg-home-bg-1 px-4 py-3 sm:px-5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E]">
        <WhatsApp className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-secondary-foreground">Need Help?</p>
        <p className="text-xs leading-snug text-gray-1-foreground">
          Can&apos;t find what you&apos;re looking for? Chat with our team.
        </p>
      </div>
      <a
        href={whatsappHref(trimmedQuery)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 after:absolute after:-inset-2 after:content-[''] text-xs font-medium text-white transition-all duration-300 hover:-translate-y-px hover:shadow-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <WhatsApp className="size-3.5 text-[#25D366]" />
        WhatsApp
      </a>
    </div>
  );

  return (
    <div ref={popupRef} className="relative w-full">
      {/* Persistent inline search bar (tablet & desktop) */}
      <div className="hidden md:block">{searchField("desktop")}</div>
      {isOpen && (
        <div className="hidden md:flex absolute top-full left-0 z-50 mt-2 w-full max-h-[min(70vh,600px)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-3xl animate-in fade-in slide-in-from-top-2 duration-200 motion-reduce:animate-none">
          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
            {panelBody("desktop")}
          </div>
          {needHelp}
        </div>
      )}

      {/* Compact icon trigger (mobile only) */}
      <div className="md:hidden flex justify-end">
        <button
          aria-label="search-icon"
          onClick={toggleMobile}
          className={cn(
            "text-gray-1-foreground -rotate-90 cursor-pointer p-1.5 -m-1.5 rounded-full transition-colors duration-300 hover:bg-black/[0.04] active:bg-black/[0.06]"
          )}
        >
          <Search />
        </button>
      </div>
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            aria-hidden
            onClick={closeAll}
            className="absolute inset-0 touch-none bg-black/40 animate-in fade-in duration-200 motion-reduce:animate-none"
          />
          {/* Capped short of the viewport so the floating bottom nav, which
              stacks above the header, never covers the Need Help footer. */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="relative flex max-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-b-3xl bg-background shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 motion-reduce:animate-none"
          >
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <div className="flex-1 min-w-0">{searchField("mobile")}</div>
              <button
                type="button"
                onClick={closeAll}
                className="shrink-0 text-sm font-medium text-gray-1-foreground transition-colors duration-200 hover:text-secondary-foreground cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-1 pb-5">
              {panelBody("mobile")}
            </div>
            {needHelp}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPopup;
