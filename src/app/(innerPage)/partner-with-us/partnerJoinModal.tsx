"use client";

import type React from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { BadgeCheck, CheckCircle2, Clock3 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useEnquiry, useNewsletter } from "@commercekitsdk/react";
import { countries, fieldClass, selectTriggerClass } from "../b2b/b2bEnquiryModal";

/** Who is applying. One entry per segment on the page, so a segment's own
 *  "Join as …" button can open the form with its option already chosen. */
export const memberTypes = [
  "Interior Designer / Architect",
  "Hospitality",
  "Builder / Developer",
  "Workspace / Institution",
] as const;

export type MemberType = (typeof memberTypes)[number];

const SUCCESS_MESSAGE =
  "Thanks for applying — our team will review your details and confirm your membership by email.";

interface PartnerJoinModalProps {
  className?: string;
  /** Text on the button that opens the modal. */
  label?: string;
  /** Preselects the "Joining as" option. */
  memberType?: MemberType;
}

const PartnerJoinModal = ({ className, label = "Join with us!", memberType }: PartnerJoinModalProps) => {
  const [open, setOpen] = useState(false);
  /* Filed through the same enquiries endpoint as the wholesale form, under the
     `b2b` type the server already queues; the subject tells the team it is a
     trade programme application, and the firm details ride along in `fields`. */
  const { submit, isSubmitting, isSuccess, error, reset } = useEnquiry("b2b");
  const { subscribe } = useNewsletter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const wantsUpdates = data.get("subscribe") === "on";
    const result = await submit({
      name: String(data.get("fullName") ?? ""),
      email,
      phone: String(data.get("phone") ?? ""),
      subject: "Trade Programme application",
      message: String(data.get("message") ?? ""),
      fields: {
        companyName: String(data.get("companyName") ?? ""),
        country: String(data.get("country") ?? ""),
        memberType: String(data.get("memberType") ?? ""),
        portfolio: String(data.get("portfolio") ?? ""),
        subscribe: wantsUpdates ? "yes" : "no",
      },
    });
    // From the result, not `error` state: this closure predates the update.
    if (!result.ok) {
      toast.error(result.error.message || "We couldn't send your application. Please try again.");
      return;
    }
    /* Opt-in only, and never allowed to fail the application: signing up is
       idempotent server-side, and the choice is recorded in `fields` above. */
    if (wantsUpdates) void subscribe({ email, source: "trade-programme" });
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        formRef.current?.reset();
        // Clear success/error so reopening shows the form, not the last result.
        reset();
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button className={cn("group/cta", className)} onClick={() => setOpen(true)}>
        {label}
        <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
      </Button>

      <DialogContent
        showCloseButton={!isSuccess}
        className="max-w-[640px] w-[calc(100%-2rem)] sm:w-full p-0 gap-0 rounded-3xl overflow-hidden border border-gray-2 shadow-3xl max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle className="sr-only">Join the Handsy Market Trade Programme</DialogTitle>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center px-8 py-16">
            <div className="relative flex size-16 items-center justify-center rounded-full bg-primary text-white">
              <span className="absolute inset-0 rounded-full bg-primary/30 animate-spring-one" aria-hidden />
              <CheckCircle2 className="relative size-8" strokeWidth={1.5} />
            </div>
            <p className="mt-6 text-secondary-foreground text-xl lg:text-2xl font-medium">Application Sent</p>
            <p className="mt-2 max-w-sm text-gray-1-foreground leading-[170%]">{SUCCESS_MESSAGE}</p>
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
                <BadgeCheck className="size-5" />
              </span>
              <p className="relative mt-4 text-heading text-secondary-foreground">Join the Trade Programme</p>
              <p className="relative mt-2 max-w-md text-gray-1-foreground leading-[170%]">
                Tell us about your firm and share a portfolio or website. It takes about two minutes.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-7.5 lg:px-10 lg:py-8.75">
              <div className="grid sm:grid-cols-2 gap-6">
                <Label htmlFor="fullName" className="text-gray-1-foreground text-base w-full">
                  Full Name<span className="text-primary-foreground">*</span>
                  <Input type="text" name="fullName" id="fullName" required placeholder="Your name" className={fieldClass} />
                </Label>
                <Label htmlFor="companyName" className="text-gray-1-foreground text-base w-full">
                  Firm / Company Name<span className="text-primary-foreground">*</span>
                  <Input type="text" name="companyName" id="companyName" required placeholder="Your firm or studio" className={fieldClass} />
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
                <Label htmlFor="memberType" className="text-gray-1-foreground text-base w-full">
                  Joining As<span className="text-primary-foreground">*</span>
                  <Select name="memberType" required defaultValue={memberType}>
                    <SelectTrigger id="memberType" className={selectTriggerClass}>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent className="py-[14px] bg-background">
                      {memberTypes.map((type) => (
                        <SelectItem key={type} value={type} className="cursor-pointer">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Label>
                <Label htmlFor="portfolio" className="text-gray-1-foreground text-base w-full sm:col-span-2">
                  Portfolio or Website<span className="text-primary-foreground">*</span>
                  <Input
                    type="text"
                    inputMode="url"
                    name="portfolio"
                    id="portfolio"
                    required
                    placeholder="yourstudio.com"
                    className={fieldClass}
                  />
                </Label>
                <Label htmlFor="message" className="text-gray-1-foreground text-base w-full sm:col-span-2">
                  About Your Projects
                  <Textarea
                    name="message"
                    id="message"
                    placeholder="The kind of projects you work on, and what you are sourcing..."
                    className="mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground min-h-[110px]"
                  />
                </Label>
                <div className="flex items-center gap-3 sm:col-span-2">
                  <Checkbox id="subscribe" name="subscribe" />
                  <Label htmlFor="subscribe" className="text-sm font-normal leading-normal text-gray-1-foreground">
                    Subscribe to trade offers, rewards and updates by email
                  </Label>
                </div>
              </div>

              {!isSuccess && error && (
                <p className="mt-5 text-sm text-red-500">{error.message}</p>
              )}

              <div className="mt-7.5 flex flex-wrap items-center gap-4">
                <Button type="submit" disabled={isSubmitting} className="min-w-[180px]">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
                <p className="flex items-center gap-1.5 text-xs text-gray-3-foreground">
                  <Clock3 className="size-3.5" /> Our team reviews your details and confirms your membership
                </p>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PartnerJoinModal;
