"use client";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "@/lib/icon";
import calcluteDiscount from "@/lib/calcluteDiscount";
import { useCart } from "@/lib/cart/cart-context";
import { ProductType } from "@/types/productType";
import currencyFormatter from "currency-formatter";

/**
 * Compact cart-drawer cross-sell cards. Deliberately not reusing components/ui/card.tsx
 * (Card/CardHeader/...) — that layout is built for grid/carousel product listings with
 * hover-reveal icon overlays and doesn't fit a ~420px-wide drawer, so this is a smaller,
 * drawer-specific presentation of the same ProductType data.
 */
const CartCrossSell = ({ products }: { products: ProductType[] }) => {
  const { add, currency } = useCart();

  if (!products.length) return null;

  return (
    <div>
      <p className="text-sm font-medium text-secondary-foreground">You might also like</p>
      <div className="mt-3 flex gap-3.5 overflow-x-auto scrollbar-hidden -mx-7.5 px-7.5">
        {products.map((product) => {
          const finalPrice = product.discountPercentage
            ? calcluteDiscount(product.price, product.discountPercentage)
            : product.price;

          return (
            <div
              key={product.id}
              className="flex flex-col gap-2.5 shrink-0 w-[120px]"
            >
              <Link
                href="/product-details"
                aria-label={`View ${product.title}`}
                className="bg-home-bg-1 rounded-xl overflow-hidden block"
              >
                <Image
                  src={product.thumbnail}
                  width={120}
                  height={120}
                  sizes="120px"
                  alt={product.title}
                  className="w-full aspect-square object-cover"
                />
              </Link>
              <div>
                <p className="text-xs text-secondary-foreground capitalize line-clamp-1">
                  {product.title}
                </p>
                <p className="text-sm font-medium text-secondary-foreground mt-0.5">
                  {currencyFormatter.format(finalPrice, { code: currency || "INR" })}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Add ${product.title} to cart`}
                onClick={() =>
                  /* Price and totals are the server's to decide: send the
                     variant and quantity, render whatever cart comes back.
                     The rest just seeds the optimistic line. */
                  void add({
                    variantId: product.variantId,
                    quantity: 1,
                    title: product.title,
                    thumbnail: product.thumbnail,
                    price: product.price,
                    currency: product.currency,
                  })
                }
                className="w-full flex items-center justify-center gap-1 rounded-full border border-primary text-secondary-foreground text-xs font-medium py-1.5 hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Plus className="size-3" />
                Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartCrossSell;
