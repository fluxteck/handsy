"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { requestEmailOtp, verifyEmailOtp } from "@/lib/auth/otp";
import { useCustomerSession } from "@/lib/useCustomerSession";
import { useCheckout } from "@/lib/checkout/checkout-context";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";

const INPUT_CLASS =
  "border-[1.5px] border-[#999796] text-base text-gray-1-foreground font-medium py-3 mt-2.5";

/**
 * Checkout email field with ownership verification.
 *
 * An order is only as reachable as the address it was placed with — a typo'd
 * address means no confirmation, no shipping updates, and a buyer who can
 * never find the order again. So a guest proves they own it: we email a
 * 6-digit code, the same one-time-code flow the sign-in page uses.
 *
 * Verifying also signs them in, which is the point — the order attaches to a
 * real customer id instead of floating as an anonymous guest order, and it's
 * waiting for them next time they enter that email.
 *
 * Already signed in? The address is proven by definition: pre-filled, locked,
 * no code sent.
 *
 * All messaging goes through toasts; the field's own markup is byte-identical
 * to the plain input it replaced. Verification state is mirrored into the
 * checkout context, which refuses to create a payment session until the
 * address is proven — the authoritative gate, since there is no longer a
 * `<form>` here to hang native validation off.
 */
const GuestEmailField = () => {
  const { session, isAuthenticated, hydrated } = useCustomerSession();
  // The address lives in the checkout context so Place Order (in the sibling
  // column) can read it, and so verification state gates the order.
  const { fields, setField, setEmailVerified } = useCheckout();
  const email = fields.email;
  const setEmail = (value: string) => setField("email", value);

  const [step, setStep] = useState<"entry" | "code" | "verified">("entry");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isPending, startTransition] = useTransition();
  // Tracks whether the customer has typed, so a late-arriving session never
  // overwrites an address they're in the middle of entering.
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && session?.email && !dirtyRef.current) {
      setEmail(session.email);
      setStep("verified");
      // Signed in means the address is already proven.
      setEmailVerified(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, session?.email]);


  const sendCode = () => {
    startTransition(async () => {
      const res = await requestEmailOtp(email, { createIfNew: true });
      if (res.status === "error") {
        toast.error(res.message);
        return;
      }
      setCode(Array(6).fill(""));
      setStep("code");
      toast.success(res.message);
    });
  };

  const confirmCode = () => {
    const joined = code.join("");
    if (joined.length < 6) {
      toast.error("Enter all 6 digits.");
      return;
    }
    startTransition(async () => {
      const res = await verifyEmailOtp(email, joined);
      if (res.status === "error") {
        toast.error(res.message);
        return;
      }
      setStep("verified");
      setEmailVerified(true);
      toast.success("Email verified.");
    });
  };

  return (
    <label htmlFor="email" className="text-gray-1-foreground w-full text-base">
      Email address<span className="text-red-400">*</span>
      <Input
        className={INPUT_CLASS}
        type="email"
        name="email"
        id="email"
        required
        value={email}
        onChange={(e) => {
          dirtyRef.current = true;
          setEmail(e.target.value);
          // Editing the address invalidates any proof already given for it.
          // Editing the address invalidates any proof already given for it.
          if (step !== "entry") {
            setStep("entry");
            setEmailVerified(false);
          }
        }}
        // `readOnly`, never `disabled` — a disabled input is omitted from the
        // submitted FormData, which would drop the email entirely.
        readOnly={step === "verified" || isPending}
      />

      {step === "entry" && hydrated && (
        <Button
          type="button"
          size="sm"
          onClick={sendCode}
          disabled={isPending || !email}
          className="mt-2.5"
        >
          {isPending ? "Sending…" : "Verify email"}
        </Button>
      )}

      {step === "code" && (
        <div className="mt-2.5">
          <OtpInput value={code} onChange={setCode} disabled={isPending} />
          <div className="mt-2.5 flex gap-2.5">
            <Button type="button" size="sm" onClick={confirmCode} disabled={isPending}>
              {isPending ? "Verifying…" : "Confirm"}
            </Button>
            <Button type="button" size="sm" onClick={sendCode} disabled={isPending}>
              Resend
            </Button>
          </div>
        </div>
      )}
    </label>
  );
};

export default GuestEmailField;
