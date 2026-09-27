"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getEnv } from "../config";
import { useCart } from "../cart/cart-context";
import { adapterCtx, useCustomerId } from "../account/use-account";
import { getStorefrontClient } from "../sdk/client";
import type { AddressType } from "@/types/accountType";
import { readCartCookie } from "../cart/cart-cookie";
import {
  confirmCheckoutPayment,
  createCheckoutSession,
  type CheckoutAddress,
} from "../sdk/checkout-api";
import { loadRazorpayScript } from "../sdk/razorpay-script";

/**
 * Checkout state, shared across the page.
 *
 * The address fields live in `<CheckoutForm/>` (left column) while the payment
 * method, terms checkbox and Place Order button live in `<CheckoutPayment/>`
 * (right column) — two sibling components with no common parent but the page
 * itself. Rather than restructure that layout, both read and write this
 * context, so the markup of each is untouched.
 *
 * Order of operations, and why:
 *   1. Create a session server-side. The amount is taken from the cart row —
 *      never sent by the browser — so nothing here can alter a price.
 *   2. COD short-circuits: the intent comes back `pending` and we confirm
 *      immediately, producing an unpaid order.
 *   3. Otherwise open Razorpay's modal. Card data goes straight to them; it
 *      never touches this origin.
 *   4. Confirm by intent id. The SERVER asks Razorpay whether the payment
 *      really succeeded — a forged success callback from the browser cannot
 *      create a paid order.
 */

export interface CheckoutFields {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  street: string;
  town: string;
  /** State / region. Kept separate from `town`: it used to be sent as the
   *  region, so every order recorded its city as its state. */
  state: string;
  zip: string;
  notes: string;
}

const EMPTY_FIELDS: CheckoutFields = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  country: "",
  street: "",
  town: "",
  state: "",
  zip: "",
  notes: "",
};

/**
 * Editing any of these means the form no longer matches the saved address it
 * was filled from, so the selection is dropped — otherwise the picker would
 * keep one highlighted while the fields said something else, and we would skip
 * saving an address the shopper had in fact changed. `email` and `notes` are
 * absent deliberately: neither is part of the address.
 */
const ADDRESS_FIELDS: ReadonlySet<keyof CheckoutFields> = new Set([
  "first_name",
  "last_name",
  "phone",
  "street",
  "town",
  "state",
  "zip",
  "country",
]);

/**
 * The UI's two radio values, mapped to what the server understands. Only
 * `cash-on-delivery` is genuinely offline; "online" routes through Razorpay,
 * which is the single online provider configured — its own checkout modal is
 * what actually offers UPI, cards, EMI, netbanking and wallets.
 */
function toServerMethod(uiMethod: string): "online" | "cod" {
  return uiMethod === "cash-on-delivery" ? "cod" : "online";
}

interface CheckoutContextValue {
  fields: CheckoutFields;
  setField: (name: keyof CheckoutFields, value: string) => void;
  /** Fill the delivery fields from one of the customer's saved addresses. */
  applyAddress: (address: AddressType) => void;
  /** Which saved address is in use, or null while the fields are hand-typed. */
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  /** Empty the delivery fields so a new address can be typed from scratch. */
  clearAddress: () => void;
  /** Persist the typed address to the account once the order succeeds. */
  saveAddress: boolean;
  setSaveAddress: (save: boolean) => void;
  /** Null until the shopper is signed in — gates both of the above. */
  customerId: string | null;
  /** True once the shopper's email is verified (or they're signed in). */
  emailVerified: boolean;
  setEmailVerified: (verified: boolean) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  isPlacing: boolean;
  placeOrder: () => Promise<void>;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { products, reset: resetCart } = useCart();

  const { customerId } = useCustomerId();

  const [fields, setFields] = useState<CheckoutFields>(EMPTY_FIELDS);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  const setField = useCallback((name: keyof CheckoutFields, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    if (ADDRESS_FIELDS.has(name)) setSelectedAddressId(null);
  }, []);

  const applyAddress = useCallback((address: AddressType) => {
    const [firstName, ...rest] = (address.fullName || "").trim().split(" ");
    setFields((prev) => ({
      ...prev,
      first_name: firstName ?? "",
      last_name: rest.join(" "),
      phone: address.phone || prev.phone,
      street: address.line2 ? `${address.line1}, ${address.line2}` : address.line1,
      town: address.city,
      state: address.state,
      zip: address.postalCode,
      country: address.country,
    }));
    setSelectedAddressId(address.id);
    // An address already on file does not need saving again.
    setSaveAddress(false);
  }, []);

  const clearAddress = useCallback(() => {
    setFields((prev) => ({
      ...prev,
      first_name: "",
      last_name: "",
      street: "",
      town: "",
      state: "",
      zip: "",
      country: "",
    }));
    setSelectedAddressId(null);
    // `phone` and `email` are contact details, not delivery details — clearing
    // them here would make the shopper retype what the picker never filled.
  }, []);

  const toAddress = useCallback(
    (f: CheckoutFields): CheckoutAddress => ({
      firstName: f.first_name,
      lastName: f.last_name,
      line1: f.street,
      city: f.town,
      region: f.state,
      postalCode: f.zip,
      country: f.country,
      ...(f.phone ? { phone: f.phone } : {}),
    }),
    [],
  );

  /** Everything that must be true before we're allowed to take money. */
  const validate = useCallback((): string | null => {
    if (products.length === 0) return "Your cart is empty.";
    if (!fields.first_name.trim() || !fields.last_name.trim()) return "Enter your name.";
    if (!fields.email.trim()) return "Enter your email address.";
    if (!emailVerified) return "Verify your email address before placing the order.";
    if (!fields.street.trim() || !fields.town.trim() || !fields.state.trim() || !fields.zip.trim())
      return "Enter your full delivery address.";
    if (!fields.country.trim()) return "Select your country.";
    if (!termsAccepted) return "Please accept the terms and conditions.";
    return null;
  }, [products.length, fields, emailVerified, termsAccepted]);

  /**
   * Save the typed address to the account, if asked and possible.
   *
   * Runs only after the order is real, so a save failure can never cost the
   * shopper the purchase — it is reported separately and swallowed. Skipped
   * when the address came from the account in the first place, and when there
   * is no signed-in customer to attach it to (a guest who never verified their
   * email has no `customers` row, and the insert would fail the FK).
   */
  const persistAddress = useCallback(async () => {
    if (!saveAddress || !customerId || selectedAddressId) return;
    try {
      await getStorefrontClient().adapter.users.addresses.add(
        customerId,
        {
          firstName: fields.first_name.trim(),
          lastName: fields.last_name.trim(),
          line1: fields.street.trim(),
          city: fields.town.trim(),
          region: fields.state.trim(),
          postalCode: fields.zip.trim(),
          country: fields.country.trim(),
          ...(fields.phone.trim() ? { phone: fields.phone.trim() } : {}),
          // The server promotes a customer's first address to default on its
          // own; checkout has no business overriding a default they chose.
          isDefault: false,
        },
        adapterCtx(customerId),
      );
    } catch (err) {
      console.error("[handsy:checkout] saving the address failed", err);
      toast.error("Your order is placed, but we couldn't save that address.");
    }
  }, [saveAddress, customerId, selectedAddressId, fields]);

  const finish = useCallback(
    async (orderId: string | undefined) => {
      await persistAddress();
      resetCart();
      toast.success("Order placed. Thank you!");
      // No dedicated confirmation route exists yet, so land on the account's
      // order list — where the order the customer just placed is waiting.
      router.push(orderId ? `/account/orders` : "/account/orders");
      router.refresh();
    },
    [persistAddress, resetCart, router],
  );

  const placeOrder = useCallback(async () => {
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }
    const cartId = readCartCookie();
    if (!cartId) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsPlacing(true);
    try {
      const address = toAddress(fields);
      const method = toServerMethod(paymentMethod);
      const { intent } = await createCheckoutSession(cartId, fields.email.trim(), {
        shippingAddress: address,
        billingAddress: address,
        method,
      });

      // ── Cash on delivery ────────────────────────────────────────────
      if (method === "cod" || intent.providerData?.cod) {
        const result = await confirmCheckoutPayment(intent.id);
        if (result.status !== "succeeded" && result.status !== "pending") {
          toast.error("We couldn't place that order. Please try again.");
          return;
        }
        await finish(result.order?.id);
        return;
      }

      // ── Online (Razorpay) ───────────────────────────────────────────
      const keyId =
        intent.providerData?.keyId ?? getEnv().NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
      const orderId = intent.providerData?.orderId;
      if (!orderId || !keyId) {
        // The server minted an intent we can't present — most often the
        // provider isn't configured. Never pretend the order succeeded.
        console.error("[handsy:checkout] intent missing provider data", intent);
        toast.error("Online payment isn't available right now.");
        return;
      }

      await loadRazorpayScript();
      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        toast.error("Couldn't open the payment window. Please try again.");
        return;
      }

      await new Promise<void>((resolve) => {
        const rzp = new Razorpay({
          key: keyId,
          amount: intent.amount.amount,
          currency: intent.amount.currency,
          name: "Handsy Market",
          order_id: orderId,
          prefill: {
            name: `${fields.first_name} ${fields.last_name}`.trim(),
            email: fields.email.trim(),
            ...(fields.phone ? { contact: fields.phone } : {}),
          },
          // The browser's "success" is only a hint — the server re-checks with
          // Razorpay before any order exists.
          handler: () => {
            void (async () => {
              try {
                const result = await confirmCheckoutPayment(intent.id);
                if (result.status === "succeeded") await finish(result.order?.id);
                else toast.error("Payment didn't complete. You have not been charged twice.");
              } catch (err) {
                console.error("[handsy:checkout] confirm failed", err);
                toast.error(
                  "We couldn't confirm the payment. If you were charged, contact support with your email.",
                );
              } finally {
                resolve();
              }
            })();
          },
          modal: {
            ondismiss: () => {
              toast("Payment cancelled.");
              resolve();
            },
          },
        });
        rzp.open();
      });
    } catch (err) {
      console.error("[handsy:checkout] place order failed", err);
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't place that order. Please try again.",
      );
    } finally {
      setIsPlacing(false);
    }
  }, [validate, fields, paymentMethod, toAddress, finish]);

  const value = useMemo<CheckoutContextValue>(
    () => ({
      fields,
      setField,
      applyAddress,
      selectedAddressId,
      setSelectedAddressId,
      clearAddress,
      saveAddress,
      setSaveAddress,
      customerId,
      emailVerified,
      setEmailVerified,
      paymentMethod,
      setPaymentMethod,
      termsAccepted,
      setTermsAccepted,
      isPlacing,
      placeOrder,
    }),
    [
      fields,
      setField,
      applyAddress,
      selectedAddressId,
      clearAddress,
      saveAddress,
      customerId,
      emailVerified,
      paymentMethod,
      termsAccepted,
      isPlacing,
      placeOrder,
    ],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside <CheckoutProvider>");
  return ctx;
}
