"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  dicrementProductQuentity,
  incrementProductQuentity,
  removeToCart,
} from "@/lib/features/AddToCartSlice";
import { Close, Minus, Plus, ShopCart } from "@/lib/icon";
import { useAppDispatch, useAppSelector } from "@/lib/reduxHooks";
import { menuList } from "@/db/menuList";
import Image from "next/image";
import Link from "next/link";

const ProductsCartTable = () => {
  const { products } = useAppSelector((state) => state.addToCart);
  const dispatch = useAppDispatch();
  return (
    <>
      {products.length ? (
        <div className="overflow-x-auto border rounded-lg">
          <Table className="min-w-[700px] xl:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-7.5 py-4 lg:text-xl text-lg font-semibold text-secondary-foreground">
                  Products
                </TableHead>
                <TableHead className="px-7.5 py-4 lg:text-xl text-lg font-semibold text-secondary-foreground w-[165px]">
                  Price
                </TableHead>
                <TableHead className="px-7.5 py-4 lg:text-xl text-lg font-semibold text-secondary-foreground w-[190px]">
                  Quantity
                </TableHead>
                <TableHead className="px-7.5 py-4 lg:text-xl text-lg font-semibold text-secondary-foreground w-[171px]">
                  Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(({ id, price, thumbnail, title, quantity }) => {
                const totalPrice = (price * quantity).toFixed(2);
                return (
                  <TableRow key={id}>
                    <TableCell className="flex items-center gap-5 py-5 px-7.5 w-[370px]">
                      <div className="bg-home-bg-1 p-[5px] w-20 h-20">
                        <Image
                          src={thumbnail}
                          width={80}
                          height={80}
                          alt="product"
                        />
                      </div>
                      <b className="lg:text-xl text-lg font-medium text-secondary-foreground capitalize max-w-[200px] line-clamp-1">
                        {title}
                      </b>
                    </TableCell>
                    <TableCell className="text-lg font-medium text-secondary-foreground py-5 px-7.5 w-[165px]">
                      ${price.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-5 px-7.5 w-[190px]">
                      <div className="max-w-25 border border-gray-1 flex items-center gap-4 px-[14px] py-[11px] text-sm font-medium text-gray-1-foreground">
                        <span
                          onClick={() =>
                            dispatch(dicrementProductQuentity({ id }))
                          }
                          className="cursor-pointer h-5 flex items-center"
                        >
                          <Minus />
                        </span>
                        {quantity}
                        <span
                          onClick={() =>
                            dispatch(incrementProductQuentity({ id }))
                          }
                          className="cursor-pointer h-5 flex items-center"
                        >
                          <Plus />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-lg font-medium text-gray-1-foreground py-5 px-7.5 w-[171px]">
                      ${Number(totalPrice).toFixed(2)}
                    </TableCell>
                    <TableCell
                      className="text-gray-1-foreground cursor-pointer py-5 px-7.5"
                      onClick={() => dispatch(removeToCart(id))}
                    >
                      <Close className="size-7.5" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-5 border-t-[1.5px] border-t-[#E5E2E1] px-7.5 py-7.5">
            <div className="max-w-[522px] flex items-center gap-2.5">
              <Input
                type={"text"}
                placeholder={"Coupon code"}
                className={"border-gray px-5 py-[14px]"}
              />
              <Button className="lg:px-6 px-4 lg:py-3 lg:text-lg">
                Apply coupon
              </Button>
            </div>
            <Button
              variant={"outline"}
              asChild
              className="lg:px-6 lg:py-3 lg:text-lg"
            >
              <Link href={"/shop"}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-center border rounded-lg px-6 py-14 lg:py-20 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both">
          <h3 className="lg:text-[32px] text-2xl font-bold text-secondary-foreground">
            Your Cart is Empty
          </h3>
          <p className="mt-1.5 lg:text-xl text-lg text-gray-1-foreground">
            Let&apos;s fill it with something you&apos;ll love
          </p>

          <div className="relative my-8 lg:my-10 flex size-32 lg:size-40 items-center justify-center animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-home-bg-1 after:absolute after:inset-0 after:rounded-full after:bg-[rgba(138,138,138,0.25)] after:animate-spring-one"
            />
            <ShopCart className="relative size-14 lg:size-16 text-gray-1-foreground" />
            <span className="absolute right-2 bottom-2 lg:right-3 lg:bottom-3 flex size-8 lg:size-10 items-center justify-center rounded-full bg-primary text-white shadow-md ring-4 ring-background">
              <Close className="size-3.5 lg:size-4" strokeWidth="3" />
            </span>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-1 duration-700 delay-300 fill-mode-both">
            <p className="font-medium text-secondary-foreground">
              What would you like to buy? Pick from our best-selling categories
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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

          <Button
            asChild
            size={"lg"}
            className="mt-9 w-full max-w-sm uppercase tracking-wide lg:text-lg hover:scale-[1.02] transition-transform duration-300"
          >
            <Link href={"/shop"}>Continue Shopping</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductsCartTable;
