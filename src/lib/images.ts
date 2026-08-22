/**
 * Image URL guard for catalog data.
 *
 * `next/image` throws at render time — taking the whole page down — when it's
 * handed a remote host that isn't listed in `next.config.ts`. Catalog imagery
 * is operator-supplied data, so a single bad row shouldn't be able to 500 the
 * homepage. Anything from an unconfigured host is swapped for local artwork
 * before it ever reaches `<Image>`.
 *
 * Keep `ALLOWED_HOSTS` in sync with `images.remotePatterns` in
 * `next.config.ts` — this list is the defensive mirror of that config.
 */
const ALLOWED_HOSTS = [
  "res.cloudinary.com",
  "i.dummyjson.com",
  // Supabase Storage, when the server uses @commercekitsdk/media-supabase.
  // Matched by suffix so any project subdomain passes.
  ".supabase.co",
];

function isAllowed(url: string): boolean {
  // Relative paths are served from /public — always fine.
  if (url.startsWith("/")) return true;

  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return false;
  }

  return ALLOWED_HOSTS.some((allowed) =>
    allowed.startsWith(".") ? host.endsWith(allowed) : host === allowed,
  );
}

/**
 * Returns `url` when it's safe to render, otherwise `fallback`. Empty and
 * malformed values fall back too, since `<Image src="">` is itself an error.
 */
export function safeImageUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  return isAllowed(url) ? url : fallback;
}
