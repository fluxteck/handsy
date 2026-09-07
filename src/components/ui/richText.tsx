import { cn } from "@/lib/utils";
import { sanitizeRichText } from "@/lib/richText";

/**
 * Renders admin-authored description markup.
 *
 * The one place in the storefront that injects HTML, so the sanitising sits
 * here rather than at each call site — a component nobody has to remember to
 * pair with a cleaner. Renders nothing at all when the description is empty,
 * so callers do not have to guard it themselves.
 *
 * `.rich-text` in globals.css gives the injected tags their spacing; Tailwind
 * cannot reach markup it never sees in the source.
 */
const RichText = ({ html, className }: { html: string | null | undefined; className?: string }) => {
  const clean = sanitizeRichText(html);
  if (!clean) return null;

  return (
    <div
      className={cn("rich-text text-gray-1-foreground leading-relaxed", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default RichText;
