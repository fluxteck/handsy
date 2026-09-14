"use client";
import { Plus } from "@/lib/icon";
import { useCart } from "@/lib/cart/cart-context";
import { ProductType } from "@/types/productType";
import currencyFormatter from "currency-formatter";

/**
 * One recommended add-on, drawn from the same real top-rated-products feed
 * the cart drawer's "You might also like" rail uses (see cartCrossSell.tsx) —
 * never a fabricated pairing. Hidden once every candidate is already in the
 * cart, or none were fetched.
 */
const CheckoutUpsell = ({ candidates }: { candidates: ProductType[] }) => {
  const { products, add, currency } = useCart();
  const product = candidates.find(
    (candidate) =>
      // Sample/placeholder catalogue entries have no variant and no real
      // price — never worth recommending, and add() would just reject them.
      Boolean(candidate.variantId) &&
      candidate.price > 0 &&
      !products.some((line) => line.productId === String(candidate.id)),
  );
  if (!product) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#EAF1E1] px-4 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#3F5B2F] truncate">
          Add: {product.title}
        </p>
        <p className="text-xs text-[#5C7A4A]">
          You might also like · {currencyFormatter.format(product.price, { code: currency || "INR" })}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Add ${product.title} to cart`}
        onClick={() =>
          void add({
            variantId: product.variantId,
            quantity: 1,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
            currency: product.currency,
          })
        }
        className="shrink-0 flex items-center gap-1 rounded-full bg-[#5B7F4A] text-white text-xs font-medium px-3.5 py-2 hover:opacity-90 transition-opacity"
      >
        <Plus className="size-3" />
        Add
      </button>
    </div>
  );
};

export default CheckoutUpsell;
