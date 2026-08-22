import { getEnv } from "../config";

/**
 * Checkout + payments HTTP — the one corner the typed SDK doesn't cover.
 *
 * `/checkout/*` and `/payments/*` are payment-flow orchestration rather than
 * CRUD, so they aren't part of the `@commercekitsdk/core` adapter contract and
 * there is no `client.checkout.*` to call. These thin typed wrappers live here,
 * under `src/lib/sdk/`, so the rest of the app keeps its "no raw HTTP" rule and
 * every exception is in one reviewable place.
 *
 * Everything that decides money stays server-side: the charge amount comes from
 * `carts.grand_total`, and the order is only created after the server asks the
 * payment provider to confirm the intent. Nothing here can influence a price.
 */

/** Provider intent returned by `/checkout/sessions`. For Razorpay this carries
 *  the Razorpay order id; COD resolves to `status: "pending"`. */
export interface CheckoutIntent {
  id: string;
  provider: string;
  status: string;
  amount: { amount: number; currency: string };
  /** Razorpay: `{ orderId, keyId }`. COD adds `cod: true`. */
  providerData?: { orderId?: string; keyId?: string } & Record<string, unknown>;
}

export interface CheckoutSession {
  sessionId: string;
  intent: CheckoutIntent;
}

export interface ConfirmResult {
  status: string;
  order?: { id: string };
}

/** Address snapshot sent at checkout (matches the SDK `Address` field names). */
export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone?: string;
}

/** Shipping + tax for a cart, before committing to a payment. */
export interface CheckoutEstimate {
  subtotal?: { amount: number; currency: string };
  shipping?: { amount: number; currency: string };
  tax?: { amount: number; currency: string };
  discount?: { amount: number; currency: string };
  total?: { amount: number; currency: string };
}

async function authHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};
  try {
    const { getSupabaseBrowserClient } = await import("../supabase/browser-client");
    const { data } = await getSupabaseBrowserClient().auth.getSession();
    const token = data.session?.access_token;
    return token ? { authorization: `Bearer ${token}` } : {};
  } catch {
    // Unconfigured Supabase — proceed as a guest.
    return {};
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const base = getEnv().NEXT_PUBLIC_SERVER_URL.replace(/\/+$/, "");
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(await authHeader()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const data = (await res.json()) as { message?: string; code?: string };
      detail = data.message ?? data.code ?? "";
    } catch {
      detail = await res.text().catch(() => "");
    }
    console.error("[handsy:checkout] request failed", { path, status: res.status, detail });
    throw new Error(detail || `Checkout request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

/**
 * Start a checkout session → mints the provider order and returns the intent.
 * `method: "cod"` records the order without collecting payment online.
 */
export async function createCheckoutSession(
  cartId: string,
  email: string,
  options?: {
    shippingAddress?: CheckoutAddress;
    billingAddress?: CheckoutAddress;
    method?: "online" | "cod";
  },
): Promise<CheckoutSession> {
  return post<CheckoutSession>("/checkout/sessions", { cartId, email, ...options });
}

/**
 * Apply shipping + destination tax to a cart.
 *
 * Despite the name this is a WRITE: the server calls `applyShippingAndTax`,
 * which sets `shipping_total` / `tax_total` on the cart and re-derives
 * `grand_total`. Since `POST /checkout/sessions` charges `grand_total`, a cart
 * that never passes through here is charged its subtotal only — no shipping,
 * no tax. Call it before creating a session.
 *
 * IMPORTANT: the endpoint takes an `addressId` — a row in the customer's
 * `addresses` table — not an inline address. Guests have no saved address, so
 * there is currently **no way for a guest checkout to have shipping or tax
 * applied**. Closing that needs a server change (accept an inline address, or
 * persist the checkout address first); see BUILD-ORDER.md.
 */
export async function applyShippingAndTax(
  cartId: string,
  addressId: string,
  shippingRateId?: string,
): Promise<CheckoutEstimate> {
  return post<CheckoutEstimate>("/checkout/estimate", {
    cartId,
    addressId,
    ...(shippingRateId ? { shippingRateId } : {}),
  });
}

/**
 * Confirm payment by intent id. The SERVER asks the provider for the real
 * status and creates the order only on success — the browser cannot assert
 * that a payment happened. Replaying a confirmed intent returns the existing
 * order rather than creating a second one.
 */
export async function confirmCheckoutPayment(intentId: string): Promise<ConfirmResult> {
  return post<ConfirmResult>(`/payments/${encodeURIComponent(intentId)}/confirm`, {});
}
