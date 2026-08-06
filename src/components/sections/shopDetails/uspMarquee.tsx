import { Headphones, RotateCcw, ShieldCheck, Truck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type UspItemType = {
  id: string;
  icon: LucideIcon;
  label: string;
};

export const defaultUspItems: UspItemType[] = [
  { id: "shipping", icon: Truck, label: "Fast & Free Shipping" },
  { id: "assistance", icon: Users, label: "Personalised Shopping Assistance" },
  {
    id: "manufacturers",
    icon: ShieldCheck,
    label: "350+ Verified Manufacturers",
  },
  { id: "returns", icon: RotateCcw, label: "Hassle-Free Returns & Exchanges" },
  { id: "support", icon: Headphones, label: "24/7 Customer Support" },
];

const SECONDS_PER_ITEM = 5.5;

const UspMarqueeTrack = ({
  items,
  ariaHidden,
}: {
  items: UspItemType[];
  ariaHidden?: boolean;
}) => (
  <ul
    role={ariaHidden ? undefined : "list"}
    aria-hidden={ariaHidden}
    className="flex items-center shrink-0"
  >
    {items.map(({ id, icon: Icon, label }, index) => (
      <li key={id} className="flex items-center shrink-0">
        <div className="flex items-center gap-2.5 px-5">
          <span className="flex items-center justify-center size-9 rounded-full bg-[#F2F2F2] text-gray-1-foreground shrink-0">
            <Icon className="size-4.5" strokeWidth={1.5} />
          </span>
          <span className="text-sm text-gray-1-foreground whitespace-nowrap">
            {label}
          </span>
        </div>
        {index < items.length - 1 && (
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-5"
          />
        )}
      </li>
    ))}
  </ul>
);

/**
 * Infinite horizontal marquee of USP (unique selling point) badges.
 * The item list is duplicated once so the CSS translateX(-50%) loop is seamless;
 * the duplicate is hidden from assistive tech to avoid repeated announcements.
 */
const UspMarquee = ({
  items = defaultUspItems,
  className,
}: {
  items?: UspItemType[];
  className?: string;
}) => {
  const duration = Math.max(items.length * SECONDS_PER_ITEM, 12);

  return (
    <div
      className={cn(
        "usp-marquee group relative w-full min-w-0 overflow-hidden mt-7.5 pt-7.5 border-t border-gray-2",
        className,
      )}
    >
      <div
        className="usp-marquee-track flex w-max motion-safe:animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        <UspMarqueeTrack items={items} />
        <UspMarqueeTrack items={items} ariaHidden />
      </div>
    </div>
  );
};

export default UspMarquee;
