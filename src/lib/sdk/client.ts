import { createCommerceClient, type CommerceClient } from "@commercekitsdk/core";
import { createRestAdapter } from "@commercekitsdk/adapter-rest";
import { getEnv } from "../config";

/**
 * The single storefront client. Every read the store performs goes through
 * here — no `fetch`, no `axios`, no REST URLs anywhere else in the app. One
 * seam keeps cache keys, error shaping and observability consistent, and makes
 * swapping the transport a one-file change.
 *
 * A singleton because the REST adapter is stateless apart from its base URL,
 * and because reusing one instance means one shared cache across the request.
 *
 * Auth: each request can carry the customer's Supabase JWT. It's resolved
 * per-request via `getAuthToken` so we always send the freshest token rather
 * than caching one that may since have refreshed. Browser-only — RSCs see
 * `window === undefined` and stay anonymous, which is correct for the public
 * catalogue; server-side reads of customer-owned data resolve the session
 * through `getServerSession()` at their own layer.
 */
let cached: CommerceClient | undefined;

/**
 * Wraps global fetch so a failed SDK call logs something useful before the
 * exception reaches the RSC. Without it, Next replaces the message with a
 * digest in production and the real cause is lost. Lines are tagged
 * `[handsy:sdk]` so they're greppable in server output.
 */
/**
 * How long a server-rendered page may reuse a catalogue response.
 *
 * Next persists its fetch cache in `.next/cache`, and Vercel restores that
 * between deployments — so a fetch with no expiry is cached *indefinitely* and
 * a fresh deploy can ship data captured by an earlier build. That was
 * observable: after changing a record, a clean rebuild still rendered the old
 * value, and only deleting `.next/cache/fetch-cache` produced the new one.
 *
 * Matching the SDK client's own 60s TTL keeps one story about staleness.
 * Customer-scoped reads are unaffected — they run in the browser precisely so
 * they never touch a shared cache.
 */
const CATALOGUE_REVALIDATE_SECONDS = 60;

const loggingFetch: typeof fetch = async (input, init) => {
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const method = init?.method ?? "GET";

  /* Applied only on the server: `next` is meaningless in the browser, and only
     a caller that hasn't already chosen its own policy is given this default. */
  const requestInit: RequestInit =
    typeof window === "undefined" && !init?.cache
      ? { ...init, next: { revalidate: CATALOGUE_REVALIDATE_SECONDS, ...(init as { next?: object })?.next } }
      : (init as RequestInit);

  try {
    const res = await fetch(input, requestInit);
    if (!res.ok) {
      // Clone before reading — the SDK still needs to consume the body.
      const body = await res
        .clone()
        .text()
        .catch(() => "<unreadable>");
      console.error(
        "[handsy:sdk] non-2xx response",
        JSON.stringify({ method, url, status: res.status, bodyPreview: body.slice(0, 500) }),
      );
    }
    return res;
  } catch (err) {
    console.error(
      "[handsy:sdk] fetch threw",
      JSON.stringify({
        method,
        url,
        name: (err as Error)?.name,
        message: (err as Error)?.message,
        cause: String((err as { cause?: unknown })?.cause ?? ""),
      }),
    );
    throw err;
  }
};

export function getStorefrontClient(): CommerceClient {
  if (cached) return cached;

  const env = getEnv();
  cached = createCommerceClient({
    adapter: createRestAdapter({
      baseUrl: env.NEXT_PUBLIC_SERVER_URL,
      name: "handsy-storefront",
      fetch: loggingFetch,
      getAuthToken: async () => {
        if (typeof window === "undefined") return null;
        try {
          const { getSupabaseBrowserClient } = await import(
            "../supabase/browser-client"
          );
          const { data } = await getSupabaseBrowserClient().auth.getSession();
          return data.session?.access_token ?? null;
        } catch {
          // Supabase unconfigured or unreachable — browse anonymously.
          return null;
        }
      },
    }),
    currency: env.NEXT_PUBLIC_CURRENCY,
    /*
     * Stated explicitly rather than inherited, because the defaults are load
     * bearing and easy to be surprised by: the SDK caches every read for 60s
     * and will then serve a STALE value for a further 5 minutes while it
     * refreshes in the background. On the server this client is a singleton,
     * so that cache lives for the life of the process and is shared by every
     * visitor — which is why a page can still render products seconds after
     * the API goes down, and why `export const dynamic = "force-dynamic"`
     * doesn't by itself guarantee a fresh read.
     *
     * For public catalogue data that sharing is a feature: it absorbs backend
     * blips and collapses duplicate queries. It is NOT safe for anything
     * customer-scoped. Server-side calls here are anonymous (`getAuthToken`
     * returns null unless there's a `window`), so nothing personal enters this
     * cache today — but any future RSC that fetches orders, addresses or a
     * profile through this singleton would risk serving one customer's data to
     * another. Such reads belong on the browser client, or need their own
     * per-request client.
     */
    cache: {
      defaultTtlMs: 60_000,
      defaultStaleWhileRevalidateMs: 300_000,
    },
  });

  return cached;
}
