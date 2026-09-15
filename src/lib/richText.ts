import sanitizeHtml from "sanitize-html";

import { looksLikeHtml } from "./plainText";

/**
 * Rendering catalogue copy that the admin writes as HTML.
 *
 * Product and vendor descriptions come out of the admin's TipTap editor, so
 * the stored value is markup. Older rows, and rows that arrived through the
 * spreadsheet importer, are plain text. Both shapes reach the same components.
 *
 * The markup is staff-authored rather than shopper-authored, which lowers the
 * odds of an attack but does not remove them: a compromised admin session
 * would otherwise get to run script in every visitor's browser, on the product
 * page, for as long as the row stands. So it is sanitised on the way out.
 *
 * `sanitize-html` rather than a DOMPurify build, because this runs during
 * server rendering. DOMPurify needs a DOM, which on the server means jsdom —
 * and jsdom cannot even load in Vercel's runtime: it reaches
 * `html-encoding-sniffer`, which `require()`s a package that is pure ESM, and
 * the whole page fails with ERR_REQUIRE_ESM. `sanitize-html` parses with
 * `htmlparser2` and needs no DOM at all.
 */

/**
 * Tags the editor can actually produce, and nothing else.
 *
 * An allow-list rather than a block-list: the editor's extension set is known,
 * so anything outside it is either a paste artefact or an attack, and neither
 * belongs on the page. Everything not listed is dropped, and `script`/`style`
 * lose their contents too rather than leaving code on the page as text.
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

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title"],
    "*": ["class", "colspan", "rowspan"],
  },
  // No `javascript:` or `data:` destinations: a link is a place, not a program.
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  // Anything a description links to is a destination nobody on this side chose.
  // Opening it in a new tab without `rel` would hand the opened page a live
  // `window.opener` back to the storefront.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      target: "_blank",
      rel: "noopener noreferrer nofollow",
    }),
  },
  // Drop the contents, not just the tags — otherwise the code inside lands on
  // the page as visible text.
  nonTextTags: ["script", "style", "textarea", "option", "noscript"],
};

export { looksLikeHtml };

/**
 * Sanitised markup, ready for `dangerouslySetInnerHTML`.
 *
 * Plain-text descriptions are wrapped in a paragraph so both shapes render with
 * the same spacing — otherwise the seeded products would sit flush against
 * whatever follows while the edited ones did not. Text is escaped first: a
 * description that merely mentions `a < b` must not become a tag.
 */
export function sanitizeRichText(value: string | null | undefined): string {
  if (!value) return "";

  if (!looksLikeHtml(value)) {
    return `<p>${escapeHtml(value).replace(/\r?\n/g, "<br />")}</p>`;
  }

  return sanitizeHtml(value, OPTIONS);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
