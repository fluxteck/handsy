"use client";

import { z } from "zod";
import { getSupabaseBrowserClient } from "../supabase/browser-client";

/**
 * Email one-time-code auth — the store's only sign-in method.
 *
 * There is no password anywhere in this flow, and no separate sign-up. The
 * same two calls cover both cases: `shouldCreateUser: true` means an unknown
 * email is registered on first verification, while a known one simply signs
 * in. That also lets a guest who only ever checked out reach their order
 * history later, since checkout provisions a passwordless account under the
 * same address.
 *
 * Why this doesn't go through the commerce SDK: the SDK has no notion of
 * identity. `AuthProvider` is `getToken()` / `getCustomerId()` — it *consumes*
 * a token and never issues one, and `@commercekitsdk/auth` only wraps
 * password sign-in. Supabase mints the JWT; every commerce call still travels
 * the SDK, authenticated by that token via `getAuthToken` in
 * `lib/sdk/client.ts`. Keeping the identity calls in this one module preserves
 * the single-seam rule.
 *
 * Possession of the inbox is the proof of ownership here — which is exactly
 * why the same helpers are reused to validate a guest's email at checkout.
 */

const EmailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .email("Enter a valid email address.");

const CodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter all 6 digits.");

export type OtpResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

/** Normalised email, or null when it doesn't parse. */
export function parseEmail(email: string): string | null {
  const parsed = EmailSchema.safeParse(email);
  return parsed.success ? parsed.data : null;
}

/**
 * Send a 6-digit code to `email`.
 *
 * @param createIfNew When true (the default) an unrecognised email is
 *   registered on verification — the sign-in/sign-up unified path. Pass false
 *   to require a pre-existing account.
 */
export async function requestEmailOtp(
  email: string,
  options: { createIfNew?: boolean } = {},
): Promise<OtpResult> {
  const parsed = EmailSchema.safeParse(email);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]!.message };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: { shouldCreateUser: options.createIfNew ?? true },
    });
    if (error) return { status: "error", message: error.message };
    return {
      status: "success",
      message: `We sent a 6-digit code to ${parsed.data}.`,
    };
  } catch (err) {
    console.error("[handsy:auth] requestEmailOtp failed", err);
    return {
      status: "error",
      message: "Couldn't send the code right now. Please try again.",
    };
  }
}

/**
 * Verify the code and establish the session. On success the Supabase cookie is
 * set, so both the SDK bearer and any server-side session read pick it up
 * immediately.
 */
export async function verifyEmailOtp(email: string, code: string): Promise<OtpResult> {
  const parsedEmail = EmailSchema.safeParse(email);
  if (!parsedEmail.success) {
    return { status: "error", message: parsedEmail.error.issues[0]!.message };
  }
  const parsedCode = CodeSchema.safeParse(code);
  if (!parsedCode.success) {
    return { status: "error", message: parsedCode.error.issues[0]!.message };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email: parsedEmail.data,
      token: parsedCode.data,
      type: "email",
    });
    if (error) return { status: "error", message: error.message };
    if (!data.session) {
      return { status: "error", message: "That code didn't work. Please try again." };
    }
    return { status: "success", message: "Signed in successfully." };
  } catch (err) {
    console.error("[handsy:auth] verifyEmailOtp failed", err);
    return {
      status: "error",
      message: "Couldn't verify the code right now. Please try again.",
    };
  }
}

/** Attach a display name to the signed-in user (used by the sign-up tab). */
export async function setDisplayName(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) return;
  try {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.updateUser({ data: { name: trimmed } });
  } catch (err) {
    // Cosmetic only — never block a completed sign-in over a display name.
    console.error("[handsy:auth] setDisplayName failed", err);
  }
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  await supabase.auth.signOut();
}
