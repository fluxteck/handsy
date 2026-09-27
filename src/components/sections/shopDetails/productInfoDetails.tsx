"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Heart } from "@/lib/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import calcluteDiscount from "@/lib/calcluteDiscount";
import { richTextToPlain } from "@/lib/plainText";
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
  /**
   * What the customer is actually charged, when it is known exactly.
   *
   * The percentage is rounded to a whole number for the badge, so deriving the
   * price from it lands somewhere else entirely whenever the discount is not a
   * clean percentage: ₹2199 off ₹5999 is 36.66%, shown as "37% OFF", and
   * 5999 − 37% is ₹3,779.37 — not the ₹3,800 the cart will charge. Passing the
   * real figure keeps the page and the till agreeing.
   */
  sellingPrice?: number;
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
  /** Trims the panel to just what's needed for a fast purchase decision — hides the trust-badge marquee. Used by Quick View; the PDP omits it so its full layout is unchanged. */
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
  sellingPrice,
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
  // The teaser is clamped to three lines, so it takes the description flattened
  // to text: the full markup gets its own block further down the page.
  const descriptionText = useMemo(() => richTextToPlain(description), [description]);

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

  /* The server's figure wins whenever it is known. The derivation below is the
     fallback for callers that carry only a percentage — static sample data and
     anything not yet mapped from the catalogue. */
  const finalPrice =
    sellingPrice ?? (discountPercentage ? calcluteDiscount(price, discountPercentage) : price);

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

  return (
    <div className="min-w-0">
      {titleHref ? (
        <Link
          href={titleHref}
          className={cn(
            "text-secondary-foreground text-heading font-semibold capitalize block hover:text-gray-1-foreground transition-colors duration-300",
            compact && "max-md:text-base max-md:leading-snug"
          )}
        >
          {title}
        </Link>
      ) : (
        <strong
          className={cn(
            "text-secondary-foreground text-heading font-semibold capitalize block",
            compact && "max-md:text-base max-md:leading-snug"
          )}
        >
          {title}
        </strong>
      )}

      <p className={cn("text-xl lg:text-2xl xl:text-3xl text-secondary-foreground mt-4", compact && "max-md:text-lg max-md:leading-tight max-md:mt-1.5")}>
        {currencyFormatter.format(finalPrice)}
      </p>
      {discountPercentage ? (
        <p className={cn("text-gray-3-foreground text-sm mt-1", compact && "max-md:text-xs max-md:mt-0.5")}>
          Regular price{" "}
          <del>{currencyFormatter.format(price)}</del>{" "}
          <span className="text-primary font-medium">({discountPercentage}% OFF)</span>
        </p>
      ) : null}
      <p className={cn("text-gray-3-foreground text-sm mt-1", compact && "max-md:text-xs max-md:mt-0.5")}>Tax included</p>

      {descriptionText && (
        <p
          className={cn(
            "text-gray-1-foreground leading-[170%] mt-4 line-clamp-3",
            compact && "max-md:text-sm max-md:leading-normal max-md:mt-2 max-md:line-clamp-2"
          )}
        >
          {descriptionText}
        </p>
      )}

      {colors.length > 0 && (
        <div className={cn("mt-6", compact && "max-md:mt-3")}>
          <p className={cn("text-gray-1-foreground font-medium", compact && "max-md:text-sm")}>Color: {selectedColor.label}</p>
          <ul className={cn("flex gap-3 mt-2.5", compact && "max-md:gap-2 max-md:mt-1.5")}>
            {colors.map((color) => (
              <li key={color.code}>
                <button
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  aria-label={color.label}
                  aria-pressed={selectedColor.code === color.code}
                  className={cn(
                    "size-11 rounded-full overflow-hidden border-2 transition-colors duration-300",
                    compact && "max-md:size-9",
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

      <div className={cn("flex flex-wrap items-center gap-3 mt-6", compact && "max-md:flex-nowrap max-md:gap-2 max-md:mt-3")}>
        <div
          className={cn(
            "border border-gray-2 text-secondary-foreground flex items-center gap-3 px-3 py-2.5 rounded-full",
            compact && "max-md:shrink-0 max-md:h-10 max-md:gap-2 max-md:px-2.5 max-md:py-0"
          )}
        >
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
        <Button
          className={cn("min-w-[160px]", compact && "max-md:min-w-0 max-md:flex-1 max-md:h-10 max-md:px-4 max-md:text-sm")}
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          aria-pressed={isWishlisted}
          className={cn(
            "size-12 shrink-0 rounded-full border border-gray-2 flex items-center justify-center text-gray-1-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-500",
            compact && "max-md:size-10"
          )}
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

    </div>
  );
};

export default ProductInfoDetails;
