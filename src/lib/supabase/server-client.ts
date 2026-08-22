import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "../config";

/**
 * Server-side Supabase client for RSCs, Route Handlers and Server Actions.
 * Reads the session from the request cookies via `next/headers`.
 *
 * Not memoised, unlike the browser client — each request carries its own
 * cookie jar, so a shared instance would leak one visitor's session into
 * another's request.
 *
 * The `setAll` no-op catch matters: Server Components are forbidden from
 * writing cookies, and Supabase attempts a write whenever it refreshes an
 * expiring token. Swallowing it here is safe **because middleware refreshes
 * the cookie on every navigation** (see `middleware.ts`) — that's the writable
 * context where the refresh actually lands.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — middleware handles the refresh.
        }
      },
    },
  });
}
