"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import Link from "next/link";
import currencyFormatter from "currency-formatter";
import PromoCodeForm from "./promoCodeForm";
import CartUpsell from "./cartUpsell";
import { ProductType } from "@/types/productType";

const CartSummary = ({ upsellCandidates }: { upsellCandidates: ProductType[] }) => {
  /* Subtotal, tax and total are the SERVER's, never re-derived here:
     discounts, rounding and any per-line adjustments are its business, and a
     client-side sum would drift from what checkout actually charges. */
  const { products, itemCount, subTotal, tax, total, currency } = useCart();
  const money = (amount: number) =>
    currencyFormatter.format(amount, { code: currency || "INR" });

  if (!products.length) return null;

  return (
    <div>
      <p className="text-lg font-semibold text-secondary-foreground">
        Order summary
      </p>

      <div className="mt-3">
        <PromoCodeForm />
      </div>

      <div className="mt-3">
        <CartUpsell candidates={upsellCandidates} />
      </div>

      <div className="mt-3 pt-3 border-t border-t-[#c9c2b8] flex flex-col gap-1.5">
        <div className="flex justify-between">
          <p className="text-sm text-gray-1-foreground">
            Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <p className="text-sm text-secondary-foreground font-medium">{money(subTotal)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-1-foreground">Tax</p>
          <p className="text-sm text-secondary-foreground font-medium">{money(tax)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-t-[#c9c2b8]">
        <p className="text-lg font-semibold text-secondary-foreground">Total</p>
        <p className="text-lg font-semibold text-secondary-foreground">{money(total || subTotal)}</p>
      </div>

      <Button asChild size="sm" className="w-full mt-3 h-8 text-xs">
        <Link href={"/checkout"}>Proceed to checkout</Link>
      </Button>

      <p className="text-center text-xs text-gray-1-foreground mt-2.5">
        Secure checkout · Free 15-day returns
      </p>
    </div>
  );
};

export default CartSummary;
