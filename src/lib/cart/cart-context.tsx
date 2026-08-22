"use client";

import { isPendingItemId, type Cart } from "@commercekitsdk/core";
import { CommerceProvider, useCart as useSdkCart } from "@commercekitsdk/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { getStorefrontClient } from "../sdk/client";
import { clearCartCookie, getOrCreateCartId, readCartCookie } from "./cart-cookie";

/**
 * The cart, served by handsymarket-server through the SDK.
 *
 * State, optimistic updates and rollback all live in the SDK: `useCart` from
 * `@commercekitsdk/react` subscribes to the client's cache, and the client
 * applies each mutation optimistically before the request and reverts it if
 * the server refuses. Because every hook reads the same cache key, the header
 * badge, the drawer and the cart page cannot disagree.
 *
 * This provider is deliberately thin. It owns only what the SDK has no opinion
 * about:
 *
 *  1. **Cart identity** — minting and persisting the `handsy_cart` cookie, and
 *     dropping it when the server has forgotten the cart.
 *  2. **View shape** — the template's markup binds
 *     `products[{ id, price, thumbnail, title, quantity }]`, so SDK `CartItem`s
 *     (with `Money` objects) are mapped once here rather than changing every
 *     component.
 *  3. **Add previews** — supplying the catalogue details of a product the cart
 *     has never held, so the line renders immediately. The SDK cannot invent
 *     these: its cache holds carts, not products.
 */

/** One line, in the shape the existing components already destructure. */
export interface CartLineView {
  /** Cart item id — what remove/increment/decrement take. */
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  thumbnail: string;
  /** Major units, for display. */
  price: number;
  quantity: number;
  currency: string;
  /** Awaiting the server's acknowledgement; no real item id yet. */
  pending: boolean;
}

interface CartContextValue {
  products: CartLineView[];
  itemCount: number;
  subTotal: number;
  currency: string;
  isLoading: boolean;
  isMutating: boolean;
  add: (input: {
    variantId?: string;
    quantity?: number;
    title?: string;
    thumbnail?: string;
    price?: number;
    currency?: string;
  }) => Promise<void>;
  increment: (itemId: string) => Promise<void>;
  decrement: (itemId: string) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  /** Drop the cookie after an order so the next visit starts fresh. */
  reset: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const FALLBACK_IMAGE = "/images/home-1/top-collections/img-1.webp";

/** Minor units → major. Mirrors the catalogue mapper. */
const toMajor = (amount: number): number => amount / 100;

function toLines(cart: Cart | undefined): CartLineView[] {
  if (!cart) return [];
  return cart.items.map((item) => ({
    id: String(item.id),
    productId: String(item.productId),
    variantId: String(item.variantId),
    title: item.title,
    variantTitle: item.variantTitle ?? "",
    thumbnail: item.imageUrl || FALLBACK_IMAGE,
    price: toMajor(item.unitPrice.amount),
    quantity: item.quantity,
    currency: item.unitPrice.currency,
    // `pending` is set by the SDK's optimistic reducer; the id check covers
    // any line it synthesised.
    pending: Boolean(item.pending) || isPendingItemId(String(item.id)),
  }));
}

/** Details used to draw a line before the server has acknowledged it. */
type AddInput = Parameters<CartContextValue["add"]>[0];

/**
 * Cart state for a known cart id. Mounted only once a cart exists, because
 * `useCart` needs an id and we don't mint one until something is added.
 */
function CartState({
  cartId,
  pendingAdd,
  onPendingAddHandled,
  children,
}: {
  cartId: string;
  /** An add that arrived before the cart id existed; replayed on mount. */
  pendingAdd: AddInput | null;
  onPendingAddHandled: () => void;
  children: ReactNode;
}) {
  const { cart, isLoading, error, add, update, remove, clear } = useSdkCart(cartId);
  const [isMutating, setIsMutating] = useState(false);

  // A cart the server has forgotten (TTL, cleared by ops) reads as not_found.
  // Drop the stale cookie so the next add starts from a fresh one.
  useEffect(() => {
    if (error?.code === "not_found") clearCartCookie();
  }, [error]);

  const lines = useMemo(() => toLines(cart), [cart]);

  /** Run a mutation, translating SDK errors into something a shopper can act on. */
  const run = useCallback(async (op: () => Promise<unknown>, failureMessage: string) => {
    setIsMutating(true);
    try {
      await op();
      return true;
    } catch (err) {
      const code = (err as { code?: string })?.code;
      // The server refuses to oversell; say so specifically rather than
      // showing a generic failure the shopper can't act on.
      toast.error(
        code === "out_of_stock" || code === "insufficient_inventory"
          ? "Sorry — there isn't enough stock left for that."
          : failureMessage,
      );
      return false;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const addLine = useCallback<CartContextValue["add"]>(
    async ({ variantId, quantity = 1, title, thumbnail, price, currency }) => {
      if (!variantId) {
        // Sample-data surfaces have no variant, so there is nothing the server
        // could add. Better to say so than to fake a basket that can't check out.
        toast.error("This item isn't available to order yet.");
        return;
      }
      // Confirm optimistically, in step with the line the SDK has already drawn.
      // Waiting for the round trip made the toast arrive seconds after the item
      // it was describing — long enough to read as unrelated to the click.
      // If the server then refuses, the toast is withdrawn and `run` explains
      // why, matching the SDK's own optimistic-then-reconcile model.
      const optimistic = toast.success(title ? `${title} added to cart` : "Added to cart");
      const ok = await run(
        () =>
          add(variantId, quantity, {
            // Lets the SDK draw the line before the round trip completes.
            ...(title ? { title } : {}),
            ...(thumbnail ? { imageUrl: thumbnail } : {}),
            ...(price != null
              ? { unitPrice: { amount: Math.round(price * 100), currency: currency || "INR" } }
              : {}),
          }),
        "Couldn't add that to your cart.",
      );
      if (!ok) toast.dismiss(optimistic);
    },
    [add, run],
  );

  // Replay an add that was made before a cart existed.
  const replayed = useRef(false);
  useEffect(() => {
    if (pendingAdd && !replayed.current) {
      replayed.current = true;
      void addLine(pendingAdd).finally(onPendingAddHandled);
    }
  }, [pendingAdd, addLine, onPendingAddHandled]);

  const setQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      // Still provisional — the server hasn't issued a real item id yet, and
      // it will arrive with the correct quantity in a moment anyway.
      if (isPendingItemId(itemId)) return;
      await run(() => update(itemId, quantity), "Couldn't update the quantity.");
    },
    [update, run],
  );

  const increment = useCallback(
    async (itemId: string) => {
      const line = lines.find((l) => l.id === itemId);
      if (line) await setQuantity(itemId, line.quantity + 1);
    },
    [lines, setQuantity],
  );

  const decrement = useCallback(
    async (itemId: string) => {
      const line = lines.find((l) => l.id === itemId);
      // 1 is the floor; removing is an explicit action.
      if (line && line.quantity > 1) await setQuantity(itemId, line.quantity - 1);
    },
    [lines, setQuantity],
  );

  const removeLine = useCallback(
    async (itemId: string) => {
      if (isPendingItemId(itemId)) return;
      await run(() => remove(itemId), "Couldn't remove that item.");
    },
    [remove, run],
  );

  const clearAll = useCallback(
    async () => {
      await run(() => clear(), "Couldn't empty your cart.");
    },
    [clear, run],
  );

  const reset = useCallback(() => {
    clearCartCookie();
    // The SDK cache still holds the old cart; drop it so the UI doesn't show a
    // basket that has already become an order.
    getStorefrontClient().cache.invalidateTag("carts");
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      products: lines,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      /* The SDK keeps totals in step with its optimistic lines, so this
         follows a pending change and then settles on the server's figure —
         the one that includes discounts, tax and rounding. */
      subTotal: cart ? toMajor(cart.totals.subtotal.amount) : 0,
      currency: cart?.currency ?? lines[0]?.currency ?? "INR",
      isLoading,
      isMutating,
      add: addLine,
      increment,
      decrement,
      remove: removeLine,
      clear: clearAll,
      reset,
    }),
    [lines, cart, isLoading, isMutating, addLine, increment, decrement, removeLine, clearAll, reset],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Stand-in until a cart exists. The first add mints the id, which mounts
 * `<CartState/>`; the add itself is handed over and replayed there.
 */
function NoCart({
  children,
  onFirstAdd,
}: {
  children: ReactNode;
  onFirstAdd: (input: AddInput) => void;
}) {
  const value = useMemo<CartContextValue>(
    () => ({
      products: [],
      itemCount: 0,
      subTotal: 0,
      currency: "INR",
      isLoading: false,
      isMutating: false,
      add: async (input) => {
        if (!input.variantId) {
          toast.error("This item isn't available to order yet.");
          return;
        }
        onFirstAdd(input);
      },
      increment: async () => {},
      decrement: async () => {},
      remove: async () => {},
      clear: async () => {},
      reset: () => {},
    }),
    [onFirstAdd],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function CartProvider({ children }: { children: ReactNode }) {
  /* Resolved on the client only: the cookie doesn't exist during SSR, and
     minting one on the server would hand every visitor the same cart. */
  const [cartId, setCartId] = useState<string | null>(null);
  const [pendingAdd, setPendingAdd] = useState<AddInput | null>(null);

  useEffect(() => {
    setCartId(readCartCookie());
  }, []);

  const handleFirstAdd = useCallback((input: AddInput) => {
    setCartId(getOrCreateCartId());
    setPendingAdd(input);
  }, []);

  const handlePendingAddHandled = useCallback(() => setPendingAdd(null), []);

  const client = getStorefrontClient();

  return (
    <CommerceProvider client={client}>
      {cartId ? (
        <CartState
          cartId={cartId}
          pendingAdd={pendingAdd}
          onPendingAddHandled={handlePendingAddHandled}
        >
          {children}
        </CartState>
      ) : (
        <NoCart onFirstAdd={handleFirstAdd}>{children}</NoCart>
      )}
    </CommerceProvider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
