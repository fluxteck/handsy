"use client";
import { useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Close } from "@/lib/icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * The site's one filter drawer: a Filter button (with a badge counting what is
 * applied) that slides the filter panel in from the left, with Clear all and a
 * "Show N results" footer. Every listing — catalogue, vendor storefront, vendor
 * directory — renders its `ShopSidebar` inside this, and sits it in the
 * `ProductSorting` row via `filterSlot`. Same `Sheet` and header treatment as
 * the cart drawer.
 */
const FilterDrawer = ({
  activeCount,
  resultLabel,
  onClearAll,
  children,
}: {
  /** Filters currently applied, for the button badge and Clear all. */
  activeCount: number;
  /** Footer button text, e.g. "Show 12 products". */
  resultLabel: string;
  onClearAll: () => void;
  /** The filter panel — a `ShopSidebar`. */
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <SlidersHorizontal className="size-4" strokeWidth={1.5} />
          Filter
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[86%] sm:max-w-[380px] gap-0 p-0 flex flex-col [&_.close-orginal]:hidden"
      >
        <SheetHeader className="px-6 py-5 flex flex-row justify-between items-center space-y-0 shrink-0 border-b border-border">
          <SheetTitle className="text-secondary-foreground font-medium text-lg lg:text-xl leading-[150%]">
            Filters
          </SheetTitle>
          <SheetClose
            aria-label="Close filters"
            className="flex items-center justify-center size-9 lg:size-10 shrink-0 rounded-full bg-home-bg-1 text-gray-1-foreground hover:text-secondary-foreground transition-all duration-300 mt-0"
          >
            <Close className="size-4 lg:size-4.5" />
          </SheetClose>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6">{children}</div>
        <div className="flex shrink-0 items-center gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" size="sm" disabled={activeCount === 0} onClick={onClearAll} className="flex-1">
            Clear all
          </Button>
          <SheetClose asChild>
            <Button size="sm" className="flex-[1.4]">
              {resultLabel}
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
