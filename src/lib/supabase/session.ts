import { getSupabaseServerClient } from "./server-client";

/**
 * The customer session the rest of the app sees. Deliberately minimal —
 * Supabase's raw user object carries access tokens, refresh tokens and
 * provider metadata that no component should be handling.
 *
 * `customerId` is the Supabase auth user id, which is also `customers.id` on
 * the server (the table's primary key is a FK to `auth.users`). That's what
 * makes it the right value to pass to SDK account calls.
 */
export interface CustomerSession {
  customerId: string;
  email: string | null;
  name: string | null;
}

/**
 * Resolve the current session on the server (RSCs, Route Handlers, Server
 * Actions). Returns null for guests — callers decide whether that means an
 * empty state or a redirect.
 *
 * `getUser()` rather than `getSession()`: it revalidates the token with
 * Supabase instead of trusting the cookie's claims, which matters anywhere the
 * answer gates access to someone's data.
 */
export async function getServerSession(): Promise<CustomerSession | null> {
  let supabase;
  try {
    supabase = await getSupabaseServerClient();
  } catch {
    // Supabase unconfigured — everyone is a guest.
    return null;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const meta = data.user.user_metadata ?? {};
  return {
    customerId: data.user.id,
    email: data.user.email ?? null,
    name:
      (meta.name as string | undefined) ??
      (meta.full_name as string | undefined) ??
      data.user.email?.split("@")[0] ??
      null,
  };
}
