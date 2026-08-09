'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'handsy_customer_session';

export type CustomerSession = {
  name?: string;
  email: string;
};

// Placeholder for real authentication. This project has no session/cookie layer yet — see the
// TODO in `login/actions.ts`'s verifyOtp ("In a real application, you would create a
// session/cookie here"). This hook mirrors that same mock-auth convention on the client so
// features that need to know "is the visitor signed in" (e.g. the review modal) have something
// concrete to read. `signIn` is called from the OTP sign-in success step. Replace the internals
// with a real session/cookie check once auth exists — callers only need `isLoggedIn`/`session`.
export function useCustomerSession() {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // ignore malformed/inaccessible storage
    }
    setHydrated(true);
  }, []);

  const signIn = useCallback((customer: CustomerSession) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
    } catch {
      // ignore write failures (e.g. private browsing)
    }
    setSession(customer);
  }, []);

  return { session, isLoggedIn: !!session, hydrated, signIn };
}
