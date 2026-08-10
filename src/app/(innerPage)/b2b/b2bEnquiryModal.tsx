"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { Boxes, CheckCircle2, Globe2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { categorySlugLabels } from "@/db/menuList";
import { submitB2bEnquiry } from "./actions";

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Netherlands", "United Arab Emirates", "Saudi Arabia", "India", "Singapore",
  "Japan", "South Korea", "South Africa", "Brazil", "Mexico", "Italy", "Spain",
  "Sweden", "New Zealand", "Other",
];

const fieldClass = "mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground";
const selectTriggerClass = "h-12.5 py-2.5 border-[1.5px] border-[#999796] text-base text-gray-1-foreground mt-2.5 w-full";

const initialState = { success: false, message: "" };

const B2bEnquiryModal = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(submitB2bEnquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !isPending && state.message) {
      if (!state.success) toast.error(state.message);
    }
    prevPending.current = isPending;
  }, [isPending, state]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        formRef.current?.reset();
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button className={cn("group/cta", className)} onClick={() => setOpen(true)}>
        Request a Bulk Quote
        <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
      </Button>

      <DialogContent
        showCloseButton={!state.success}
        className="max-w-[640px] w-[calc(100%-2rem)] sm:w-full p-0 gap-0 rounded-3xl overflow-hidden border border-gray-2 shadow-3xl max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle className="sr-only">Request a bulk quote</DialogTitle>

        {state.success ? (
          <div className="flex flex-col items-center justify-center text-center px-8 py-16">
            <div className="relative flex size-16 items-center justify-center rounded-full bg-primary text-white">
              <span className="absolute inset-0 rounded-full bg-primary/30 animate-spring-one" aria-hidden />
              <CheckCircle2 className="relative size-8" strokeWidth={1.5} />
            </div>
            <p className="mt-6 text-secondary-foreground text-xl lg:text-2xl font-medium">Enquiry Sent</p>
            <p className="mt-2 max-w-sm text-gray-1-foreground leading-[170%]">{state.message}</p>
            <Button type="button" className="mt-7.5 min-w-[160px]" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden bg-home-bg-4 px-6 py-8 lg:px-10 lg:py-10">
              <div
                className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-gradient-radial from-primary/15 to-transparent blur-2xl"
                aria-hidden
              />
              <span className="relative flex size-12 items-center justify-center rounded-full bg-primary text-white">
                <Boxes className="size-5" />
              </span>
              <p className="relative mt-4 text-heading capitalize text-secondary-foreground">Request a Bulk Quote</p>
              <p className="relative mt-2 max-w-md text-gray-1-foreground leading-[170%]">
                Share your business details and requirements — our B2B team will respond with
                tiered pricing within 1–2 business days.
              </p>
            </div>

            <form ref={formRef} action={formAction} className="px-6 py-7.5 lg:px-10 lg:py-8.75">
              <div className="grid sm:grid-cols-2 gap-6">
                <Label htmlFor="fullName" className="text-gray-1-foreground text-base w-full">
                  Full Name<span className="text-primary-foreground">*</span>
                  <Input type="text" name="fullName" id="fullName" required placeholder="Your name" className={fieldClass} />
                </Label>
                <Label htmlFor="companyName" className="text-gray-1-foreground text-base w-full">
                  Company Name<span className="text-primary-foreground">*</span>
                  <Input type="text" name="companyName" id="companyName" required placeholder="Your company" className={fieldClass} />
                </Label>
                <Label htmlFor="email" className="text-gray-1-foreground text-base w-full">
                  Business Email<span className="text-primary-foreground">*</span>
                  <Input type="email" name="email" id="email" required placeholder="you@company.com" className={fieldClass} />
                </Label>
                <Label htmlFor="phone" className="text-gray-1-foreground text-base w-full">
                  Phone / WhatsApp<span className="text-primary-foreground">*</span>
                  <Input type="tel" name="phone" id="phone" required placeholder="+1 234 567 8900" className={fieldClass} />
                </Label>
                <Label htmlFor="country" className="text-gray-1-foreground text-base w-full">
                  Country<span className="text-primary-foreground">*</span>
                  <Select name="country" required>
                    <SelectTrigger id="country" className={selectTriggerClass}>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="py-[14px] bg-background">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country} className="cursor-pointer">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Label>
                <Label htmlFor="category" className="text-gray-1-foreground text-base w-full">
                  Product / Category Interested In<span className="text-primary-foreground">*</span>
                  <Select name="category" required>
                    <SelectTrigger id="category" className={selectTriggerClass}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="py-[14px] bg-background">
                      {Object.entries(categorySlugLabels).map(([slug, label]) => (
                        <SelectItem key={slug} value={label} className="cursor-pointer">
                          {label}
                        </SelectItem>
                      ))}
                      <SelectItem value="Multiple / Not sure yet" className="cursor-pointer">
                        Multiple / Not sure yet
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Label>
                <Label htmlFor="quantity" className="text-gray-1-foreground text-base w-full sm:col-span-2">
                  Estimated Quantity<span className="text-primary-foreground">*</span>
                  <Input type="text" name="quantity" id="quantity" required placeholder="e.g. 200 units" className={fieldClass} />
                </Label>
                <Label htmlFor="message" className="text-gray-1-foreground text-base w-full sm:col-span-2">
                  Message / Requirements
                  <Textarea
                    name="message"
                    id="message"
                    placeholder="Customization needs, target market, timeline..."
                    className="mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground min-h-[110px]"
                  />
                </Label>
              </div>

              {!state.success && state.message && (
                <p className="mt-5 text-sm text-red-500">{state.message}</p>
              )}

              <div className="mt-7.5 flex items-center gap-4">
                <Button type="submit" disabled={isPending} className="min-w-[180px]">
                  {isPending ? "Submitting..." : "Submit Enquiry"}
                </Button>
                <p className="flex items-center gap-1.5 text-xs text-gray-3-foreground">
                  <Globe2 className="size-3.5" /> Trusted by 500+ businesses worldwide
                </p>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default B2bEnquiryModal;
