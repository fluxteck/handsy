"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shuffle } from "@/lib/icon";
import { useAppSelector } from "@/lib/reduxHooks";

/**
 * Entry point to the comparison.
 *
 * Deliberately a twin of {@link WishlistButton}: a shopper who has learned that
 * the heart in the header leads to their saved items should not have to learn a
 * second rule for the comparison. Both are shortlists.
 *
 * Until now nothing anywhere linked to `/compare` — the page and the state both
 * existed, and the only way to reach them was to type the URL. The count is the
 * point as much as the link: it is the confirmation that the compare icon on a
 * product card actually did something.
 *
 * `isClient` gates the badge because the comparison lives in localStorage, so
 * the server renders zero and the browser renders the real number — writing it
 * on the first pass would be a hydration mismatch.
 */
const CompareButton = () => {
  const [isClient, setIsClient] = useState(false);
  const products = useAppSelector((state) => state.productCompare.products);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Link
      aria-label={
        isClient && products.length > 0
          ? `compare (${products.length} products)`
          : "compare products"
      }
      href={"/compare"}
      className="text-gray-1-foreground relative lg:block hidden hover:text-secondary-foreground transition-all duration-500"
    >
      <Shuffle className="size-6" />
      {isClient && products.length > 0 && (
        <span className="w-[15px] h-[15px] bg-primary rounded-full flex items-center justify-center text-xs text-white absolute -right-[3px] -top-[3px]">
          {products.length}
        </span>
      )}
    </Link>
  );
};

export default CompareButton;
