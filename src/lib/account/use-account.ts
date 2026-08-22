"use client";

import type {
  AdapterContext,
  CreateAddressInput,
  UpdateAddressInput,
  UpdateCustomerInput,
} from "@commercekitsdk/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCustomerReviews } from "@commercekitsdk/react";
import type {
  AddressType,
  CustomerReviewType,
  CustomerType,
  OrderType,
} from "@/types/accountType";
import { getEnv } from "../config";
import { getStorefrontClient } from "../sdk/client";
import { getSupabaseBrowserClient } from "../supabase/browser-client";
import {
  toAddressTypes,
  toCustomerReviewTypes,
  toCustomerType,
  toOrderType,
  toOrderTypes,
} from "../mappers/account";

/**
 * Account data, fetched in the BROWSER — deliberately, not on the server.
 *
 * Two reasons, both load-bearing:
 *
 *  1. **Authorization.** The server enforces ownership from the caller's JWT:
 *     `users.*` and `addresses.*` go through `requireSelf`, and `orders.list`
 *     overrides `customerId` with the session's. Our server-side SDK client is
 *     anonymous (`getAuthToken` returns null without a `window`), so the same
 *     calls would 401 there.
 *  2. **Cache isolation.** `getStorefrontClient()` is a module singleton, and
 *     the SDK caches every read for 60s with a 5-minute stale window. On the
 *     server that cache is shared by every visitor — putting one customer's
 *     orders in it could serve them to another. In the browser each tab has
 *     its own instance, so the cache is naturally per-customer.
 *
 * Ownership is still enforced server-side regardless; this is about not asking
 * for data as the wrong identity, not about trusting the client.
 */

/** `users.*` isn't sugar-wrapped on the client, so it needs a context. */
function ctx(customerId: string): AdapterContext {
  return { currency: getEnv().NEXT_PUBLIC_CURRENCY, locale: "en-IN", customerId };
}

/** The signed-in customer's id (= Supabase auth user id = `customers.id`). */
export function useCustomerId(): { customerId: string | null; ready: boolean } {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await getSupabaseBrowserClient().auth.getUser();
        if (active) setCustomerId(data.user?.id ?? null);
      } catch {
        if (active) setCustomerId(null);
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { customerId, ready };
}

interface Resource<T> {
  data: T;
  loading: boolean;
  /** Set when the fetch failed, so screens can say so instead of showing an
   *  empty state that implies "you have none". */
  error: string | null;
  reload: () => void;
}

/** Shared fetch-on-mount plumbing with an explicit reload for mutations. */
function useResource<T>(
  fetcher: (() => Promise<T>) | null,
  initial: T,
  deps: unknown[],
): Resource<T> {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!fetcher) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => active && setData(result))
      .catch((err) => {
        console.error("[handsy:account] load failed", err);
        if (active) setError("We couldn't load this right now. Please refresh.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { data, loading, error, reload: useCallback(() => setNonce((n) => n + 1), []) };
}

// ── Orders ──────────────────────────────────────────────────────────────

export function useMyOrders(): Resource<OrderType[]> {
  const { customerId, ready } = useCustomerId();
  return useResource<OrderType[]>(
    ready && customerId
      ? async () => {
          // `customerId` is ignored by the server, which substitutes the
          // session's — passing it would not grant access to anyone else's.
          const page = await getStorefrontClient().orders.list({ limit: 50 });
          return toOrderTypes(page.items);
        }
      : null,
    [],
    [customerId, ready],
  );
}

/**
 * The customer's own reviews, including the ones still awaiting moderation.
 *
 * The work is the SDK's: `useCustomerReviews` feature-detects
 * `reviews.listByCustomer`, resolves the request context and subscribes to the
 * client cache. An adapter without that operation resolves to an empty page
 * rather than throwing, so this screen renders on any backend. All that is
 * left here is mapping to the shape the panel already renders.
 *
 * The server scopes the read to the session's own customer, so the unpublished
 * rows returned here are only ever the caller's own.
 */
export function useMyReviews(): Resource<CustomerReviewType[]> {
  const { customerId, ready } = useCustomerId();
  const { data, isLoading, error, refetch } = useCustomerReviews(
    ready && customerId ? customerId : undefined,
    { limit: 50 },
  );

  return {
    data: useMemo(() => toCustomerReviewTypes(data?.items ?? []), [data]),
    // `ready` gates the fetch, so the screen is still loading before the
    // session resolves — not empty.
    loading: isLoading || !ready,
    error: error ? error.message : null,
    reload: refetch,
  };
}

export function useMyOrder(orderId: string | undefined): Resource<OrderType | null> {
  const { customerId, ready } = useCustomerId();
  return useResource<OrderType | null>(
    ready && customerId && orderId
      ? async () => toOrderType(await getStorefrontClient().orders.get(orderId))
      : null,
    null,
    [customerId, ready, orderId],
  );
}

// ── Profile ─────────────────────────────────────────────────────────────

export function useMyProfile(): Resource<CustomerType | null> & {
  save: (input: UpdateCustomerInput) => Promise<void>;
} {
  const { customerId, ready } = useCustomerId();
  const resource = useResource<CustomerType | null>(
    ready && customerId
      ? async () =>
          toCustomerType(
            await getStorefrontClient().adapter.users.get(customerId, ctx(customerId)),
          )
      : null,
    null,
    [customerId, ready],
  );

  const save = useCallback(
    async (input: UpdateCustomerInput) => {
      if (!customerId) throw new Error("Not signed in");
      await getStorefrontClient().adapter.users.update(customerId, input, ctx(customerId));
      resource.reload();
    },
    [customerId, resource],
  );

  return { ...resource, save };
}

// ── Addresses ───────────────────────────────────────────────────────────

export function useMyAddresses(): Resource<AddressType[]> & {
  add: (input: CreateAddressInput) => Promise<void>;
  update: (addressId: string, input: UpdateAddressInput) => Promise<void>;
  remove: (addressId: string) => Promise<void>;
} {
  const { customerId, ready } = useCustomerId();
  const resource = useResource<AddressType[]>(
    ready && customerId
      ? async () =>
          toAddressTypes(
            await getStorefrontClient().adapter.users.addresses.list(customerId, ctx(customerId)),
          )
      : null,
    [],
    [customerId, ready],
  );

  const users = () => getStorefrontClient().adapter.users;

  const add = useCallback(
    async (input: CreateAddressInput) => {
      if (!customerId) throw new Error("Not signed in");
      await users().addresses.add(customerId, input, ctx(customerId));
      resource.reload();
    },
    [customerId, resource],
  );

  const update = useCallback(
    async (addressId: string, input: UpdateAddressInput) => {
      if (!customerId) throw new Error("Not signed in");
      await users().addresses.update(customerId, addressId, input, ctx(customerId));
      resource.reload();
    },
    [customerId, resource],
  );

  const remove = useCallback(
    async (addressId: string) => {
      if (!customerId) throw new Error("Not signed in");
      await users().addresses.remove(customerId, addressId, ctx(customerId));
      resource.reload();
    },
    [customerId, resource],
  );

  return { ...resource, add, update, remove };
}
