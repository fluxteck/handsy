import type { Review } from "@commercekitsdk/core";
import type { ReviewType } from "@/types/reviewType";

/**
 * SDK `Review` → the template's `ReviewType`, so `reviewsList` / `reviewCard`
 * keep their markup.
 *
 * The server publishes only moderated reviews, so anything arriving here is
 * already safe to render.
 */

/** `"2026-06-07T17:30:25Z"` → `"7 June 2026"`, matching the mock data's register. */
function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function toReviewType(review: Review): ReviewType {
  return {
    id: String(review.id),
    productId: String(review.productId),
    name: review.authorName || "Verified buyer",
    rating: review.rating,
    title: review.title ?? "",
    comment: review.body,
    date: formatDate(review.createdAt),
    verifiedPurchase: review.verifiedPurchase,
  };
}

export function toReviewTypes(reviews: Review[]): ReviewType[] {
  return reviews.map(toReviewType);
}
