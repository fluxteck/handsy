import CheckoutForm from "@/app/(innerPage)/checkout/checkoutForm";
import CheckoutPayment from "@/app/(innerPage)/checkout/checkoutPayment";
import PageHeader from "@/components/sections/pageHeader";
import { Metadata } from "next";
import Link from "next/link";
import CouponCodeForm from "./couponCodeForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase.",
};

const Checkout = () => {
  return (
    <main>
      <PageHeader
        currentPage="Checkout"
        pageTitle="Checkout"
        breadcrumbLink="/shop-2"
        breadcrumbLabel="Shop"
      />
      <div className="container lg:py-10 py-6">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mb-5 text-sm">
          {/* Reuses the site's existing /login flow (authCard/signInForm) instead of a
              second, checkout-only login dialog. */}
          <Link
            href="/login"
            className="text-gray-1-foreground hover:text-secondary-foreground transition-colors duration-300"
          >
            Returning customer?{" "}
            <span className="text-secondary-foreground font-medium multiline-hover">
              Login
            </span>
          </Link>
          <span className="text-gray-2-foreground" aria-hidden="true">
            •
          </span>
          <CouponCodeForm />
        </div>
        <div className="grid lg:grid-cols-[auto_23.75rem] grid-cols-1 gap-6 items-start">
          <CheckoutForm />
          <CheckoutPayment />
        </div>
      </div>
    </main>
  );
};

export default Checkout;
