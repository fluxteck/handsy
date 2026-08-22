/**
 * Razorpay checkout.js loader — the second documented SDK exception.
 *
 * Razorpay's payment UI ships as a script from their CDN and runs inside an
 * iframe they control; card details never touch our page, which is the point.
 * That can't be routed through our typed SDK, so the loader lives here under
 * `src/lib/sdk/` alongside the other exception, and nothing else in the app is
 * allowed to pull in third-party scripts.
 *
 * Order creation and signature-verified capture both happen server-side — this
 * only brings the modal into existence.
 *
 * Idempotent: repeat calls share one in-flight promise rather than injecting a
 * second script tag.
 */
const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const SCRIPT_ID = "razorpay-checkout-js";

let cached: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only load in the browser"));
  }
  if ("Razorpay" in window) return Promise.resolve();
  if (cached) return cached;

  cached = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Razorpay script failed to load")),
      );
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      cached = null; // allow a retry
      reject(new Error("Razorpay script failed to load"));
    };
    document.head.appendChild(script);
  });
  return cached;
}

/** The slice of Razorpay's global we actually use. They ship no types. */
export interface RazorpayOptions {
  key: string;
  /** Minor units — must match the amount the server created the order with. */
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayCtor {
  new (options: RazorpayOptions): { open(): void; close(): void };
}

declare global {
  interface Window {
    Razorpay?: RazorpayCtor;
  }
}
