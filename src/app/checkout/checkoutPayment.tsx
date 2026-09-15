"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Close } from "@/lib/icon";
import { CreditCard, Landmark, Percent, QrCode, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import currencyFormatter from "currency-formatter";
import { useCart } from "@/lib/cart/cart-context";
import { useCheckout } from "@/lib/checkout/checkout-context";
import CouponCodeForm from "./couponCodeForm";
import CheckoutUpsell from "./checkoutUpsell";
import { ProductType } from "@/types/productType";

/* What Razorpay's own checkout modal actually offers once "Online payment"
   is chosen — not separately selectable here, since the server only ever
   distinguishes "online" from "cod" (see toServerMethod in checkout-context).
   Purely informational, and truthful: this is the real set of methods the
   modal presents. */
const ONLINE_METHODS = [
  { label: "UPI", icon: QrCode },
  { label: "Cards", icon: CreditCard },
  { label: "EMI", icon: Percent },
  { label: "NetBanking", icon: Landmark },
  { label: "Wallets", icon: Wallet },
] as const;

const CheckoutPayment = ({ upsellCandidates }: { upsellCandidates: ProductType[] }) => {
  const { products, subTotal, tax, total, currency, remove } = useCart();
  const {
    paymentMethod,
    setPaymentMethod,
    termsAccepted,
    setTermsAccepted,
    isPlacing,
    placeOrder,
  } = useCheckout();
  const money = (amount: number) =>
    currencyFormatter.format(amount, { code: currency || "INR" });

  return (
    <div>
      <p className="text-lg font-semibold text-secondary-foreground">
        Order summary
      </p>

      <div className="mt-3 flex flex-col gap-3 max-h-[20vh] overflow-y-auto" data-lenis-prevent>
        {products.map((line) => (
          <div className="flex items-center justify-between gap-3" key={line.id}>
            <div className="flex items-center gap-3 min-w-0">
              <Image
                width={44}
                height={44}
                src={line.thumbnail}
                alt="img"
                className="bg-white size-11 object-contain rounded-md shrink-0"
              />
              <div className="min-w-0">
                <p className="text-secondary-foreground text-sm font-medium truncate">
                  {line.title}
                </p>
                <span className="text-xs text-gray-1-foreground">
                  Qty: {line.quantity}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <p className="text-secondary-foreground text-sm font-semibold whitespace-nowrap">
                {money(line.price * line.quantity)}
              </p>
              <button
                type="button"
                aria-label={`Remove ${line.title} from cart`}
                onClick={() => void remove(line.id)}
                className="flex items-center justify-center size-6 rounded-full text-gray-1-foreground hover:bg-primary hover:text-white transition-colors duration-200"
              >
                <Close className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <CouponCodeForm />
      </div>

      <div className="mt-3">
        <CheckoutUpsell candidates={upsellCandidates} />
      </div>

      <div className="mt-3 pt-3 border-t border-t-[#c9c2b8] flex flex-col gap-1.5">
        <div className="flex justify-between">
          <p className="text-sm text-gray-1-foreground">Subtotal</p>
          <p className="text-sm text-secondary-foreground font-medium">{money(subTotal)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-1-foreground">Tax</p>
          <p className="text-sm text-secondary-foreground font-medium">{money(tax)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-t-[#c9c2b8]">
        <p className="text-lg font-semibold text-secondary-foreground">Total</p>
        <p className="text-lg font-semibold text-secondary-foreground">{money(total || subTotal)}</p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-gray-1-foreground mb-2">
          Pay with
        </p>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="flex flex-col gap-2"
        >
          <Label
            htmlFor="online"
            className="cursor-pointer flex flex-col gap-2 rounded-xl border-[1.5px] border-[#999796] px-3 py-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-home-bg-3 font-normal"
          >
            <span className="flex items-center gap-2">
              <RadioGroupItem
                value="online"
                id="online"
                aria-label="radio"
                className="w-3 h-3 border-primary text-transparent [&_svg]:w-2 [&_svg]:h-2 [&_svg]:fill-black"
              />
              <span className="text-secondary-foreground text-xs font-medium">
                Online payment
              </span>
            </span>
            <span className="flex flex-wrap gap-x-3 gap-y-1.5 pl-5">
              {ONLINE_METHODS.map((method) => (
                <span
                  key={method.label}
                  className="flex items-center gap-1 text-[11px] text-gray-1-foreground"
                >
                  <method.icon className="size-3.5" />
                  {method.label}
                </span>
              ))}
            </span>
          </Label>

          <Label
            htmlFor="cash-on-delivery"
            className="cursor-pointer flex items-center gap-2 rounded-xl border-[1.5px] border-[#999796] px-3 py-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-home-bg-3 font-normal"
          >
            <RadioGroupItem
              value="cash-on-delivery"
              id="cash-on-delivery"
              aria-label="radio"
              className="w-3 h-3 border-primary text-transparent [&_svg]:w-2 [&_svg]:h-2 [&_svg]:fill-black"
            />
            <span className="text-secondary-foreground text-xs font-medium">
              Cash on delivery
            </span>
          </Label>
        </RadioGroup>

        <div className="flex items-center gap-2 mt-3">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(v) => setTermsAccepted(v === true)}
            className="rounded-[4px] border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
          />
          <Label
            htmlFor="terms"
            className="text-xs font-normal text-secondary-foreground"
          >
            I agree to the website{" "}
            <Link href={"/terms-conditions"} className="underline">
              terms and conditions
            </Link>
            <span className="text-primary-foreground">*</span>
          </Label>
        </div>

        <div className="flex justify-center mt-3">
          <Button
            className="h-9 px-5 text-sm"
            onClick={() => void placeOrder()}
            disabled={isPlacing}
          >
            {isPlacing ? "Placing Order…" : "Place order"}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-1-foreground mt-2.5">
          Secure checkout · Free 15-day returns
        </p>
      </div>
    </div>
  );
};

export default CheckoutPayment;
