"use client";

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
import { getEnv } from "../config";
import { getStorefrontClient } from "../sdk/client";
import { useCustomerId } from "../account/use-account";
import { toProductType } from "../mappers/product";
import type { ProductType } from "@/types/productType";

/**
 * Wishlist — server-backed when signed in, local while a guest.
 *
 * The server's wishlist is **owner-scoped**: `requireSelf` means it only
 * exists for an authenticated customer. Making the feature sign-in-only would
 * break a working part of the storefront for every visitor who hasn't logged
 * in, so guests keep a local list and it is **merged into the server list on
 * sign-in** — the same bargain the cart makes.
 *
 * Storage shape differs by design. The server stores only `productId` (plus an
 * optional variant), which is the right thing to persist: titles, prices and
 * images change, and a wishlist should reflect the product as it is now, not
 * as it was when saved. That means the page has to hydrate products, so the
 * saved ids are resolved through `products.get` — deduped and cached by the
 * SDK, and issued in parallel.
 */

/** One saved product, in the shape the wishlist screens already render. */
export type WishlistEntry = ProductType & {
  /** Wishlist item id — what `wishlist.remove` takes. Absent for guests. */
  itemId?: string;
  /** When it was saved, for the "Added on" column. */
  date: string;
  /** Chosen colour/variant label, shown in the saved-items table. Only set
   *  when the shopper picked one before saving. */
  color?: string;
};

interface WishlistContextValue {
  products: WishlistEntry[];
  count: number;
  isLoading: boolean;
  /** True once we know whether the visitor is signed in. */
  ready: boolean;
  has: (productId: string | number) => boolean;
  add: (product: ProductType) => Promise<void>;
  remove: (productId: string | number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "handsy_wishlist";

/** Guest list — full snapshots, since there's no server to hydrate from. */
function readLocal(): WishlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistEntry[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(entries: WishlistEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Private browsing / quota — the list just won't survive a reload.
  }
}

function ctx(customerId: string) {
  return { currency: getEnv().NEXT_PUBLIC_CURRENCY, locale: "en-IN", customerId };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { customerId, ready } = useCustomerId();
  const [products, setProducts] = useState<WishlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mergedFor = useRef<string | null>(null);

  /** Resolve saved ids into renderable products. */
  const hydrate = useCallback(
    async (cid: string): Promise<WishlistEntry[]> => {
      const client = getStorefrontClient();
      const wishlist = await client.adapter.wishlist!.get(cid, ctx(cid));
      const entries = await Promise.all(
        wishlist.items.map(async (item): Promise<WishlistEntry | null> => {
          try {
            const product = await client.products.get(String(item.productId));
            return {
              ...toProductType(product),
              itemId: String(item.id),
              date: item.addedAt,
            };
          } catch {
            // A product that has since been unpublished or deleted shouldn't
            // take the whole page down; drop it from the view.
            return null;
          }
        }),
      );
      return entries.filter((e): e is WishlistEntry => e !== null);
    },
    [],
  );

  // Load, and merge any guest list on first sign-in.
  useEffect(() => {
    if (!ready) return;
    let active = true;

    (async () => {
      if (!customerId) {
        if (active) {
          setProducts(readLocal());
          setIsLoading(false);
        }
        return;
      }

      try {
        // One-time merge: push anything saved as a guest, then clear it so a
        // later sign-out doesn't resurrect a stale copy.
        if (mergedFor.current !== customerId) {
          mergedFor.current = customerId;
          const local = readLocal();
          if (local.length) {
            const client = getStorefrontClient();
            await Promise.all(
              local.map((entry) =>
                client.adapter
                  .wishlist!.add(customerId, String(entry.id), ctx(customerId))
                  .catch(() => undefined),
              ),
            );
            writeLocal([]);
          }
        }
        const entries = await hydrate(customerId);
        if (active) setProducts(entries);
      } catch (err) {
        console.error("[handsy:wishlist] failed to load", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [customerId, ready, hydrate]);

  const has = useCallback(
    (productId: string | number) => products.some((p) => String(p.id) === String(productId)),
    [products],
  );

  const add = useCallback(
    async (product: ProductType) => {
      if (has(product.id)) {
        toast("Already in your wishlist");
        return;
      }
      const entry: WishlistEntry = { ...product, date: new Date().toISOString() };

      if (!customerId) {
        const next = [...readLocal(), entry];
        writeLocal(next);
        setProducts(next);
        toast.success("Added to wishlist");
        return;
      }

      try {
        await getStorefrontClient().adapter.wishlist!.add(
          customerId,
          String(product.id),
          ctx(customerId),
        );
        setProducts(await hydrate(customerId));
        toast.success("Added to wishlist");
      } catch (err) {
        console.error("[handsy:wishlist] add failed", err);
        toast.error("Couldn't add that to your wishlist.");
      }
    },
    [customerId, has, hydrate],
  );

  const remove = useCallback(
    async (productId: string | number) => {
      if (!customerId) {
        const next = readLocal().filter((p) => String(p.id) !== String(productId));
        writeLocal(next);
        setProducts(next);
        toast.success("Removed from wishlist");
        return;
      }

      // The server removes by wishlist ITEM id, not product id.
      const entry = products.find((p) => String(p.id) === String(productId));
      if (!entry?.itemId) return;

      try {
        await getStorefrontClient().adapter.wishlist!.remove(
          customerId,
          entry.itemId,
          ctx(customerId),
        );
        setProducts((prev) => prev.filter((p) => p.itemId !== entry.itemId));
        toast.success("Removed from wishlist");
      } catch (err) {
        console.error("[handsy:wishlist] remove failed", err);
        toast.error("Couldn't remove that from your wishlist.");
      }
    },
    [customerId, products],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ products, count: products.length, isLoading, ready, has, add, remove }),
    [products, isLoading, ready, has, add, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctxValue = useContext(WishlistContext);
  if (!ctxValue) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctxValue;
}
