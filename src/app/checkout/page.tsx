import CheckoutForm from "./checkoutForm";
import CheckoutPayment from "./checkoutPayment";
import { CheckoutProvider } from "@/lib/checkout/checkout-context";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@/lib/icon";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getTopRatedProducts } from "@/lib/sdk";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase.",
};

const Checkout = async () => {
  /* Real candidates for the order-summary upsell — the same top-rated feed
     the cart drawer's "You might also like" rail uses. <CheckoutUpsell/>
     picks the first one not already in the cart. */
  const upsellCandidates = await getTopRatedProducts(4);

  return (
    <main className="lg:h-dvh">
      <h1 className="sr-only">Checkout</h1>
      <CheckoutProvider>
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
                <Breadcrumb
                  items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
                  className="[&_a]:text-xs [&_span]:text-xs"
                />
              </div>

              <Button asChild variant="outline" size="sm" className="mt-3 gap-1.5 h-8 px-3.5 text-xs">
                <Link href="/">
                  <ArrowLeft className="size-3.5" />
                  Back to home
                </Link>
              </Button>

              <div className="text-gray-1-foreground flex flex-wrap items-center gap-x-1.5 mt-4 text-sm">
                <span>Checking out as guest.</span>
                <LoginForm />
                <span>or</span>
                <RegisterForm />
              </div>

              <CheckoutForm />
            </div>
          </div>

          <div className="bg-home-bg-4 lg:h-dvh lg:overflow-y-auto" data-lenis-prevent>
            <div className="max-w-2xl mx-auto px-6 sm:px-8 xl:px-11 py-5 lg:py-6">
              <CheckoutPayment upsellCandidates={upsellCandidates} />
            </div>
          </div>
        </div>
      </CheckoutProvider>
    </main>
  );
};

export default Checkout;
