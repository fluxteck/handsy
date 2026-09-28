"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GuestEmailField from "./guestEmailField";
import CountryCombobox from "./countryCombobox";
import SavedAddresses from "./savedAddresses";
import { useCheckout } from "@/lib/checkout/checkout-context";

const FIELD_CLASS =
  "h-9 border-[1.5px] border-[#999796] text-xs text-gray-1-foreground font-medium mt-1.5 bg-background px-3";

const CheckoutForm = () => {
  /* Fields are lifted into the checkout context so the Place Order button —
     which lives in the sibling <CheckoutPayment/> column — can read them. The
     form no longer submits on its own. */
  const { fields, setField, customerId, selectedAddressId, saveAddress, setSaveAddress } =
    useCheckout();

  return (
    <>
      <SavedAddresses />

      <div className="mt-4">
        <p className="text-lg font-semibold text-secondary-foreground">
          Contact &amp; delivery
        </p>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex sm:flex-row flex-col sm:items-start justify-between gap-x-3 gap-y-3">
            <GuestEmailField />
            <label
              htmlFor="phone"
              className="text-gray-1-foreground w-full text-xs"
            >
              Mobile number<span className="text-red-400">*</span>
              <Input
                className={FIELD_CLASS}
                type={"tel"}
                name={"phone"}
                id="phone"
                value={fields.phone}
                onChange={(e) => setField("phone", e.target.value)}
                required
              />
            </label>
          </div>

          <div className="flex sm:flex-row flex-col justify-between gap-x-3 gap-y-3">
            <label
              htmlFor="first_name"
              className="text-gray-1-foreground w-full text-xs"
            >
              First name<span className="text-red-400">*</span>
              <Input
                className={FIELD_CLASS}
                type={"text"}
                name={"first_name"}
                id="first_name"
                value={fields.first_name}
                onChange={(e) => setField("first_name", e.target.value)}
                required
              />
            </label>
            <label
              htmlFor="last_name"
              className="text-gray-1-foreground w-full text-xs"
            >
              Last name<span className="text-red-400">*</span>
              <Input
                className={FIELD_CLASS}
                type={"text"}
                name={"last_name"}
                id="last_name"
                value={fields.last_name}
                onChange={(e) => setField("last_name", e.target.value)}
                required
              />
            </label>
          </div>

          <label
            htmlFor="street"
            className="text-gray-1-foreground w-full text-xs"
          >
            Address<span className="text-red-400">*</span>
            <Input
              className={FIELD_CLASS}
              type={"text"}
              name={"street"}
              id="street"
              value={fields.street}
              onChange={(e) => setField("street", e.target.value)}
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            <div className="w-full">
              <label htmlFor="town" className="text-gray-1-foreground text-xs">
                City<span className="text-red-400">*</span>
              </label>
              <Input
                className={FIELD_CLASS}
                type={"text"}
                name={"town"}
                id="town"
                value={fields.town}
                onChange={(e) => setField("town", e.target.value)}
                required
              />
            </div>

            {/* State was missing entirely, and the order's `region` was filled
                with the city instead — so every address recorded its city twice
                and its state never. */}
            <div className="w-full">
              <label htmlFor="state" className="text-gray-1-foreground text-xs">
                State<span className="text-red-400">*</span>
              </label>
              <Input
                className={FIELD_CLASS}
                type={"text"}
                name={"state"}
                id="state"
                value={fields.state}
                onChange={(e) => setField("state", e.target.value)}
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="country" className="text-gray-1-foreground text-xs">
                Country<span className="text-red-400">*</span>
              </label>
              <CountryCombobox
                id="country"
                value={fields.country}
                onChange={(v) => setField("country", v)}
              />
            </div>

            <div className="w-full">
              <label htmlFor="zip" className="text-gray-1-foreground text-xs">
                ZIP<span className="text-red-400">*</span>
              </label>
              <Input
                className={FIELD_CLASS}
                type={"text"}
                name={"zip"}
                id="zip"
                value={fields.zip}
                onChange={(e) => setField("zip", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Only offered to someone with an account to save it to, and only for
              an address they actually typed — re-saving one picked from the list
              above would just duplicate it. */}
          {customerId && !selectedAddressId && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="save-address"
                checked={saveAddress}
                onCheckedChange={(v) => setSaveAddress(v === true)}
                className="rounded-[4px] border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
              />
              <Label
                htmlFor="save-address"
                className="text-xs font-normal text-secondary-foreground"
              >
                Save this address to my account for next time
              </Label>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
