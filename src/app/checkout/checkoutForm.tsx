"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import GuestEmailField from "./guestEmailField";
import { useCheckout } from "@/lib/checkout/checkout-context";
import RegisterForm from "./registerForm";

const CheckoutForm = () => {
  /* Fields are lifted into the checkout context so the Place Order button —
     which lives in the sibling <CheckoutPayment/> column — can read them. The
     form no longer submits on its own. */
  const { fields, setField } = useCheckout();

  return (
    <div>
      <div className="mt-10">
        <div className="flex flex-col gap-7.5">
          <div className="flex sm:flex-row flex-col justify-between gap-x-[22px] gap-y-7.5">
            <label
              htmlFor="first_name"
              className="text-gray-1-foreground w-full text-base"
            >
              First name<span className="text-red-400">*</span>
              <Input
                className={
                  "border-[1.5px] border-[#999796] text-base text-gray-1-foreground font-medium py-3 mt-2.5"
                }
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
              className="text-gray-1-foreground w-full text-base"
            >
              Last name<span className="text-red-400">*</span>
              <Input
                className={
                  "border-[1.5px] border-[#999796] text-base text-gray-1-foreground font-medium py-3 mt-2.5"
                }
                type={"text"}
                name={"last_name"}
                id="last_name"
                value={fields.last_name}
                onChange={(e) => setField("last_name", e.target.value)}
                required
              />
            </label>
          </div>
          <div className="flex sm:flex-row flex-col justify-between gap-x-[22px] gap-y-7.5">
            <GuestEmailField />
            <label
              htmlFor="phone"
              className="text-gray-1-foreground w-full text-base"
            >
              Phone<span className="text-red-400">*</span>
              <Input
                className={
                  "border-[1.5px] border-[#999796] text-base text-gray-1-foreground font-medium py-3 mt-2.5"
                }
                type={"number"}
                name={"phone"}
                id="phone"
                value={fields.phone}
                onChange={(e) => setField("phone", e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="country"
              className="text-gray-1-foreground text-base"
            >
              Country/Region<span className="text-red-400">*</span>
            </label>
            <Select name="country" required value={fields.country} onValueChange={(v) => setField("country", v)}>
              <SelectTrigger
                id="country"
                className="h-12.5 py-2.5 border-[1.5px] border-[#999796] text-base text-gray-1-foreground mt-2.5"
              >
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="py-[14px] bg-background ">
                <SelectItem value="united-states" className="cursor-pointer">
                  United States
                </SelectItem>
                <SelectItem value="united-kingdom" className="cursor-pointer">
                  United Kingdom
                </SelectItem>
                <SelectItem value="bangladesh" className="cursor-pointer">
                  Bangladesh
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="town"
              className="text-gray-1-foreground w-full text-base"
            >
              Town / City<span className="text-red-400">*</span>
              <Input
                className={
                  "border-[1.5px] border-[#999796] text-base text-gray-1-foreground font-medium py-3 mt-2.5"
                }
                type={"text"}
                name={"town"}
                id="town"
                value={fields.town}
                onChange={(e) => setField("town", e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="street"
              className="text-gray-1-foreground w-full text-base"
            >
              Street address<span className="text-red-400">*</span>
              <Input
                className={
                  "border-[1.5px] border-[#999796] text-base text-gray-1-foreground font-medium py-3 mt-2.5"
                }
                type={"text"}
                name={"street"}
                id="street"
                value={fields.street}
                onChange={(e) => setField("street", e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="zip"
              className="text-gray-1-foreground w-full text-base"
            >
              ZIP Code<span className="text-red-400">*</span>
              <Input
                className={
                  "border-[1.5px] border-[#999796] text-base text-gray-1-foreground font-medium py-3 mt-2.5"
                }
                type={"text"}
                name={"zip"}
                id="zip"
                value={fields.zip}
                onChange={(e) => setField("zip", e.target.value)}
                required
              />
            </label>
          </div>
          <label
            htmlFor="notes"
            className="text-gray-1-foreground w-full text-base"
          >
            Additional information (optional)
            <Textarea
              className={
                "border-[1.5px] border-[#999796] text-base text-gray-1-foreground font-medium py-3 mt-2.5 min-h-[140px]"
              }
              name={"notes"}
              id="notes"
              value={fields.notes}
              onChange={(e) => setField("notes", e.target.value)}
            />
          </label>
        </div>
        <RegisterForm />
        {/* <Button type="submit"  className="w-full mt-5 lg:px-6 lg:py-3 lg:text-lg">Submit Order</Button> */}
        {/* {state?.message && <p className="mt-4 text-green-600 text-center">{state.message}</p>} */}
      </div>
    </div>
  );
};

export default CheckoutForm;
