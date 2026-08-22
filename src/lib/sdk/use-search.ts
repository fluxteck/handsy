"use client";

import { useEffect, useState } from "react";
import type { ProductType } from "@/types/productType";
import { toProductTypes, type HomeProduct } from "../mappers/product";
import { getStorefrontClient } from "./client";

/**
 * Product search, run on the server.
 *
 * The popup used to filter one preloaded page of products in the browser with
 * `title.includes(...)`. That could only ever find what had already been
 * shipped to the page — a catalogue of any size would silently hide most
 * matches, and it couldn't match on description or handle stemming.
 *
 * `products.search` hits Postgres full-text: a GIN-indexed `search_vector`
 * kept current by a trigger, plus a trigram-indexed `ilike` on title so
 * partial words still match without a table scan. The query is parameterised
 * and passed through `plainto_tsquery`, so arbitrary input is safe.
 *
 * Debounced, because the input fires per keystroke and each one is a round
 * trip. Results are also cached by the SDK for 60s, so backspacing to a
 * previous query costs nothing.
 */
const DEBOUNCE_MS = 250;
/** Below this, results are too broad to be useful and every keystroke matches. */
const MIN_QUERY_LENGTH = 2;

export function useProductSearch(query: string, limit = 8) {
  const [results, setResults] = useState<ProductType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let active = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const page = await getStorefrontClient().products.search({
          query: trimmed,
          limit,
        });
        // A slower earlier request must not overwrite a newer one's results.
        if (active) setResults(toProductTypes(page.items) as HomeProduct[]);
      } catch (err) {
        console.error("[handsy:search] failed", err);
        if (active) setResults([]);
      } finally {
        if (active) setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, limit]);

  return { results, isSearching };
}
