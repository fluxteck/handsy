"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import toast from "react-hot-toast";
import {
  Award,
  Boxes,
  MessageCircle,
  PhoneIncoming,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Call, CallTime } from "@/lib/icon";
import { cn } from "@/lib/utils";

export interface CallbackRequestPayload {
  name: string;
  phone: string;
}

export interface BulkRequestPayload extends CallbackRequestPayload {
  quantity: string;
}

type ContactDialogField = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
};

const IST_OFFSET_MINUTES = 5 * 60 + 30; // UTC+5:30, no daylight saving
const EXPERT_ONLINE_FROM_HOUR = 10; // 10:00 AM IST
const EXPERT_ONLINE_UNTIL_HOUR = 18; // 6:00 PM IST

/**
 * Derived from the absolute UTC instant (not the visitor's local timezone),
 * so this returns the same result on the server and after client hydration.
 */
const isExpertOnlineNowIST = () => {
  const now = new Date();
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istHour = ((utcMinutes + IST_OFFSET_MINUTES) % (24 * 60)) / 60;
  return istHour >= EXPERT_ONLINE_FROM_HOUR && istHour < EXPERT_ONLINE_UNTIL_HOUR;
};

const trustIndicators: { id: string; icon: typeof Zap; label: string }[] = [
  { id: "fast-response", icon: Zap, label: "Fast Response" },
  { id: "expert-advice", icon: Award, label: "Expert Advice" },
  { id: "secure-purchase", icon: ShieldCheck, label: "Secure Purchase" },
];

/**
 * Shared name + phone (+ optional field) request form used by both the
 * callback and demo-scheduling dialogs, so the two flows don't duplicate
 * markup or validation logic.
 */
const ContactRequestForm = ({
  extraField,
  submitLabel,
  onSubmit,
}: {
  extraField?: ContactDialogField;
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => void;
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [extraValue, setExtraValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[a-zA-Z\s]{2,}$/.test(name.trim())) {
      toast.error("Please enter your full name");
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (extraField && !extraValue) {
      toast.error(`Please choose ${extraField.label.toLowerCase()}`);
      return;
    }

    setIsSubmitting(true);
    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      ...(extraField ? { [extraField.id]: extraValue } : {}),
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name">Full name</Label>
        <Input
          id="contact-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-phone">Phone number</Label>
        <Input
          id="contact-phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          placeholder="10-digit mobile number"
          autoComplete="tel"
          required
        />
      </div>
      {extraField && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={extraField.id}>{extraField.label}</Label>
          <Input
            id={extraField.id}
            type={extraField.type}
            value={extraValue}
            onChange={(e) => setExtraValue(e.target.value)}
            placeholder={extraField.placeholder}
            required
          />
        </div>
      )}
      <DialogFooter>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
};

const ContactDialog = ({
  trigger,
  title,
  description,
  extraField,
  submitLabel,
  onSubmit,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  extraField?: ContactDialogField;
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ContactRequestForm
          extraField={extraField}
          submitLabel={submitLabel}
          onSubmit={(values) => {
            onSubmit(values);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export interface NeedHelpPropsType {
  /** Display phone number, e.g. "+91 291 234 5678". Also used to build the tel: link. */
  phoneNumber?: string;
  /** WhatsApp number in international format without symbols, e.g. "912912345678". Defaults to phoneNumber digits. */
  whatsappNumber?: string;
  /** Prefilled WhatsApp message. */
  whatsappMessage?: string;
  /** Called after a visitor submits the callback request form. */
  onRequestCallback?: (payload: CallbackRequestPayload) => void;
  /** Called after a visitor submits a bulk-quote request. */
  onRequestBulkQuote?: (payload: BulkRequestPayload) => void;
  expertName?: string;
  /** Manual override; omit to derive live from the current time (Online 10 AM–6 PM IST, Offline otherwise). */
  isExpertOnline?: boolean;
  responseTime?: string;
  /** Sticks the card in view while scrolling on desktop. */
  sticky?: boolean;
  className?: string;
}

const NeedHelp = ({
  phoneNumber = "+91 291 234 5678",
  whatsappNumber,
  whatsappMessage = "Hi! I'd like some help choosing the right product.",
  onRequestCallback,
  onRequestBulkQuote,
  expertName = "Product Expert",
  isExpertOnline,
  responseTime = "Usually responds within 5 minutes",
  sticky = true,
  className,
}: NeedHelpPropsType) => {
  const phoneDigits = phoneNumber.replace(/[^\d+]/g, "");
  const waDigits = (whatsappNumber ?? phoneNumber).replace(/\D/g, "");
  const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(whatsappMessage)}`;

  // Live IST-business-hours status, re-checked every minute so it flips
  // automatically without a page refresh. `isExpertOnline` still wins when
  // explicitly passed in, for callers that need to force a state.
  const [liveOnline, setLiveOnline] = useState(isExpertOnlineNowIST);
  useEffect(() => {
    const tick = () => setLiveOnline(isExpertOnlineNowIST());
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, []);
  const online = isExpertOnline ?? liveOnline;

  return (
    <section
      aria-labelledby="need-help-heading"
      className={cn(
        "rounded-2xl border border-gray-2 bg-background p-5 transition-shadow duration-300 hover:shadow-sm lg:p-6",
        sticky && "lg:sticky lg:top-28",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3
          id="need-help-heading"
          className="font-medium text-secondary-foreground lg:text-lg"
        >
          Need Help in Buying?
        </h3>
        <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-gray-1-foreground">
          <span className="relative flex size-2">
            {online && (
              <span
                className="absolute inline-flex size-full animate-ping rounded-full bg-[#59994D]/60"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative inline-flex size-2 rounded-full",
                online ? "bg-[#59994D]" : "bg-gray-3",
              )}
              aria-hidden
            />
          </span>
          {expertName} {online ? "Online" : "Offline"}
        </span>
      </div>

      {/* Call Now — icon, label, number, and response time share a single compact row */}
      <a
        href={`tel:${phoneDigits}`}
        className="group mt-3 flex items-center gap-3 rounded-xl border border-gray-2 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
          <Call className="size-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
          <span className="shrink-0 text-xs text-gray-1-foreground">
            Call Now
          </span>
          <span className="truncate text-sm font-semibold text-secondary-foreground">
            {phoneNumber}
          </span>
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 text-[11px] text-gray-1-foreground lg:flex">
          <CallTime className="size-3.5 shrink-0" />
          {responseTime}
        </span>
      </a>

      {/* Bulk Quote, WhatsApp, and Callback — equal-height compact action tiles.
          On mobile the columns are weighted (Bulk narrower) since "Bulk" is the
          shortest label and "WhatsApp"/"Callback" need the extra room; tablet+
          reverts to equal thirds. */}
      <div className="mt-2 grid grid-cols-[0.8fr_1.2fr_1fr] gap-1.5 sm:grid-cols-3 sm:gap-2">
        <ContactDialog
          title="Request a Bulk Quote"
          description={`Share your details and a ${expertName.toLowerCase()} will send you bulk pricing.`}
          extraField={{
            id: "quantity",
            label: "Quantity needed",
            type: "number",
            placeholder: "e.g. 50",
          }}
          submitLabel="Request Quote"
          onSubmit={(values) => {
            onRequestBulkQuote?.(values as unknown as BulkRequestPayload);
            toast.success("Thanks! We'll send your bulk quote shortly.");
          }}
          trigger={
            <button
              type="button"
              className="group flex h-full w-full items-center justify-center gap-1 sm:gap-1.5 rounded-xl border border-gray-2 px-1 py-2.5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <Boxes className="size-3 sm:size-3.5" strokeWidth={1.5} />
              </span>
              <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium text-secondary-foreground">
                Bulk
              </span>
            </button>
          }
        />

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-full items-center justify-center gap-1 sm:gap-1.5 rounded-xl border border-gray-2 px-1 py-2.5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
        >
          <span className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <MessageCircle className="size-3 sm:size-3.5" strokeWidth={1.5} />
          </span>
          <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium text-secondary-foreground">WhatsApp</span>
        </a>

        <ContactDialog
          title="Request a Callback"
          description={`Share your details and a ${expertName.toLowerCase()} will call you back shortly.`}
          submitLabel="Request Callback"
          onSubmit={(values) => {
            onRequestCallback?.(values as unknown as CallbackRequestPayload);
            toast.success("Thanks! Our team will call you back shortly.");
          }}
          trigger={
            <button
              type="button"
              className="group flex h-full w-full items-center justify-center gap-1 sm:gap-1.5 rounded-xl border border-gray-2 px-1 py-2.5 text-center text-secondary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <PhoneIncoming className="size-3 sm:size-3.5" strokeWidth={1.5} />
              </span>
              <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium">Callback</span>
            </button>
          }
        />
      </div>

      {/* Trust indicators — a single compact line instead of a separate badge grid + footer note */}
      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-gray-2 pt-3">
        {trustIndicators.map(({ id, icon: Icon, label }) => (
          <li
            key={id}
            className="flex items-center gap-1.5 text-[11px] font-medium text-gray-1-foreground"
          >
            <Icon className="size-3.5 shrink-0" strokeWidth={1.5} />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NeedHelp;
