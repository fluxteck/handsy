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
import { useAppDispatch, useAppSelector } from "@/lib/reduxHooks";
import { menuList } from "@/db/menuList";
import UspMarquee from "@/components/sections/shopDetails/uspMarquee";
import currencyFormatter from "currency-formatter";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ShopingCartSidebar = () => {
  const pathName = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.addToCart.products);

  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  const totalProducts = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

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
          <SheetContent className="sm:max-w-[420px] w-full p-0 [&_.close-orginal]:hidden">
            <SheetHeader className="bg-home-bg-1 px-7.5 py-6 flex flex-row justify-between items-center space-y-0">
              <SheetTitle className="text-secondary-foreground font-medium text-lg lg:text-xl leading-[150%]">
                Shopping cart({totalProducts})
              </SheetTitle>
              <SheetClose
                aria-label="Close cart"
                className="flex items-center justify-center size-9 lg:size-10 shrink-0 rounded-full bg-background text-gray-1-foreground shadow-3xl hover:text-secondary-foreground transition-all duration-300 mt-0"
              >
                <Close className="size-4 lg:size-4.5" />
              </SheetClose>
            </SheetHeader>
            <UspMarquee className="mt-0 pt-4 pb-4 border-b border-border" />
            <div className="flex flex-col gap-6 p-7.5 max-h-[540px] h-full overflow-y-auto">
              {products.length ? (
                products.map(({ id, price, quantity, thumbnail, title }) => (
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
                        <span className="text-secondary-foreground text-base font-medium">
                          ${price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
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
            <SheetFooter className="absolute bottom-0 inset-x-0 flex-col sm:flex-col sm:space-x-0 bg-background w-full border-t border-border">
              {products.length ? (
                <>
                  <div className="mx-7.5 mt-5 rounded-xl bg-home-bg-1 px-5 py-4 flex justify-between items-center">
                    <p className="text-secondary-foreground font-medium leading-[155%]">
                      Subtotal
                    </p>
                    <p className="text-secondary-foreground font-semibold text-lg">
                      {currencyFormatter.format(totalPrice, { code: "USD" })}
                    </p>
                  </div>
                  <div className="px-7.5 pt-5 pb-7.5">
                    <p className="text-gray-1-foreground text-sm">
                      Add{" "}
                      <span className="text-secondary-foreground font-medium">$436.00</span>{" "}
                      to cart and get{" "}
                      <span className="text-secondary-foreground font-medium">
                        Free shipping!
                      </span>
                    </p>
                    <div className="mt-2.5 w-full h-1.5 rounded-full bg-home-bg-1 overflow-hidden">
                      <div className="h-full rounded-full bg-primary w-4/5 transition-all duration-700"></div>
                    </div>
                    <div className="mt-6">
                      <Button variant={"outline"} size={"sm"} asChild className="w-full">
                        <Link href={"/cart"}>View Cart</Link>
                      </Button>
                      <Button size={"sm"} asChild className="w-full mt-3">
                        <Link href={"/checkout"}>Check Out</Link>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-7.5 py-6 w-full">
                  <Button size={"sm"} asChild className="w-full">
                    <Link href={"/shop"}>Browse Shop</Link>
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
