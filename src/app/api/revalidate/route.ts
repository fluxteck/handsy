import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand cache busting, called by the admin after a catalogue change.
 *
 * Without this the storefront serves whatever it last fetched. That is mostly
 * invisible — a 60-second ISR window closes on its own — with one exception
 * that is not: when a product is **deleted**, every later refresh of its page
 * returns 404, Next keeps the last good response rather than evicting it, and
 * the page for a product that no longer exists is served indefinitely. One was
 * still live days after deletion, priced and titled, with the shop listing
 * correctly no longer showing it.
 *
 * The admin has been calling `/api/revalidate` since it was written. The route
 * never existed, so every call 404'd into a `.catch(() => undefined)` and the
 * admin reported success. That is the whole reason edits appeared not to take.
 */

/**
 * Route shapes this storefront actually serves.
 *
 * Checked rather than trusted: the admin builds paths from its own idea of the
 * URL structure, and it was wrong — it asked for `/products/<slug>` and
 * `/shop/<slug>`, neither of which this app has ever served, while the real
 * pages sat at `/product-details/<slug>` and `/category/<slug>`. Revalidating
 * a path that matches no route is silently a no-op, so a typo here is
 * indistinguishable from success. Anything unrecognised comes back in the
 * response instead, where the caller can log it.
 */
const KNOWN_ROUTES: RegExp[] = [
  /^\/$/,
  /^\/shop$/,
  /^\/collections$/,
  /^\/collections\/[^/]+$/,
  /^\/category$/,
  /^\/category\/[^/]+$/,
  /^\/product-details\/[^/]+$/,
  /^\/vendor$/,
  /^\/vendor\/[^/]+$/,
  /^\/compare$/,
  /^\/wishlist$/,
];

const isKnown = (path: string) => KNOWN_ROUTES.some((re) => re.test(path));

export async function POST(req: Request): Promise<NextResponse> {
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET;
  if (!secret) {
    // Refusing is the safe failure: an unauthenticated revalidate endpoint
    // lets anyone force the whole catalogue to re-render on demand.
    return NextResponse.json({ error: "revalidation is not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { paths, tags } = (body ?? {}) as { paths?: unknown; tags?: unknown };
  const pathList = Array.isArray(paths) ? paths.filter((p): p is string => typeof p === "string") : [];

  /* Tags are refused rather than ignored.
     Nothing in this storefront tags its fetches, and Next 16's `revalidateTag`
     now takes a cache-life profile whose invalidation semantics differ from
     the old call. Accepting a tag and quietly doing nothing with it is the
     failure mode that produced this whole bug; saying so is better. */
  if (Array.isArray(tags) && tags.length > 0) {
    return NextResponse.json(
      { error: "tag revalidation is not supported — this storefront caches by path" },
      { status: 400 },
    );
  }

  if (pathList.length === 0) {
    return NextResponse.json({ error: "nothing to revalidate" }, { status: 400 });
  }

  const revalidated: string[] = [];
  const unknown: string[] = [];

  for (const path of pathList) {
    // A path must be a path. Anything else is a caller bug, and passing it on
    // would have Next revalidate something nobody meant.
    if (!path.startsWith("/") || path.includes("://")) {
      unknown.push(path);
      continue;
    }
    if (!isKnown(path)) {
      unknown.push(path);
      continue;
    }
    revalidatePath(path);
    revalidated.push(path);
  }

  // 200 with a body rather than 204: the caller needs to be able to see that a
  // path it asked for went nowhere.
  return NextResponse.json({ revalidated, unknown });
}
