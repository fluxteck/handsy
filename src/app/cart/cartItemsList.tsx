"use client";
import { Trash2 } from "lucide-react";
import { Minus, Plus, ShopCart } from "@/lib/icon";
import { useCart } from "@/lib/cart/cart-context";
import ShopEmptyState from "@/components/ui/shopEmptyState";
import Image from "next/image";
import currencyFormatter from "currency-formatter";
import type { CategoryLink } from "@/lib/categoryLinks";

const CartItemsList = ({ categories = [] }: { categories?: CategoryLink[] }) => {
  const { products, increment, decrement, remove, currency } = useCart();
  const money = (amount: number) =>
    currencyFormatter.format(amount, { code: currency || "INR" });

  if (!products.length) {
    return (
      <ShopEmptyState
        categories={categories}
        icon={ShopCart}
        title="Your Cart is Empty"
        description="Let's fill it with something you'll love"
        ctaLabel="Continue Shopping"
        ctaHref="/shop"
      />
    );
  }

  return (
    <div className="flex flex-col">
      {products.map((line) => (
        <div
          key={line.id}
          className="flex items-start justify-between gap-3 py-4 border-b border-b-[#c9c2b8] last:border-b-0"
        >
          <div className="flex items-start gap-3 min-w-0">
            <Image
              width={64}
              height={64}
              src={line.thumbnail}
              alt={line.title}
              className="bg-white size-16 object-contain rounded-md shrink-0"
            />
            <div className="min-w-0">
              <p className="text-secondary-foreground text-sm font-medium truncate">
                {line.title}
              </p>
              {line.variantTitle ? (
                <p className="text-xs text-gray-1-foreground mt-0.5">
                  {line.variantTitle}
                </p>
              ) : null}
              <div className="flex items-center gap-3 mt-2">
                <div className="rounded-full border border-gray-2 text-secondary-foreground flex items-center gap-2 px-2 py-1">
                  <span
                    onClick={() => void decrement(line.id)}
                    className="cursor-pointer h-4 w-4 inline-flex items-center justify-center"
                  >
                    <Minus />
                  </span>
                  <input
                    value={line.quantity}
                    readOnly
                    className="outline-none w-4 text-center text-xs"
                  />
                  <span
                    onClick={() => void increment(line.id)}
                    className="cursor-pointer h-4 w-4 inline-flex items-center justify-center"
                  >
                    <Plus />
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${line.title} from cart`}
                  onClick={() => void remove(line.id)}
                  className="flex items-center justify-center size-6 rounded-full text-destructive hover:bg-destructive hover:text-white transition-colors duration-200"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-secondary-foreground text-sm font-semibold whitespace-nowrap">
            {money(line.price * line.quantity)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CartItemsList;
