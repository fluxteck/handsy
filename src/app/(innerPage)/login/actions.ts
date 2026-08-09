'use server';

import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your name.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
});

export async function signUpUser(prevState: any, formData: FormData) {
  const parsed = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!parsed.success) {
    const errors: any = parsed.error.flatten().fieldErrors;
    const errorMessage = Object.keys(errors).map(field => errors[field]).join(' ');
    return { message: errorMessage, status: 'error' as const };
  }

  const { name, email } = parsed.data;

  // In a real application, you would create the user record in a database.
  console.log('Registering user:', { name, email });

  // Simulate a delay for network request
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { message: 'Account created! Sign in with the code we send to your email.', status: 'success' as const, email };
}

const emailSchema = z.string().email({ message: 'Invalid email address.' });

export type SendOtpResult =
  | { status: 'error'; message: string }
  | { status: 'success'; message: string; otpToken: string };

// Mock email-OTP flow: there is no backend/session store yet, so the generated code round-trips
// through client state as `otpToken` and is compared against it in verifyOtp below. This is fine
// for a demo but is NOT secure — replace with a real server-side store (keyed by email, with
// expiry) and an actual email provider once a backend exists.
export async function sendOtp(email: string): Promise<SendOtpResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Invalid email address.' };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // In a real application, you would email this code via a provider (e.g. Resend, SES).
  console.log(`[mock] Email OTP for ${parsed.data}: ${code}`);

  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    status: 'success',
    message: `We sent a 6-digit code to ${parsed.data}. (Demo mode — check the server console for the code.)`,
    otpToken: code,
  };
}

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, { message: 'Enter all 6 digits.' }),
  otpToken: z.string().length(6),
});

export async function verifyOtp(params: { email: string; code: string; otpToken: string }): Promise<{ status: 'success' | 'error'; message: string }> {
  const parsed = verifySchema.safeParse(params);
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Enter the 6-digit code.' };
  }

  if (parsed.data.code !== parsed.data.otpToken) {
    return { status: 'error', message: 'That code is incorrect. Please try again.' };
  }

  // In a real application, you would create a session/cookie here.
  console.log('Signed in:', parsed.data.email);

  await new Promise(resolve => setTimeout(resolve, 600));

  return { status: 'success', message: 'Signed in successfully!' };
}
