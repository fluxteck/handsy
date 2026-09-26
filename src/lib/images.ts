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
  // Supplier sites the catalogue links product photography from, rather than
  // re-hosting it. Mirrors `images.remotePatterns` in next.config.ts — a host
  // missing from either list renders as placeholder art.
  "allindiadecor.com",
  "handicraftstown.com",
  "handscarpets.com",
  "ii1.pepperfry.com",
  "ikiru.in",
  "irekahomes.com",
  "unit01labs.com",
  "www.homesake.in",
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
/**
 * Hosts already reported, so one unlisted supplier does not print a line per
 * image per render. Module-scoped, which is per server instance — enough to
 * make the problem visible in the logs without drowning them.
 */
const reported = new Set<string>();

function reportRejection(url: string): void {
  // Server only: in the browser this would be noise the operator never sees,
  // and the same product renders on the server first anyway.
  if (typeof window !== "undefined") return;
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    host = url.slice(0, 40);
  }
  if (reported.has(host)) return;
  reported.add(host);
  console.warn(
    `[handsy:images] "${host}" is not an allowed image host — products using it ` +
      `render placeholder art instead. Add it to images.remotePatterns in ` +
      `next.config.ts AND to ALLOWED_HOSTS in src/lib/images.ts.`,
  );
}

export function safeImageUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  if (isAllowed(url)) return url;
  /* Say so. This failing silently is why twenty-seven products showed
     placeholder art for weeks with nobody able to tell why: the page rendered
     perfectly, just with the wrong picture. */
  reportRejection(url);
  return fallback;
}
