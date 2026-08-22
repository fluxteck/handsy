/**
 * Guest cart identifier — a UUID in a client-readable cookie.
 *
 * Deliberately NOT HttpOnly: the storefront's cart calls run in the browser
 * through the SDK, so the id has to be readable there. That's safe because the
 * value is a random v4 UUID (122 bits of entropy) and carries no personal
 * data — it's a capability token for an anonymous basket, which is the same
 * model every guest-checkout store uses. Guessing another shopper's cart is
 * not a practical attack; the server additionally scopes anything genuinely
 * personal (orders, addresses) to the authenticated customer, never to this.
 *
 * `SameSite=Lax` keeps it off cross-site requests. `Secure` is set whenever
 * the page is served over HTTPS, so it never rides an insecure connection in
 * production while still working on http://localhost during development.
 *
 * Lifecycle: minted on first add-to-cart, cleared after an order is placed.
 * 30 days, so a basket survives a week of browsing.
 */
const COOKIE_NAME = "handsy_cart";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function readCartCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)handsy_cart=([^;]+)/);
  return match?.[1] ?? null;
}

function writeCartCookie(id: string): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax${secure}`;
}

export function clearCartCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

/** Existing cart id, or a freshly minted one persisted to the cookie. */
export function getOrCreateCartId(): string {
  const existing = readCartCookie();
  if (existing) return existing;
  const fresh = crypto.randomUUID();
  writeCartCookie(fresh);
  return fresh;
}
