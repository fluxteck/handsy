import type { ReactNode } from "react";

/**
 * Checkout gets its own layout, outside the `(innerPage)` group, so it can
 * skip the site header/footer/mobile nav that every other page shares — a
 * focused, distraction-free checkout with no path back into browsing except
 * the explicit "Back to home" link.
 */
const CheckoutLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default CheckoutLayout;
