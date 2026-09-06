import DOMPurify from "isomorphic-dompurify";

/**
 * Rendering catalogue copy that the admin writes as HTML.
 *
 * Product and vendor descriptions come out of the admin's TipTap editor, so the
 * stored value is markup — `<p>Pleated fabric shade…</p>`. Older rows, and rows
 * that arrived through the spreadsheet importer, are plain text. Both shapes
 * reach the same components, so everything here has to survive either.
 *
 * The markup is staff-authored rather than shopper-authored, which lowers the
 * odds of an attack but does not remove them: a compromised admin session would
 * otherwise get to run script in every visitor's browser, on the product page,
 * for as long as the row stands. So it is sanitised on the way out, once, and
 * the components only ever receive markup that is already safe to inject.
 */

/**
 * Tags the editor can actually produce, and nothing else.
 *
 * An allow-list rather than a block-list: the editor's extension set is known
 * (headings, lists, links, images, code blocks, the inline marks), so anything
 * outside it is either a paste artefact or an attack, and neither belongs on
 * the page. `<img>` is included because the editor offers image insertion.
 */
const ALLOWED_TAGS = [
  "p", "br", "hr",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "strong", "b", "em", "i", "u", "s", "del", "mark", "sub", "sup",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class", "colspan", "rowspan"];

/**
 * Anything a description links to is a destination nobody on this side chose.
 *
 * Opening it in a new tab without `rel` would hand the opened page a live
 * `window.opener` back to the storefront, so the two are set together, after
 * sanitising, on every surviving anchor. Registered once at module scope —
 * DOMPurify keeps hooks globally, and adding it per call would stack copies.
 */
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.hasAttribute("href")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer nofollow");
  }
});

/** True when the value carries markup, as opposed to being plain prose. */
export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

/**
 * Sanitised markup, ready for `dangerouslySetInnerHTML`.
 *
 * Plain-text descriptions are wrapped in a paragraph so both shapes render
 * with the same spacing — otherwise the seeded products would sit flush
 * against whatever follows while the edited ones did not. Text is escaped
 * first: a description that merely mentions `a < b` must not become a tag.
 */
export function sanitizeRichText(value: string | null | undefined): string {
  if (!value) return "";

  if (!looksLikeHtml(value)) {
    return `<p>${escapeHtml(value).replace(/\r?\n/g, "<br />")}</p>`;
  }

  return DOMPurify.sanitize(value, { ALLOWED_TAGS, ALLOWED_ATTR });
}

/**
 * The same copy flattened to plain text.
 *
 * For the places that need a string rather than a block of markup: the meta
 * description, and the clamped teaser above the buy button — a nested `<p>`
 * inside the teaser's own paragraph would be invalid markup, and the browser
 * would silently restructure it.
 */
export function richTextToPlain(value: string | null | undefined): string {
  if (!value) return "";
  if (!looksLikeHtml(value)) return value.trim();

  // Block boundaries carry a word break that the markup was doing visually.
  // Stripping the tags first would run the last word of a paragraph into the
  // first word of the next list item — "…fabric shadeE27 socket" — which is
  // what a shopper would then read in the teaser and in search results.
  const spaced = value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(?:p|div|li|ul|ol|h[1-6]|blockquote|pre|tr|td|th|table|section|article)\s*>/gi, " ");

  const stripped = DOMPurify.sanitize(spaced, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return decodeEntities(stripped).replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Turn the entities stripping leaves behind back into characters.
 *
 * Done by hand rather than through the DOM because this runs on the server
 * during metadata generation, where there is no document to borrow. Only the
 * five that matter for prose — anything rarer survives as an entity, which
 * reads acceptably in a meta tag.
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
