import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultMessages = [
  "Get 8% off on your first order — use code WELCOME8",
  "Free shipping on prepaid orders",
  "Handcrafted by 350+ verified artisans",
];

const CartOfferMarqueeTrack = ({
  messages,
  ariaHidden,
}: {
  messages: string[];
  ariaHidden?: boolean;
}) => (
  <ul
    role={ariaHidden ? undefined : "list"}
    aria-hidden={ariaHidden}
    className="flex items-center shrink-0"
  >
    {messages.map((message, index) => (
      <li key={index} className="flex items-center gap-2 px-6 shrink-0">
        <Sparkles className="size-3.5 text-primary shrink-0" strokeWidth={1.5} />
        <span className="text-xs font-medium text-secondary-foreground whitespace-nowrap">
          {message}
        </span>
      </li>
    ))}
  </ul>
);

/**
 * Compact promo-text marquee for the cart drawer header, reusing the same seamless
 * duplicate-track + `animate-marquee` approach as shopDetails/uspMarquee.tsx (see
 * globals.css), just with plain text instead of icon badges.
 */
const CartOfferMarquee = ({
  messages = defaultMessages,
  className,
}: {
  messages?: string[];
  className?: string;
}) => (
  <div
    className={cn(
      "usp-marquee relative w-full min-w-0 overflow-hidden bg-home-bg-1",
      className
    )}
  >
    <div className="flex w-max motion-safe:animate-marquee">
      <CartOfferMarqueeTrack messages={messages} />
      <CartOfferMarqueeTrack messages={messages} ariaHidden />
    </div>
  </div>
);

export default CartOfferMarquee;
