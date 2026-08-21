"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  dicrementProductQuentity,
  incrementProductQuentity,
  removeToCart,
} from "@/lib/features/AddToCartSlice";
import { Close, Minus, Plus, ShopCart } from "@/lib/icon";
import { Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/reduxHooks";
import { menuList } from "@/db/menuList";
import { couponsData } from "@/db/couponsData";
import { ProductType } from "@/types/productType";
import CartOfferMarquee from "./cartOfferMarquee";
import CartRewardsProgress from "./cartRewardsProgress";
import CartCrossSell from "./cartCrossSell";
import currencyFormatter from "currency-formatter";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ShopingCartSidebar = ({
  featuredProducts = [],
}: {
  featuredProducts?: ProductType[];
}) => {
  const pathName = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.addToCart.products);

  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  const totalSavings = products.reduce((total, product) => {
    const original = product.originalPrice ?? product.price;
    return total + (original - product.price) * product.quantity;
  }, 0);
  const totalProducts = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const crossSellProducts = featuredProducts
    .filter((product) => !products.some((item) => item.id === product.id))
    .slice(0, 6);

  const featuredCoupon = couponsData[0];
  // Only one coupon can be applied at a time — tracking its code (rather than a
  // boolean) keeps that invariant explicit even though only one coupon is offered here.
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const isCouponApplied = appliedCouponCode === featuredCoupon?.code;

  const handleApplyCoupon = () => {
    setAppliedCouponCode(featuredCoupon.code);
    toast.success(`Coupon "${featuredCoupon.code}" applied!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode(null);
    toast.success(`Coupon "${featuredCoupon.code}" removed`);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathName]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="shoping-cart"
            className="text-gray-1-foreground relative p-1.5 -m-1.5 rounded-full transition-colors duration-300 hover:bg-black/[0.04] active:bg-black/[0.06]"
          >
            <ShopCart className="size-6" />
            <span className="w-[15px] h-[15px] bg-primary rounded-full flex items-center justify-center text-xs text-white absolute right-[3px] top-[3px]">
              {totalProducts}
            </span>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[420px] w-full p-0 gap-0 flex flex-col [&_.close-orginal]:hidden">
            {/* 1. Cart header */}
            <SheetHeader className="px-7.5 py-6 flex flex-row justify-between items-center space-y-0 shrink-0">
              <SheetTitle className="text-secondary-foreground font-medium text-lg lg:text-xl leading-[150%]">
                Shopping Cart ({totalProducts})
              </SheetTitle>
              <SheetClose
                aria-label="Close cart"
                className="flex items-center justify-center size-9 lg:size-10 shrink-0 rounded-full bg-home-bg-1 text-gray-1-foreground hover:text-secondary-foreground transition-all duration-300 mt-0"
              >
                <Close className="size-4 lg:size-4.5" />
              </SheetClose>
            </SheetHeader>

            {/* 2. Offer marquee */}
            <CartOfferMarquee className="shrink-0" />

            <div className="flex flex-col gap-6 px-7.5 py-6 flex-1 min-h-0 overflow-y-auto">
              {products.length ? (
                <>
                  {/* 3. Cart rewards progress */}
                  <CartRewardsProgress subtotal={totalPrice} />

                  {/* 4. Cart products */}
                  <div className="flex flex-col gap-6">
                    {products.map(
                      ({
                        id,
                        price,
                        originalPrice,
                        quantity,
                        thumbnail,
                        title,
                      }) => (
                        <div
                          key={id}
                          className="flex items-start gap-4 pb-6 border-b border-border last:border-b-0 last:pb-0"
                        >
                          <div className="bg-home-bg-1 rounded-xl p-2.5 shrink-0">
                            <Image
                              width={80}
                              height={90}
                              src={thumbnail}
                              sizes="100vw"
                              alt={title}
                              className="h-[90px] w-20 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <b className="lg:text-lg text-base font-medium text-secondary-foreground leading-[150%] capitalize line-clamp-1">
                                {title}
                              </b>
                              <button
                                type="button"
                                aria-label={`Remove ${title} from cart`}
                                onClick={() => dispatch(removeToCart(id))}
                                className="shrink-0 flex items-center justify-center size-7 rounded-full text-gray-1-foreground hover:bg-primary hover:text-white transition-all duration-300"
                              >
                                <Close className="size-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                              <div className="rounded-full border border-gray-2 text-secondary-foreground flex items-center gap-2.5 px-2.5 py-1.5">
                                <span
                                  className="cursor-pointer h-4 w-5 inline-flex items-center justify-center"
                                  onClick={() =>
                                    dispatch(dicrementProductQuentity({ id }))
                                  }
                                >
                                  <Minus />
                                </span>
                                <input
                                  value={quantity}
                                  readOnly
                                  className="outline-none max-w-5 text-center text-sm"
                                />
                                <span
                                  className="cursor-pointer h-4 w-5 inline-flex items-center justify-center"
                                  onClick={() =>
                                    dispatch(incrementProductQuentity({ id }))
                                  }
                                >
                                  <Plus />
                                </span>
                              </div>
                              <p className="text-secondary-foreground text-base font-medium">
                                {originalPrice && originalPrice > price ? (
                                  <del className="text-gray-3-foreground font-normal mr-1.5">
                                    {currencyFormatter.format(originalPrice, {
                                      code: "USD",
                                    })}
                                  </del>
                                ) : null}
                                <span>
                                  {currencyFormatter.format(price, {
                                    code: "USD",
                                  })}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* 5. Offers / coupons */}
                  {featuredCoupon ? (
                    <div className="rounded-xl border border-border px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-secondary-foreground font-medium">
                            {featuredCoupon.title}
                          </p>
                          <p className="text-xs text-gray-1-foreground mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span>
                              Code:{" "}
                              <span className="text-secondary-foreground font-medium">
                                {featuredCoupon.code}
                              </span>{" "}
                              — {featuredCoupon.discount}
                            </span>
                            {isCouponApplied ? (
                              <span className="inline-flex items-center gap-1 text-[#66995C] font-medium">
                                <Check className="size-3" />
                                Applied
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={isCouponApplied ? handleRemoveCoupon : handleApplyCoupon}
                          className="shrink-0 h-auto px-3.5 py-1.5 text-xs lg:px-3.5 lg:py-1.5 lg:text-xs"
                        >
                          {isCouponApplied ? "Remove" : "Apply"}
                        </Button>
                      </div>
                      <Link
                        href="/account/coupons"
                        className="multiline-hover inline-block text-xs text-gray-1-foreground hover:text-secondary-foreground transition-colors duration-300 mt-3"
                      >
                        View all offers
                      </Link>
                    </div>
                  ) : null}

                  {/* 6. Cross-sell */}
                  <CartCrossSell products={crossSellProducts} />
                </>
              ) : (
                <div className="text-center">
                  <p className="capitalize text-secondary-foreground text-xl">
                    No Product in cart
                  </p>
                  <div className="mt-6">
                    <p className="font-medium text-secondary-foreground">
                      What would you like to buy? Pick from our best-selling categories
                    </p>
                    <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                      {menuList.map(({ id, label, path }) => (
                        <li key={id}>
                          <Link
                            href={path}
                            className="multiline-hover text-gray-1-foreground hover:text-secondary-foreground capitalize transition-colors duration-300"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Sticky footer */}
            <SheetFooter className="flex-col sm:flex-col sm:space-x-0 bg-background w-full border-t border-border shrink-0">
              {products.length ? (
                <div className="px-7.5 pt-5 pb-7.5">
                  <div className="flex justify-between items-center">
                    <p className="text-secondary-foreground font-medium leading-[155%]">
                      Estimated total
                    </p>
                    <p className="text-secondary-foreground font-semibold text-lg">
                      {currencyFormatter.format(totalPrice, { code: "USD" })}
                    </p>
                  </div>
                  {totalSavings > 0 ? (
                    <p className="text-xs text-primary font-medium mt-1 text-right">
                      You saved {currencyFormatter.format(totalSavings, { code: "USD" })}!
                    </p>
                  ) : null}

                  <div className="mt-5">
                    <Button variant={"outline"} size={"sm"} asChild className="w-full">
                      <Link href={"/cart"}>View Cart</Link>
                    </Button>
                    <Button size={"sm"} asChild className="w-full mt-3">
                      <Link href={"/checkout"}>Check Out</Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <p className="text-xs text-gray-1-foreground">Secure checkout with</p>
                    <div className="rounded-md bg-home-bg-1 p-1">
                      <Image
                        src="/images/payment-card.webp"
                        alt="Payment Methods"
                        width={100}
                        height={37}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-7.5 py-6 w-full">
                  <Button size={"sm"} asChild className="w-full">
                    <Link href={"/shop-2"}>Browse Shop</Link>
                  </Button>
                </div>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : null}
    </>
  );
};

export default ShopingCartSidebar;
