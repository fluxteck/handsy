import CartItemsList from "./cartItemsList";
import CartSummary from "./cartSummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@/lib/icon";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getTopRatedProducts } from "@/lib/sdk";
import { getCategoryLinks } from "@/lib/categoryLinks";

export const metadata: Metadata = {
  title: "Cart",
  description: "View your shopping cart and proceed to checkout.",
};

const ViewCart = async () => {
  // Suggested categories for the empty state, from the catalogue.
  const categoryLinks = await getCategoryLinks();

  /* Real candidates for the order-summary upsell — the same top-rated feed
     the cart drawer's "You might also like" rail uses. <CartUpsell/> picks
     the first one not already in the cart. */
  const upsellCandidates = await getTopRatedProducts(4);

  return (
    <main className="lg:h-dvh">
      <h1 className="sr-only">Cart</h1>
      <div className="grid lg:grid-cols-2 lg:h-full">
        <div className="bg-home-bg-3 lg:h-dvh lg:overflow-y-auto" data-lenis-prevent>
          <div className="max-w-2xl mx-auto px-6 sm:px-8 xl:px-11 py-5 lg:py-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Link href="/" aria-label="Handsy Market home" className="shrink-0">
                <Image
                  width={80}
                  height={50}
                  src={"/images/logo.png"}
                  alt="logo"
                  className="w-12 h-auto lg:w-14"
                />
              </Link>
              <span className="text-xs text-gray-1-foreground">Your cart</span>
            </div>

            <Button asChild variant="outline" size="sm" className="mt-3 gap-1.5 h-8 px-3.5 text-xs">
              <Link href="/shop">
                <ArrowLeft className="size-3.5" />
                Continue shopping
              </Link>
            </Button>

            <div className="mt-4 max-h-[55vh] lg:max-h-[60vh] overflow-y-auto" data-lenis-prevent>
              <CartItemsList categories={categoryLinks} />
            </div>
          </div>
        </div>

        <div className="bg-home-bg-4 lg:h-dvh lg:overflow-y-auto" data-lenis-prevent>
          <div className="max-w-2xl mx-auto px-6 sm:px-8 xl:px-11 py-5 lg:py-6">
            <CartSummary upsellCandidates={upsellCandidates} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewCart;
