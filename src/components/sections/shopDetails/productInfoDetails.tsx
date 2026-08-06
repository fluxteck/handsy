"use client";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Minus, Plus, Heart, ShopCart } from "@/lib/icon";
import { Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Rating from "@/components/ui/rating";
import { cn } from "@/lib/utils";
import calcluteDiscount from "@/lib/calcluteDiscount";
import { addToCart } from "@/lib/features/AddToCartSlice";
import { addToWishlist } from "@/lib/features/AddToWishlistSlice";
import { useAppDispatch } from "@/lib/reduxHooks";
import UspMarquee from "@/components/sections/shopDetails/uspMarquee";

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
  rating: number;
  totalRating: string;
  colors: ProductColorType[];
  offers: ProductOfferType[];
}

const ProductInfoDetails = ({
  id,
  title,
  price,
  discountPercentage,
  thumbnail,
  stock,
  rating,
  totalRating,
  colors,
  offers,
}: ProductInfoDetailsPropsType) => {
  const dispatch = useAppDispatch();
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
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

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id,
        thumbnail,
        quantity: productQuantity,
        price: finalPrice,
        color: selectedColor.code,
        size: "",
        title,
      })
    );
  };

  const handleWishlist = () => {
    setIsWishlisted(true);
    dispatch(
      addToWishlist({
        id,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        price,
        thumbnail,
        title,
        color: selectedColor.code,
        size: "",
        stock,
      })
    );
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // user cancelled the share sheet
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    }
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Rating star={rating} iconSize="size-4" />
          <span className="text-base text-gray-1-foreground leading-none">
            {rating ? `(${totalRating})` : "No reviews"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share this product"
          className="size-10 shrink-0 rounded-full border border-gray-2 flex items-center justify-center text-gray-1-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-500"
        >
          <Share2 className="size-4" />
        </button>
      </div>

      <strong className="text-secondary-foreground lg:text-[32px] md:text-[28px] text-2xl font-semibold capitalize block mt-4">
        {title}
      </strong>

      <p className="text-xl lg:text-2xl xl:text-3xl text-secondary-foreground mt-4">
        {currencyFormatter.format(finalPrice)}{" "}
        {discountPercentage ? (
          <del className="text-gray-3-foreground text-lg lg:text-xl">
            {currencyFormatter.format(price)}
          </del>
        ) : null}
      </p>
      <p className="text-gray-3-foreground text-sm mt-1">Tax included</p>

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
        <Button className="flex-1 min-w-[180px]" onClick={handleAddToCart}>
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

      <a
        href="#help"
        className="inline-flex items-center gap-2 text-secondary-foreground font-medium underline underline-offset-4 mt-5 hover:text-gray-1-foreground transition-all duration-500"
      >
        Need Any Help OR Want To Buy This In Bulk? <ShopCart className="size-5" />
      </a>

      <UspMarquee />

      {offers.length > 0 && (
        <div className="mt-7.5">
          <p className="text-secondary-foreground font-medium mb-3">Best Offers For You</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {offers.map((offer) => (
              <div key={offer.code} className="border border-gray-2 rounded-sm p-4">
                <p className="text-secondary-foreground font-semibold">{offer.code}</p>
                <p className="text-gray-1-foreground text-sm mt-1">{offer.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <ul className="flex flex-wrap items-center gap-2 mt-7.5">
        {["UPI", "GPay", "PhonePe", "RuPay", "VISA", "Mastercard", "Amex"].map((method) => (
          <li
            key={method}
            className="text-xs font-medium text-gray-1-foreground border border-gray-2 rounded px-2.5 py-1.5"
          >
            {method}
          </li>
        ))}
        <li className="text-gray-1-foreground" aria-label="Secure checkout">
          <ShieldCheck className="size-5" strokeWidth={1.5} />
        </li>
      </ul>

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
    </div>
  );
};

export default ProductInfoDetails;
