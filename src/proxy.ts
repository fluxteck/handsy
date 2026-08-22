import { type NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware-client";

/**
 * Next 16 renamed the `middleware` file convention to `proxy`; the API is
 * otherwise identical. Kept current so the deprecation warning doesn't mask a
 * real one later.
 *
 * Runs on every matched request to:
 *
 *  1. Refresh the Supabase auth cookie when it nears expiry. This is the only
 *     writable context in the request lifecycle — without it a session would
 *     silently go stale and start bouncing customers out of their account.
 *  2. Gate `/account/*` behind a real session, redirecting guests to
 *     `/login?from=<path>` so they land back where they were headed.
 *  3. Send already-signed-in customers away from `/login`, so nobody stares at
 *     a sign-in form they don't need.
 *
 * The matcher skips static assets, the image optimizer and `/api/*` so we
 * don't burn an invocation per chunk.
 */
export async function proxy(request: NextRequest) {
  const { response, userId } = await updateSupabaseSession(request);
  const { pathname, search } = request.nextUrl;

  /**
   * Recently-viewed is the one account page with nothing owner-scoped behind
   * it: the history lives in this browser's `localStorage`, so there is no
   * session to check and nothing another customer could see. Gating it would
   * send a guest to sign in only to be shown data they already had.
   */
  const isPublicAccountPage = pathname.startsWith("/account/recently-viewed");
  const isAccount = pathname.startsWith("/account") && !isPublicAccountPage;
  const isLoginPage = pathname === "/login" || pathname === "/register";

  if (isAccount && !userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("from", pathname + (search ?? ""));
    return NextResponse.redirect(url);
  }

  if (isLoginPage && userId) {
    const url = request.nextUrl.clone();
    const from = request.nextUrl.searchParams.get("from");
    url.pathname = from && from.startsWith("/") ? from : "/account";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|woff|woff2|ttf|eot)$).*)",
  ],
};
