"use client";

import { isCommerceError } from "@commercekitsdk/core";
import { getEnv } from "../config";
import { getStorefrontClient } from "./client";

/**
 * Posting a review.
 *
 * Auth-gated by the server, twice over: the ownership wrapper rejects an
 * anonymous `reviews.create`, and the store layer checks `ctx.customerId`
 * again before touching the database. So this must run in the browser, where
 * the customer's Supabase JWT is attached — the same reason account reads live
 * client-side.
 *
 * What the server decides, not us:
 *  - **author name** is read from the `customers` row, never taken from the
 *    request, so a reviewer can't post under someone else's name;
 *  - **verified purchase** is derived from a delivered order for that product;
 *  - **status** starts at `pending`, and `reviews.list` returns only
 *    `published` rows — so a new review will not appear on the page until it
 *    has been moderated. The modal's success step says exactly that.
 */

export type SubmitReviewResult =
  | { status: "success" }
  | { status: "unauthenticated" }
  | { status: "error"; message: string };

export async function submitReview(input: {
  productId: string;
  rating: number;
  body: string;
  title?: string;
}): Promise<SubmitReviewResult> {
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return { status: "error", message: "Please choose a rating from 1 to 5 stars." };
  }
  if (input.body.trim().length < 10) {
    return { status: "error", message: "Please write at least 10 characters." };
  }

  try {
    const client = getStorefrontClient();
    await client.adapter.reviews!.create(
      {
        productId: input.productId,
        rating: input.rating,
        body: input.body.trim(),
        ...(input.title ? { title: input.title } : {}),
      },
      { currency: getEnv().NEXT_PUBLIC_CURRENCY, locale: "en-IN" },
    );
    return { status: "success" };
  } catch (err) {
    // Distinguish "you need to sign in" from a genuine failure — they need
    // completely different things from the customer.
    if (isCommerceError(err) && (err.code === "unauthorized" || err.code === "forbidden")) {
      return { status: "unauthenticated" };
    }
    console.error("[handsy:reviews] submit failed", err);
    return {
      status: "error",
      message:
        isCommerceError(err) && err.code === "validation"
          ? err.message
          : "We couldn't post your review just now. Please try again.",
    };
  }
}
