import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Next 16 removed `next lint`, so linting runs through the ESLint CLI against
 * this flat config. Mirrors handsymarket-store, which is on the same Next
 * version, so the two storefronts report the same problems.
 *
 * The bespoke rule enforces this repo's architecture rule mechanically: the
 * storefront never talks to the server directly — everything goes through
 * `getStorefrontClient()` in `src/lib/sdk/`. That single seam is what keeps
 * cache keys, error shaping and auth handling consistent, and it is easy to
 * bypass by accident with a stray `fetch`.
 *
 * Exemptions: `src/lib/sdk/**` is the wrapper itself, and `src/app/api/**` are
 * server route handlers where a direct call is legitimate.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/components/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
    ignores: ["src/app/api/**", "src/lib/sdk/**"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Use the storefront SDK (`getStorefrontClient()` from @/lib/sdk) — components must not call fetch directly.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "Use the storefront SDK (`getStorefrontClient()` from @/lib/sdk) instead of axios.",
            },
          ],
        },
      ],
    },
  },
  {
    /**
     * Two React-compiler rules are demoted to warnings — kept visible, not
     * silenced, because each flags a pattern this codebase uses deliberately:
     *
     * `set-state-in-effect` fires on every SSR-safe hydration. A cookie,
     * `localStorage` value or Supabase session cannot be read during a server
     * render, so the value is unknown on the first paint and applied in a
     * mount effect — that is the cart cookie, the wishlist and the customer
     * session. The compiler-friendly alternative is `useSyncExternalStore`,
     * which would mean rewriting verified cart/session/wishlist hydration for
     * no behavioural gain.
     *
     * `refs` fires on two documented third-party idioms: Redux's own lazy
     * store init (`if (!ref.current) ref.current = makeStore()`) in
     * `StoreProvider`, and Swiper's navigation refs in `productCarousel`.
     *
     * A genuine cascading-render bug would still surface here as a warning, so
     * new ones are worth reading rather than assuming they belong to this set.
     */
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
  // Override the default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
