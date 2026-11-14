"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CategoryType } from "@/db/categoriesData";
import { TAG_GROUPS, tagGroupOf } from "@/lib/catalog/tagGroups";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import PriceRangeSlider from "./priceRangeSlider";

/**
 * Filter panel — the content of the shared `FilterDrawer`. Used by every
 * listing: the catalogue pages drive it from the URL, the vendor pages from
 * local state; this component only renders and reports changes.
 *
 * Categories nest under their parent (empty ones are left out), extra
 * single-choice groups (e.g. a directory's Location) render the same way,
 * price is the shared range slider, and product tags are split into the
 * groups in `tagGroups.ts`. Sections start open when they hold a selection,
 * so a returning shopper sees what is applied.
 */

/** Radio value for "All …" — an empty string reads as "no selection" to the radio group. */
const ALL_OPTIONS = "__all";

export type FilterOption = { value: string; label: string; count?: number; depth?: number };

/** A single-choice section; `selected` is "" when nothing is chosen. */
export type FilterOptionGroup = {
  id: string;
  label: string;
  allLabel: string;
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
};

/** Categories with products, each followed by its own subcategories. */
function nestCategories(categories: CategoryType[]): FilterOption[] {
  const withProducts = categories.filter((c) => (c.productCount ?? 0) > 0);
  const ids = new Set(withProducts.map((c) => String(c.id)));
  const childrenOf = (parentId: string) => withProducts.filter((c) => c.parentId === parentId);
  const walk = (list: CategoryType[], depth: number): FilterOption[] =>
    list.flatMap((c) => [
      { value: c.value ?? String(c.id), label: c.categoryName, depth, count: c.productCount },
      ...walk(childrenOf(String(c.id)), depth + 1),
    ]);
  return walk(withProducts.filter((c) => !c.parentId || !ids.has(c.parentId)), 0);
}

const SectionTitle = ({ label, selectedCount }: { label: string; selectedCount: number }) => (
  <span className="flex items-center gap-2 text-base font-medium text-secondary-foreground">
    {label}
    {selectedCount > 0 && (
      <span className="flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-white">
        {selectedCount}
      </span>
    )}
  </span>
);

const RadioSection = ({ id, label, allLabel, options, selected, onChange }: FilterOptionGroup) => (
  <AccordionItem value={id} className="border-border">
    <AccordionTrigger className="py-5 hover:no-underline [&_svg]:size-4">
      <SectionTitle label={label} selectedCount={selected ? 1 : 0} />
    </AccordionTrigger>
    <AccordionContent className="pb-5">
      <RadioGroup
        value={selected || ALL_OPTIONS}
        onValueChange={(value) => onChange(value === ALL_OPTIONS ? "" : value)}
        aria-label={label}
        className="gap-0.5"
      >
        {[{ value: ALL_OPTIONS, label: allLabel } as FilterOption, ...options].map(({ value, label: optionLabel, depth, count }) => (
          <label
            key={value}
            style={depth ? { paddingLeft: 8 + depth * 20 } : undefined}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-home-bg-1"
          >
            <RadioGroupItem value={value} />
            <span
              className={cn(
                "flex-1 text-[15px] capitalize",
                (selected || ALL_OPTIONS) === value ? "text-secondary-foreground font-medium" : "text-gray-1-foreground"
              )}
            >
              {optionLabel}
            </span>
            {count !== undefined && <span className="text-sm text-gray-3-foreground">{count}</span>}
          </label>
        ))}
      </RadioGroup>
    </AccordionContent>
  </AccordionItem>
);

const ShopSidebar = ({
  isSidebarCategoryHide,
  isSidebarTagsHide,
  categories = [],
  optionGroups = [],
  tags = [],
  priceBounds,
  selected,
  currency = "USD",
  onCategoryChange,
  onTagToggle,
  onPriceApply,
}: {
  isSidebarCategoryHide?: boolean;
  isSidebarTagsHide?: boolean;
  categories?: CategoryType[];
  /** Extra single-choice sections, rendered after Category. */
  optionGroups?: FilterOptionGroup[];
  tags?: string[];
  priceBounds?: { min: number; max: number };
  selected?: { category: string; tags: string[]; minPrice?: number; maxPrice?: number };
  currency?: string;
  onCategoryChange?: (slug: string) => void;
  onTagToggle?: (tag: string) => void;
  /** Omit to hide the Price section (e.g. a listing of vendors). */
  onPriceApply?: (range: [number, number]) => void;
}) => {
  const current = selected ?? { category: "", tags: [] };
  const categoryOptions = isSidebarCategoryHide ? [] : nestCategories(categories);
  const radioGroups: FilterOptionGroup[] = [
    ...(categoryOptions.length
      ? [{
          id: "category",
          label: "Category",
          allLabel: "All categories",
          options: categoryOptions,
          selected: current.category,
          onChange: (value: string) => onCategoryChange?.(value),
        }]
      : []),
    ...optionGroups,
  ];
  const hasPrice = current.minPrice !== undefined || current.maxPrice !== undefined;
  const tagSections = isSidebarTagsHide
    ? []
    : [...TAG_GROUPS, { id: "more", label: "More" } as const]
        .map(({ id, label }) => {
          const sectionTags = tags.filter((tag) => tagGroupOf(tag) === id);
          return { id, label, tags: sectionTags, selectedCount: sectionTags.filter((t) => current.tags.includes(t)).length };
        })
        .filter((section) => section.tags.length > 0);

  // Open by default: anything with a selection, plus the everyday sections.
  const defaultOpen = [
    ...radioGroups.map((group) => group.id),
    "price",
    ...tagSections.filter((s) => s.id !== "more" || s.selectedCount > 0).map((s) => s.id),
  ];

  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="[&>[data-slot=accordion-item]:last-child]:border-b-0">
      {radioGroups.map((group) => (
        <RadioSection key={group.id} {...group} />
      ))}

      {onPriceApply && (
        <AccordionItem value="price" className="border-border">
          <AccordionTrigger className="py-5 hover:no-underline [&_svg]:size-4">
            <SectionTitle label="Price" selectedCount={hasPrice ? 1 : 0} />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <PriceRangeSlider
              min={priceBounds?.min}
              max={priceBounds?.max}
              currency={currency}
              value={hasPrice ? [current.minPrice ?? priceBounds?.min ?? 0, current.maxPrice ?? priceBounds?.max ?? 0] : undefined}
              onApply={onPriceApply}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      {tagSections.map(({ id, label, tags: sectionTags, selectedCount }) => (
        <AccordionItem key={id} value={id} className="border-border">
          <AccordionTrigger className="py-5 hover:no-underline [&_svg]:size-4">
            <SectionTitle label={label} selectedCount={selectedCount} />
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <div className="flex flex-wrap gap-2">
              {sectionTags.map((tag) => {
                const isActive = current.tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    aria-pressed={isActive}
                    onClick={() => onTagToggle?.(tag)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm capitalize transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      isActive
                        ? "border-primary bg-primary text-white"
                        : "border-border text-gray-1-foreground hover:border-primary hover:text-secondary-foreground"
                    )}
                  >
                    {isActive && <Check className="size-3.5" strokeWidth={2} aria-hidden />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ShopSidebar;
