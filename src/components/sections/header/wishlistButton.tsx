"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "@/lib/icon";
import { useWishlist } from "@/lib/wishlist/wishlist-context";

const WishlistButton = () => {
  const [isClient, setIsClient] = useState(false);
  const { products } = useWishlist();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Link
      aria-label="wishlist"
      href={"/wishlist"}
      className="text-gray-1-foreground relative lg:block hidden hover:text-secondary-foreground transition-all duration-500"
    >
      <Heart className="size-6" />
      {isClient && products.length > 0 && (
        <span className="w-[15px] h-[15px] bg-primary rounded-full flex items-center justify-center text-xs text-white absolute -right-[3px] -top-[3px]">
          {products.length}
        </span>
      )}
    </Link>
  );
};

export default WishlistButton;
