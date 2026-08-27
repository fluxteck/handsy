import { z } from "zod";

/**
 * Public environment surface. Everything here is `NEXT_PUBLIC_*` so Next
 * inlines it at build time — no secrets belong in this file.
 *
 * Validation is strict and lazy: the first runtime read throws with a message
 * naming the offending variable, so a misconfigured environment fails at boot
 * instead of surfacing as a mystery deep inside a render.
 */
const PublicEnvSchema = z.object({
  NEXT_PUBLIC_SERVER_URL: z
    .string()
    .url(
      "NEXT_PUBLIC_SERVER_URL must be a full URL including the /api prefix, e.g. http://localhost:3001/api",
    ),
  /** ISO 4217 code the storefront requests prices in. Defaults to USD. */
  NEXT_PUBLIC_CURRENCY: z
    .string()
    .length(3, "NEXT_PUBLIC_CURRENCY must be a 3-letter ISO 4217 code, e.g. USD or INR")
    .default("USD"),
  /**
   * Supabase project — customer identity only. Optional so the catalogue keeps
   * rendering on a deployment with no auth configured; `getSupabaseEnv()` is
   * the accessor that demands them, and only auth paths call it.
   */
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be the full https://<project>.supabase.co URL")
    .optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(20, "NEXT_PUBLIC_SUPABASE_ANON_KEY looks too short")
    .optional(),
  /**
   * Razorpay publishable key id. Safe in the browser by design — it only
   * identifies the merchant when opening the checkout modal. The SECRET must
   * never appear here; it stays on handsymarket-server, which is what actually
   * verifies payments. Optional because the server also returns the key id
   * alongside each intent, which is the preferred source.
   */
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  /**
   * Canonical public origin, e.g. `https://www.handsymarket.com`. Used for
   * `metadataBase`, canonical links and the sitemap's absolute URLs.
   * Optional: `getSiteUrl()` falls back to Vercel's production domain, then to
   * localhost, so a preview deploy or a dev server still emits usable URLs.
   */
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a full origin, e.g. https://www.handsymarket.com")
    .optional(),
});

type PublicEnv = z.infer<typeof PublicEnvSchema>;

let cached: PublicEnv | undefined;

export function getEnv(): PublicEnv {
  if (cached) return cached;

  const result = PublicEnvSchema.safeParse({
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_CURRENCY: process.env.NEXT_PUBLIC_CURRENCY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    const message = `Invalid public environment for handsy:\n${issues}\nSee .env.local.`;
    // The RSC error UI swallows messages in production, so log server-side too.
    // Markers only — never echo the values themselves.
    console.error("[handsy:env]", message, {
      seen: {
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL ?? "<missing>",
        NEXT_PUBLIC_CURRENCY: process.env.NEXT_PUBLIC_CURRENCY ?? "<missing>",
      },
    });
    throw new Error(message);
  }

  cached = result.data;
  return cached;
}

/** ISO 4217 code the catalogue is priced in. */
export function getStoreCurrency(): string {
  return getEnv().NEXT_PUBLIC_CURRENCY;
}

/**
 * Canonical origin for absolute URLs, with no trailing slash.
 *
 * Resolution order, most to least specific:
 *  1. `NEXT_PUBLIC_SITE_URL` — the deliberate answer; set this in production.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel's own production domain, so a
 *     deploy that forgot step 1 still emits real URLs rather than a placeholder.
 *  3. `http://localhost:3000` — dev, where absolute URLs only need to parse.
 *
 * Never guesses a domain: an unset value in an unknown environment yields
 * localhost, which is obviously wrong at a glance, rather than a plausible-
 * looking host that would silently poison canonicals and the sitemap.
 */
export function getSiteUrl(): string {
  const explicit = getEnv().NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = explicit ?? (vercel ? `https://${vercel}` : "http://localhost:3000");
  return url.replace(/\/+$/, "");
}

/**
 * Supabase credentials, demanded rather than optional. Auth paths call this so
 * a missing config fails with a clear message at the point of use instead of
 * silently degrading into a sign-in button that does nothing.
 */
export function getSupabaseEnv(): { url: string; anonKey: string } {
  const env = getEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. Sign-in and email " +
        "verification need them; the catalogue does not.",
    );
  }
  return { url, anonKey };
}
