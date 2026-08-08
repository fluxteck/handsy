"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Plus } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/lib/reduxHooks";
import { addToCart } from "@/lib/features/AddToCartSlice";
import type { ShopTheLookData, ShopTheLookProduct, ShopTheLookRoom } from "@/types/shopTheLookType";

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const RoomShowcase = ({
  room,
  ctaLabel,
}: {
  room: ShopTheLookRoom;
  ctaLabel: string;
}) => {
  const dispatch = useAppDispatch();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeProductIndex, setActiveProductIndex] = useState<number | null>(null);

  const activeImage = room.images[activeImageIndex];
  const totalPrice = useMemo(
    () => room.products.reduce((sum, product) => sum + product.price, 0),
    [room.products]
  );

  const handleAddProduct = (product: ShopTheLookProduct) => {
    dispatch(
      addToCart({
        id: product.id,
        thumbnail: product.thumbnail,
        quantity: 1,
        price: product.price,
        color: "",
        size: "",
        title: product.title,
      })
    );
  };

  const handleAddRoom = () => {
    room.products.forEach(handleAddProduct);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
      <div className="group/image relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[380px] w-full overflow-hidden rounded-xl bg-[#F2F2F2]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
            />
          </motion.div>
        </AnimatePresence>

        {room.images.length > 1 && (
          <button
            type="button"
            onClick={() => setActiveImageIndex((prev) => (prev + 1) % room.images.length)}
            aria-label="Show next room photo"
            className="absolute top-3 left-3 z-10 rounded-full bg-primary/80 px-2.5 py-1 text-[10px] font-medium tracking-wider text-white backdrop-blur-sm transition-colors duration-300 hover:bg-primary"
          >
            {String(activeImageIndex + 1).padStart(2, "0")} · {String(room.images.length).padStart(2, "0")}
          </button>
        )}

        <span className="absolute bottom-3 left-3 z-10 rounded-full bg-primary/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
          {room.roomLabel}
        </span>

        {room.hotspots.map((hotspot, index) => {
          const product = room.products[hotspot.productIndex];
          if (!product) return null;
          const isActive = activeProductIndex === hotspot.productIndex;

          return (
            <motion.button
              key={hotspot.id}
              type="button"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.08, type: "spring", stiffness: 320, damping: 22 }}
              onMouseEnter={() => setActiveProductIndex(hotspot.productIndex)}
              onFocus={() => setActiveProductIndex(hotspot.productIndex)}
              onClick={() => setActiveProductIndex(hotspot.productIndex)}
              aria-label={`View ${product.title}`}
              className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            >
              {!isActive && (
                <span className="absolute inset-0 animate-ping rounded-full bg-white/70" aria-hidden />
              )}
              <span
                className={cn(
                  "relative flex size-6 items-center justify-center rounded-full bg-background text-[11px] font-medium text-secondary-foreground shadow-3xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white",
                  isActive && "scale-110 bg-primary text-white"
                )}
              >
                {hotspot.id}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-col lg:h-full">
        <div className="flex items-center justify-between border-b border-gray-2 pb-2.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-3-foreground">The Pieces</p>
          <p className="text-[11px] text-gray-3-foreground">{room.products.length} in this room</p>
        </div>

        <ul className="flex flex-1 flex-col">
          {room.products.map((product, index) => {
            const thumbnail = (
              <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-[#F2F2F2]">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={48}
                  height={48}
                  sizes="48px"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/row:scale-110"
                />
              </div>
            );

            return (
              <li
                key={product.id}
                onMouseEnter={() => setActiveProductIndex(index)}
                onMouseLeave={() => setActiveProductIndex(null)}
                className={cn(
                  "group/row flex flex-1 items-center gap-3 border-b border-gray-2 py-2.5 transition-colors duration-300",
                  activeProductIndex === index && "bg-home-bg-4/50"
                )}
              >
                {product.href ? (
                  <Link href={product.href} className="flex min-w-0 flex-1 items-center gap-3">
                    {thumbnail}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-medium capitalize text-secondary-foreground">
                        {product.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-1-foreground">
                        {priceFormatter.format(product.price)}
                      </span>
                    </span>
                  </Link>
                ) : (
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {thumbnail}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium capitalize text-secondary-foreground">
                        {product.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-1-foreground">
                        {priceFormatter.format(product.price)}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  aria-label={`Add ${product.title} to cart`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-2 text-secondary-foreground transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary hover:text-white"
                >
                  <Plus className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-3-foreground">The Room, Complete</p>
            <p className="mt-1 text-lg font-semibold text-secondary-foreground">
              {priceFormatter.format(totalPrice)}
            </p>
          </div>
          <Button onClick={handleAddRoom} size="sm" className="gap-2 transition-transform duration-300 hover:-translate-y-0.5">
            {ctaLabel} <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ShopTheLook = ({ data, className }: { data: ShopTheLookData; className?: string }) => {
  const firstRoomId = data.rooms[0]?.id;
  if (!firstRoomId) return null;

  return (
    <section className={cn("lg:pt-25 pt-15 lg:pb-25 pb-15", className)}>
      <div className="container">
        <Tabs defaultValue={firstRoomId}>
          <div className="flex flex-wrap items-end justify-between gap-5 mb-7 lg:mb-8">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
                {data.eyebrow} <ChevronRight className="size-3" />
              </p>
              <h2 className="mt-1.5 text-heading capitalize text-secondary-foreground">
                {data.title}
              </h2>
            </div>

            {data.rooms.length > 1 && (
              <TabsList className="flex-wrap justify-start gap-2">
                {data.rooms.map((room) => (
                  <TabsTrigger
                    key={room.id}
                    value={room.id}
                    className="rounded-full border border-gray-2 px-3.5 py-1.5 text-[11px] md:text-[11px] lg:text-[11px] font-medium uppercase tracking-[0.15em] text-gray-1-foreground transition-all duration-300 hover:border-primary/50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    {room.tabLabel}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
          </div>

          {data.rooms.map((room) => (
            <TabsContent key={room.id} value={room.id} className="mt-0">
              <RoomShowcase room={room} ctaLabel={data.ctaLabel ?? "Add The Room"} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ShopTheLook;
