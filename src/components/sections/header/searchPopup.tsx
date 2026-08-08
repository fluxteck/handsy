"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Close, Search } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { menuList } from "@/db/menuList";
import { ProductType } from "@/types/productType";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const categoryLabels = menuList.map(({ label }) => label);
const PLACEHOLDER_ROTATE_MS = 2500;

const SearchPopup = ({ data }: { data: ProductType[] }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchProducts, setSearchProducts] = useState<ProductType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isInteractingWithSelect, setIsInteractingWithSelect] = useState(false);

  useEffect(() => {
    if (searchInput.trim() !== "") {
      const filteredProducts = data.filter(({ title }) =>
        title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
      );
      setSearchProducts(filteredProducts);
      setIsOpen(true);
    } else {
      setSearchProducts([]);
      setIsOpen(false);
    }
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        if (!isInteractingWithSelect) {
          setIsOpen(false);
          setIsMobileOpen(false);
        }
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
      setIsMobileOpen(false);
      setSearchProducts([]);
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
  }, [isOpen, isMobileOpen, isInteractingWithSelect]);

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
      Search for {categoryLabels[placeholderIndex]}...
    </span>
  );

  const resultsDropdown = searchProducts.length > 0 && (
    <div className="hidden md:block absolute top-full left-0 mt-2 w-full bg-background shadow-lg rounded-md border border-border max-h-[300px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      {searchProducts.map(({ id, title }) => (
        <div key={id} className="px-4 py-2">
          <Link
            href={"#"}
            className="text-secondary-foreground capitalize hover:text-secondary-foreground transition-all duration-500"
          >
            {title}
          </Link>
        </div>
      ))}
    </div>
  );

  const categorySelect = (
    <div
      className="relative shrink-0"
      onPointerDown={() => setIsInteractingWithSelect(true)}
      onPointerUp={() => setIsInteractingWithSelect(false)}
    >
      <Select>
        <SelectTrigger className="sm:min-w-[150px] w-28 shrink-0 rounded-none border-none text-secondary-foreground text-sm sm:text-base capitalize pr-5 after:absolute after:right-0 after:h-[50%] after:w-px after:bg-border">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-background rounded-none">
          <SelectItem
            value="bed room"
            className="capitalize text-base focus:bg-gray-200"
          >
            bed room
          </SelectItem>
          <SelectItem
            value="living room"
            className="capitalize text-base focus:bg-gray-200"
          >
            living room
          </SelectItem>
          <SelectItem
            value="office"
            className="capitalize text-base focus:bg-gray-200"
          >
            office
          </SelectItem>
        </SelectContent>
      </Select>
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
        {categorySelect}
        <span className="pl-1 text-gray-1-foreground shrink-0">
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
        <div className="fixed top-16 left-0 w-full bg-background [&_.close-orginal]:hidden pt-5 pb-6 px-5 shadow-lg rounded-b-md z-50">
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
            className="flex items-center border border-primary relative rounded-md"
          >
            {categorySelect}
            <div className="relative flex-1 min-w-0">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder=""
                aria-label="Search products"
                className="rounded-none focus-visible:ring-0 border-none h-10 py-1.5"
              />
              {animatedPlaceholder}
            </div>
            <div className="bg-primary text-white flex items-center justify-center p-2.5 cursor-pointer rounded-tr-md rounded-br-md self-stretch">
              <span className="-rotate-90">
                <Search className="size-4" />
              </span>
            </div>
          </form>
          <div className="max-h-[300px] overflow-y-auto">
            {searchProducts.map(({ id, title }) => (
              <div key={id} className="py-2">
                <Link
                  href={"#"}
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
