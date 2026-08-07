"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import toast from "react-hot-toast";
import {
  Award,
  CalendarClock,
  MessageCircle,
  PhoneIncoming,
  ShieldCheck,
  Video,
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

export interface DemoRequestPayload extends CallbackRequestPayload {
  preferredTime: string;
}

type ContactDialogField = { id: string; label: string; type: string; placeholder: string };

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
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
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
  /** Display phone number, e.g. "+91-9314444747". Also used to build the tel: link. */
  phoneNumber?: string;
  /** WhatsApp number in international format without symbols, e.g. "919314444747". Defaults to phoneNumber digits. */
  whatsappNumber?: string;
  /** Prefilled WhatsApp message. */
  whatsappMessage?: string;
  /** Called after a visitor submits the callback request form. */
  onRequestCallback?: (payload: CallbackRequestPayload) => void;
  /** Called after a visitor schedules a live video demo. */
  onScheduleDemo?: (payload: DemoRequestPayload) => void;
  expertName?: string;
  isExpertOnline?: boolean;
  responseTime?: string;
  /** Sticks the card in view while scrolling on desktop. */
  sticky?: boolean;
  className?: string;
}

const NeedHelp = ({
  phoneNumber = "+91-9314444747",
  whatsappNumber,
  whatsappMessage = "Hi! I'd like some help choosing the right product.",
  onRequestCallback,
  onScheduleDemo,
  expertName = "Product Expert",
  isExpertOnline = true,
  responseTime = "Usually responds within 5 minutes",
  sticky = true,
  className,
}: NeedHelpPropsType) => {
  const phoneDigits = phoneNumber.replace(/[^\d+]/g, "");
  const waDigits = (whatsappNumber ?? phoneNumber).replace(/\D/g, "");
  const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section
      aria-labelledby="need-help-heading"
      className={cn(
        "rounded-2xl border border-gray-2 bg-background p-5 lg:p-6",
        sticky && "lg:sticky lg:top-28",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="need-help-heading" className="font-display text-lg lg:text-xl text-secondary-foreground">
          Need Help in Buying?
        </h3>
        {isExpertOnline && (
          <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-gray-1-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#59994D]/60" aria-hidden />
              <span className="relative inline-flex size-2 rounded-full bg-[#59994D]" aria-hidden />
            </span>
            {expertName} online
          </span>
        )}
      </div>

      {/* Call Now — icon, label, number, and response time share a single compact row */}
      <a
        href={`tel:${phoneDigits}`}
        className="group mt-4 flex items-center gap-3 rounded-xl border border-gray-2 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
          <Call className="size-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
          <span className="shrink-0 text-xs text-gray-1-foreground">Call Now</span>
          <span className="truncate text-sm font-semibold text-secondary-foreground">{phoneNumber}</span>
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 text-[11px] text-gray-1-foreground sm:flex">
          <CallTime className="size-3.5 shrink-0" />
          {responseTime}
        </span>
      </a>

      {/* Product Demo, WhatsApp, and Callback — equal-height compact action tiles */}
      <div className="mt-2.5 grid grid-cols-3 gap-2.5">
        <ContactDialog
          title="Schedule a Live Video Demo"
          description={`Pick a time that works for you and a ${expertName.toLowerCase()} will walk you through the product live.`}
          extraField={{
            id: "preferredTime",
            label: "Preferred date & time",
            type: "datetime-local",
            placeholder: "",
          }}
          submitLabel="Schedule Demo"
          onSubmit={(values) => {
            onScheduleDemo?.(values as unknown as DemoRequestPayload);
            toast.success("Demo scheduled! We'll confirm the slot shortly.");
          }}
          trigger={
            <button
              type="button"
              className="group flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-2 px-2 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-[#F2F2F2] text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <Video className="size-4" strokeWidth={1.5} />
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-secondary-foreground">
                Demo
                <span className="rounded-full bg-[#59994D] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white">
                  Live
                </span>
              </span>
            </button>
          }
        />

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full flex-col items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 py-3 text-center text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1FB855] hover:shadow-md"
        >
          <MessageCircle className="size-4" strokeWidth={1.5} />
          <span className="text-xs font-medium">WhatsApp</span>
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
              className="group flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-2 px-2 py-3 text-center text-secondary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-[#F2F2F2] text-secondary-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <PhoneIncoming className="size-4" strokeWidth={1.5} />
              </span>
              <span className="text-xs font-medium">Callback</span>
            </button>
          }
        />
      </div>

      <ul className="mt-4 grid grid-cols-3 divide-x divide-gray-2 border-t border-gray-2 pt-4">
        {trustIndicators.map(({ id, icon: Icon, label }) => (
          <li
            key={id}
            className="flex flex-col items-center gap-1.5 px-1 text-center transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-gray-2 text-gray-1-foreground transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white">
              <Icon className="size-3.5" strokeWidth={1.5} />
            </span>
            <span className="text-[10px] font-medium leading-tight text-gray-1-foreground">{label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2 border-t border-gray-2 pt-4 text-[11px] text-gray-3-foreground">
        <CalendarClock className="size-3.5 shrink-0" strokeWidth={1.5} />
        Flexible scheduling &middot; No spam calls &middot; Cancel anytime
      </div>
    </section>
  );
};

export default NeedHelp;
