"use client";

import { useEffect, useRef } from "react";
import { MapPinned } from "lucide-react";
import { useMyAddresses } from "@/lib/account/use-account";
import { useCheckout } from "@/lib/checkout/checkout-context";
import type { AddressType } from "@/types/accountType";

/**
 * The signed-in shopper's saved addresses, offered above the delivery form.
 *
 * Renders nothing at all for a guest, or for a customer with no saved address:
 * `useMyAddresses` only fetches once a Supabase session resolves, and an empty
 * list is indistinguishable from "not signed in" as far as this strip is
 * concerned — in both cases there is nothing to pick from, and an empty box
 * above the form would just be noise.
 *
 * Picking one fills the form through the checkout context rather than holding
 * its own copy, so the Place Order button in the sibling column reads exactly
 * what is on screen.
 */

const oneLine = (a: AddressType): string =>
  [a.line1, a.line2, a.city, a.state, a.postalCode, a.country]
    .filter((part) => part && String(part).trim())
    .join(", ");

const SavedAddresses = () => {
  const { data: addresses, loading } = useMyAddresses();
  const { fields, applyAddress, selectedAddressId, clearAddress } = useCheckout();
  const { street, town, zip } = fields;

  /* Prefill once, and only once. A shopper who picks a different address — or
     starts typing over the prefilled one — must not have the default snap back
     underneath them on the next render. */
  const prefilled = useRef(false);

  /* …and never over work in progress. A guest can fill the whole form and only
     then verify their email, which signs them in and makes this list appear;
     overwriting what they just typed with a stale saved address would be worse
     than not prefilling at all. */
  useEffect(() => {
    if (prefilled.current || !addresses.length) return;
    prefilled.current = true;
    if (street.trim() || town.trim() || zip.trim()) return;
    applyAddress(addresses.find((a) => a.isDefault) ?? addresses[0]!);
  }, [addresses, applyAddress, street, town, zip]);

  if (loading || !addresses.length) return null;

  return (
    <div className="mt-4">
      <p className="text-lg font-semibold text-secondary-foreground">
        Deliver to a saved address
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {addresses.map((address) => {
          const active = selectedAddressId === address.id;
          return (
            <button
              key={address.id}
              type="button"
              onClick={() => applyAddress(address)}
              aria-pressed={active}
              className={`rounded-lg border-[1.5px] p-3 text-left transition-colors ${
                active
                  ? "border-primary bg-background"
                  : "border-[#999796] hover:border-primary"
              }`}
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-secondary-foreground">
                <MapPinned className="size-3.5 shrink-0" />
                {address.label}
                {address.isDefault && (
                  <span className="rounded-full bg-home-bg-2 px-2 py-0.5 text-[10px] font-medium">
                    Default
                  </span>
                )}
              </span>
              <span className="mt-1 block text-xs text-gray-1-foreground">
                {address.fullName}
              </span>
              <span className="mt-0.5 block text-xs text-gray-1-foreground">
                {oneLine(address)}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={clearAddress}
        className="mt-2 text-xs text-gray-1-foreground underline underline-offset-2"
      >
        Use a different address
      </button>
    </div>
  );
};

export default SavedAddresses;
