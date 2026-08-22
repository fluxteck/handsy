"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "../config";

/**
 * Browser-side Supabase client — the customer's identity, and nothing else.
 *
 * Scope is deliberately narrow: this client is used for `auth.*` calls only
 * (request an OTP, verify it, read/refresh the session, sign out). It must
 * never query catalog, cart or order tables — that data belongs to
 * handsymarket-server and is reached exclusively through the commerce SDK.
 * The JWT this client holds is what authenticates those SDK calls, via
 * `getAuthToken` in `lib/sdk/client.ts`.
 *
 * Memoised because `createBrowserClient` sets up storage listeners and a
 * token-refresh timer; two instances would race each other on refresh.
 */
let cached: SupabaseClient | undefined;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (cached) return cached;
  const { url, anonKey } = getSupabaseEnv();
  cached = createBrowserClient(url, anonKey);
  return cached;
}
