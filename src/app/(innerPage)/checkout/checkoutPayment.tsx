import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const paymentCardClass =
  "flex items-center gap-2.5 rounded-lg border border-border px-3.5 py-3 cursor-pointer transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-home-bg-1";

const CheckoutPayment = () => {
  return (
    <div className="rounded-xl border border-border p-5 sm:p-6 lg:sticky lg:top-24">
      <p className="text-secondary-foreground font-semibold text-lg mb-4">
        Your Order
      </p>

      <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            width={56}
            height={56}
            src={"/images/cart/img-1.webp"}
            alt="Modern Tolik Chair"
            className="bg-home-bg-1 rounded-md object-contain shrink-0 size-14"
          />
          <div className="min-w-0">
            <p className="text-secondary-foreground text-sm font-medium line-clamp-1">
              Modern Tolik Chair
            </p>
            <span className="text-xs text-gray-1-foreground">Qty: 2</span>
          </div>
        </div>
        <p className="text-secondary-foreground text-sm font-semibold shrink-0">
          $350.00
        </p>
      </div>

      <div className="flex flex-col gap-3 py-4 border-b border-border text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-1-foreground">Subtotal</span>
          <span className="text-secondary-foreground font-medium">
            $1000.00
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-1-foreground pt-1">Shipping</span>
          <RadioGroup defaultValue="0" className="gap-1.5">
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="0"
                id="free-shipping"
                className="size-3.5 border-primary text-transparent"
              />
              <Label
                htmlFor="free-shipping"
                className="text-gray-1-foreground text-sm font-normal"
              >
                Free Shipping
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="10"
                id="fat-rate"
                className="size-3.5 border-primary text-transparent"
              />
              <Label
                htmlFor="fat-rate"
                className="text-gray-1-foreground text-sm font-normal"
              >
                Fat Rate $10.00
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <span className="text-secondary-foreground font-semibold">Total</span>
        <span className="text-secondary-foreground font-bold text-xl">
          $1025.00
        </span>
      </div>

      <div className="mt-6">
        <p className="text-secondary-foreground font-medium text-sm mb-3">
          Payment method
        </p>
        <RadioGroup defaultValue="bank-transfer" className="gap-2.5">
          <label htmlFor="bank-transfer" className="flex flex-col gap-1.5 rounded-lg border border-border px-3.5 py-3 cursor-pointer transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-home-bg-1">
            <span className="flex items-center gap-2.5">
              <RadioGroupItem
                value="bank-transfer"
                id="bank-transfer"
                className="size-3.5 border-primary text-transparent"
              />
              <span className="text-secondary-foreground text-sm font-medium">
                Direct bank transfer
              </span>
            </span>
            <span className="text-gray-1-foreground text-xs leading-relaxed pl-6">
              Make your payment directly into our bank account. Please use
              your Order ID as the payment reference. Your order will not be
              shipped until the funds have cleared in our account.
            </span>
          </label>

          <label htmlFor="check-payment" className={paymentCardClass}>
            <RadioGroupItem
              value="check-payment"
              id="check-payment"
              className="size-3.5 border-primary text-transparent"
            />
            <span className="text-secondary-foreground text-sm font-medium">
              Check payments
            </span>
          </label>

          <label htmlFor="cash-on-delivery" className={paymentCardClass}>
            <RadioGroupItem
              value="cash-on-delivery"
              id="cash-on-delivery"
              className="size-3.5 border-primary text-transparent"
            />
            <span className="text-secondary-foreground text-sm font-medium">
              Cash on delivery
            </span>
          </label>

          <label
            htmlFor="paypal"
            className={paymentCardClass + " justify-between"}
          >
            <span className="flex items-center gap-2.5">
              <RadioGroupItem
                value="paypal"
                id="paypal"
                className="size-3.5 border-primary text-transparent"
              />
              <span className="text-secondary-foreground text-sm font-medium">
                PayPal
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Image width={90} height={18} src={"/images/payment-card.webp"} alt="Accepted cards" />
            </span>
          </label>
        </RadioGroup>
      </div>

      <div className="flex items-start gap-2.5 mt-5">
        <Checkbox
          id="terms"
          className="mt-0.5 rounded-[4px] border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
        />
        <Label
          htmlFor="terms"
          className="text-sm font-normal text-secondary-foreground leading-snug"
        >
          I have read and agree to the website{" "}
          <Link href={"/terms-conditions"} className="underline">
            terms and conditions
          </Link>
          <span className="text-red-400">*</span>{" "}
        </Label>
      </div>

      <Button className="w-full mt-5 h-12 text-base font-semibold">
        Place Order
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-3.5">
        <ShieldCheck className="size-3.5 text-gray-1-foreground" />
        <p className="text-xs text-gray-1-foreground">
          Secure & encrypted checkout
        </p>
      </div>
    </div>
  );
};

export default CheckoutPayment;
