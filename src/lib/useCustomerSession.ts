'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from './supabase/browser-client';

const STORAGE_KEY = 'handsy_customer_session';

export type CustomerSession = {
  name?: string;
  email: string;
};

/**
 * Who the visitor is, on the client.
 *
 * The real Supabase session is authoritative: once someone verifies an email
 * OTP they are signed in, and that wins over anything in local storage.
 *
 * The local-storage record is kept as a *fallback only*, for the guest review
 * flow — `writeReviewModal` collects a name and email from someone who never
 * signed in and wants to remember them between visits. It is not an
 * authentication mechanism and grants no access; anything that gates real
 * customer data must use the Supabase session (server-side, via
 * `getServerSession()`), never this.
 */
export function useCustomerSession() {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    // Guest fallback first so the UI has something immediately.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // ignore malformed/inaccessible storage
    }

    const applyUser = (user: { email?: string; user_metadata?: Record<string, unknown> } | null) => {
      if (!active) return;
      if (!user?.email) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
      setSession({
        email: user.email,
        name: (user.user_metadata?.name as string | undefined) ?? undefined,
      });
    };

    let unsubscribe = () => {};
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth
        .getUser()
        .then(({ data }) => applyUser(data.user))
        .catch(() => {})
        .finally(() => active && setHydrated(true));

      const { data } = supabase.auth.onAuthStateChange((_event, sb) => {
        applyUser(sb?.user ?? null);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch {
      // Supabase unconfigured — guest fallback only.
      setHydrated(true);
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  /**
   * Remember a guest's details locally. Ignored once genuinely signed in —
   * the verified session must never be overwritten by unverified input.
   */
  const signIn = useCallback(
    (customer: CustomerSession) => {
      if (isAuthenticated) return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
      } catch {
        // ignore write failures (e.g. private browsing)
      }
      setSession(customer);
    },
    [isAuthenticated],
  );

  return { session, isLoggedIn: !!session, isAuthenticated, hydrated, signIn };
}
