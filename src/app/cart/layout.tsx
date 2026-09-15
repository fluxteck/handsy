import type { ReactNode } from "react";

/**
 * Cart gets its own layout, outside the `(innerPage)` group, so it can skip
 * the site header/footer/mobile nav that every other page shares — mirrors
 * the same setup used for `/checkout`.
 */
const CartLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default CartLayout;
