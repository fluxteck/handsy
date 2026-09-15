/**
 * Catalogue copy flattened to text.
 *
 * Separate from the sanitiser on purpose. Product and vendor descriptions are
 * needed as plain strings in places that run in the browser — the clamped
 * teaser above the buy button lives in a client component — and pulling an
 * HTML sanitiser into the client bundle to strip tags would ship a parser to
 * every visitor for no benefit.
 *
 * It is safe to do this with expressions rather than a parser because of where
 * the result goes: React renders it as a text child and escapes it. Nothing
 * here is ever handed to `dangerouslySetInnerHTML` — that path goes through
 * `sanitizeRichText`, which does use a real parser. Keep it that way.
 */

/** True when the value carries markup, as opposed to being plain prose. */
export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

/**
 * The description as a single line of readable text.
 *
 * For the meta description and the clamped teaser — places that need a string,
 * not a block of markup. A nested `<p>` inside the teaser's own paragraph would
 * be restructured by the browser.
 */
export function richTextToPlain(value: string | null | undefined): string {
  if (!value) return "";
  if (!looksLikeHtml(value)) return value.trim();

  const spaced = value
    // Script and style carry code, not prose. Dropping only their tags would
    // leave the code itself on the page as visible text.
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    // Block boundaries carry a word break the markup was making visually.
    // Without this the last word of a paragraph runs into the first word of
    // the next list item — "…fabric shadeE27 socket".
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(?:p|div|li|ul|ol|h[1-6]|blockquote|pre|tr|td|th|table|section|article)\s*>/gi, " ")
    .replace(/<[^>]*>/g, "");

  return decodeEntities(spaced).replace(/\s+/g, " ").trim();
}

/**
 * Turn the entities stripping leaves behind back into characters.
 *
 * By hand rather than through the DOM: this runs during server rendering where
 * there is no document, and in the browser where borrowing one would be
 * wasteful. Only the handful that matter for prose — anything rarer survives as
 * an entity, which reads acceptably. `&amp;` is decoded last so `&amp;lt;`
 * becomes `&lt;` rather than `<`.
 */
function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}
