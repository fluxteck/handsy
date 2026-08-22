"use client";

import { useRecordProductView } from "@commercekitsdk/react";

/**
 * Records that this product was viewed, so it can appear in the shopper's
 * "Recently Viewed" rail.
 *
 * A component rather than a call inside the page because the product detail
 * page is a server component and browser storage is the only place this list
 * lives. It renders nothing and issues no requests — the SDK hook writes one
 * entry to `localStorage` on mount.
 */
export default function RecordProductView({ productId }: { productId: string | number }) {
  useRecordProductView(String(productId));
  return null;
}
