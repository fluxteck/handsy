"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Heart } from "@/lib/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import calcluteDiscount from "@/lib/calcluteDiscount";
import { useCart } from "@/lib/cart/cart-context";
import UspMarquee from "@/components/sections/shopDetails/uspMarquee";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { getStoreCurrency } from "@/lib/config";

export type ProductColorType = {
  code: string;
  label: string;
  image: string;
};

export type ProductOfferType = {
  code: string;
  description: string;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

export interface ProductInfoDetailsPropsType {
  id: number | string;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  stock: number;
  colors: ProductColorType[];
  offers: ProductOfferType[];
  /**
   * Variant to buy when there is no colour/variant picker to choose from —
   * Quick View renders catalogue cards, whose list mapping carries a default
   * variant but no swatch list. The picker still wins when present.
   */
  variantId?: string;
  /** Short product description shown under the price. Omit to match the original PDP layout, which surfaces the full description via the accordion instead. */
  description?: string;
  /** Trims the panel to just what's needed for a fast purchase decision — hides the trust-badge marquee and delivery pincode checker. Used by Quick View; the PDP omits it so its full layout is unchanged. */
  compact?: boolean;
  /** Makes the title a link to the product's PDP. Omit on the PDP itself, where the title is already the page you're on. */
  titleHref?: string;
  /** Product slug, carried so a wishlist entry saved from here still links
   *  back to the product. Server-hydrated entries get it from the catalogue;
   *  this covers the guest path. */
  slug?: string;
}

const ProductInfoDetails = ({
  id,
  title,
  price,
  discountPercentage,
  thumbnail,
  stock,
  colors,
  offers,
  variantId,
  description,
  compact = false,
  titleHref,
  slug,
}: ProductInfoDetailsPropsType) => {
  const { add: addToCartLine } = useCart();
  const { add: addToWishlistEntry, has } = useWishlist();
  const [selectedColor, setSelectedColor] = useState<ProductColorType>(
    colors[0] ?? { code: "", label: "", image: thumbnail }
  );
  const [productQuantity, setProductQuantity] = useState(1);
  /* Derived from the real wishlist, not local state: initialising to `false`
     showed an unfilled heart for products already saved, and filled it on
     click even when the save failed. */
  const isWishlisted = has(id);
  const [pincode, setPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  const finalPrice = discountPercentage ? calcluteDiscount(price, discountPercentage) : price;

  const handleProductQuantity = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setProductQuantity((prev) => prev + 1);
    } else {
      setProductQuantity((prev) => (prev === 1 ? prev : prev - 1));
    }
  };

  /*
   * `selectedColor.code` carries the VARIANT ID on catalogue-backed products —
   * `toProductDetail` maps each variant into this list, using the variant id as
   * `code` (the picker only ever uses it as an identity, never as a colour).
   * That makes the chosen swatch the chosen variant, which is exactly what the
   * server's cart keys a line on.
   */
  const handleAddToCart = () => {
    void addToCartLine({
      variantId: selectedColor.code || variantId,
      quantity: productQuantity,
      title,
      thumbnail,
      price: finalPrice,
      currency: getStoreCurrency(),
    });
  };

  const handleWishlist = () => {
    /* The wishlist stores the PRODUCT; the server keys it by product id, and
       re-reads title/price/image live so a saved item never shows stale
       details. The chosen colour rides along for display only. */
    void addToWishlistEntry({
      id,
      ...(slug ? { slug } : {}),
      title,
      description: "",
      price,
      currency: getStoreCurrency(),
      discountPercentage,
      rating: 0,
      totalRating: "0",
      stock,
      brand: "",
      label: "",
      category: "",
      thumbnail,
      colors: [],
      filter: "",
      images: [],
    });
  };

  const handleCheckDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryEstimate("Please enter a valid 6-digit pincode");
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + 5);
    setDeliveryEstimate(
      `Estimated delivery by ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    );
  };

  return (
    <div className="min-w-0">
      {titleHref ? (
        <Link
          href={titleHref}
          className="text-secondary-foreground text-heading font-semibold capitalize block hover:text-gray-1-foreground transition-colors duration-300"
        >
          {title}
        </Link>
      ) : (
        <strong className="text-secondary-foreground text-heading font-semibold capitalize block">
          {title}
        </strong>
      )}

      <p className="text-xl lg:text-2xl xl:text-3xl text-secondary-foreground mt-4">
        {currencyFormatter.format(finalPrice)}{" "}
        {discountPercentage ? (
          <del className="text-gray-3-foreground text-lg lg:text-xl">
            {currencyFormatter.format(price)}
          </del>
        ) : null}
      </p>
      <p className="text-gray-3-foreground text-sm mt-1">Tax included</p>

      {description && (
        <p className="text-gray-1-foreground leading-[170%] mt-4 line-clamp-3">
          {description}
        </p>
      )}

      {colors.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-1-foreground font-medium">Color: {selectedColor.label}</p>
          <ul className="flex gap-3 mt-2.5">
            {colors.map((color) => (
              <li key={color.code}>
                <button
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  aria-label={color.label}
                  aria-pressed={selectedColor.code === color.code}
                  className={cn(
                    "size-11 rounded-full overflow-hidden border-2 transition-colors duration-300",
                    selectedColor.code === color.code ? "border-secondary-foreground" : "border-transparent"
                  )}
                >
                  <Image
                    width={44}
                    height={44}
                    src={color.image}
                    alt={color.label}
                    sizes="44px"
                    className="w-full h-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <div className="border border-gray-2 text-secondary-foreground flex items-center gap-3 px-3 py-2.5 rounded-full">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="cursor-pointer size-5 inline-flex items-center justify-center"
            onClick={() => handleProductQuantity("decrement")}
          >
            <Minus />
          </button>
          <span className="w-4 text-center text-sm">{productQuantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="cursor-pointer size-5 inline-flex items-center justify-center"
            onClick={() => handleProductQuantity("increment")}
          >
            <Plus />
          </button>
        </div>
        <Button className="min-w-[160px]" onClick={handleAddToCart}>
          Add To Cart
        </Button>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          aria-pressed={isWishlisted}
          className="size-12 shrink-0 rounded-full border border-gray-2 flex items-center justify-center text-gray-1-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-500"
        >
          <Heart className={cn("size-4", isWishlisted && "fill-current")} />
        </button>
      </div>

      {!compact && <UspMarquee />}

      {offers.length > 0 && (
        <div className="mt-7.5">
          <p className="text-secondary-foreground font-medium text-sm mb-2.5">Best Offers For You</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {offers.map((offer) => (
              <div key={offer.code} className="border border-gray-2 rounded-xl px-3.5 py-3">
                <p className="text-secondary-foreground text-sm font-semibold tracking-wide">{offer.code}</p>
                <p className="text-gray-1-foreground text-xs leading-relaxed mt-0.5">{offer.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!compact && (
        <div className="mt-7.5">
          <p className="text-secondary-foreground font-medium mb-3">Check estimated delivery</p>
          <div className="flex gap-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter your pincode"
              className="flex-1 min-w-0 border border-gray-2 rounded-full px-5 py-2.5 text-sm outline-none focus:border-secondary-foreground transition-colors duration-300"
            />
            <Button onClick={handleCheckDelivery}>Check</Button>
          </div>
          {deliveryEstimate && <p className="text-gray-1-foreground text-sm mt-2.5">{deliveryEstimate}</p>}
        </div>
      )}
    </div>
  );
};

export default ProductInfoDetails;
