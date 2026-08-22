import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "../config";

/**
 * Refreshes the Supabase auth cookie on each matched request and reports who
 * the visitor is.
 *
 * This is the one writable context in the Next request lifecycle where a token
 * refresh can be persisted — Server Components can read cookies but not set
 * them. Without this, a customer's session would quietly expire mid-browse and
 * account pages would start bouncing them to sign-in.
 *
 * `auth.getUser()` is used rather than `getSession()` on purpose: it validates
 * the token against Supabase instead of trusting whatever the cookie claims.
 *
 * Fails open. If Supabase is unconfigured or unreachable, the visitor is
 * treated as a guest and browsing continues — a flaky identity provider should
 * never take the storefront down.
 */
export async function updateSupabaseSession(request: NextRequest): Promise<{
  response: NextResponse;
  userId: string | null;
}> {
  let response = NextResponse.next({ request });

  let url: string;
  let anonKey: string;
  try {
    ({ url, anonKey } = getSupabaseEnv());
  } catch {
    return { response, userId: null };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Write to the request (so downstream handlers in this same pass see
        // the fresh cookie) and to the response (so the browser stores it).
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    const { data } = await supabase.auth.getUser();
    return { response, userId: data.user?.id ?? null };
  } catch {
    return { response, userId: null };
  }
}
