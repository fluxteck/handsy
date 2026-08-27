"use client";

import type React from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Store, CheckCircle2, Globe2 } from "lucide-react";
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
import { useEnquiry } from "@commercekitsdk/react";

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Netherlands", "United Arab Emirates", "Saudi Arabia", "India", "Singapore",
  "Japan", "South Korea", "South Africa", "Brazil", "Mexico", "Italy", "Spain",
  "Sweden", "New Zealand", "Other",
];

const experienceLevels = [
  "New to selling online",
  "Selling on other marketplaces",
  "Have my own online store",
  "Established wholesale / retail business",
];

const fieldClass = "mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground";
const selectTriggerClass = "h-12.5 py-2.5 border-[1.5px] border-[#999796] text-base text-gray-1-foreground mt-2.5 w-full";

const SUCCESS_MESSAGE =
  "Thanks for applying — our vendor team reviews every application and will reach out within 2–3 business days.";

/**
 * Category options for the seller-onboarding enquiry.
 *
 * Passed in rather than read here: this is a client component and the
 * catalogue read is server-side. It previously listed the purchased template's
 * categories, so a prospective seller could only describe their range in terms
 * of products this store does not carry.
 */
export interface VendorEnquiryModalProps {
  className?: string;
  categories?: string[];
}

const VendorEnquiryModal = ({ className, categories = [] }: VendorEnquiryModalProps) => {
  const [open, setOpen] = useState(false);
  /* A vendor application is an enquiry of its own type, so it queues
     separately from contact and wholesale. The craft-specific answers travel
     in `fields`. */
  const { submit, isSubmitting, isSuccess, error, reset } = useEnquiry("vendor");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = await submit({
      name: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      subject: "Vendor application",
      message: String(data.get("message") ?? ""),
      fields: {
        brandName: String(data.get("brandName") ?? ""),
        country: String(data.get("country") ?? ""),
        category: String(data.get("category") ?? ""),
        experience: String(data.get("experience") ?? ""),
      },
    });
    // From the result, not `error` state: this closure predates the update.
    if (!result.ok) {
      toast.error(result.error.message || "We couldn't send your application. Please try again.");
    }
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
        Apply to Sell
        <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
      </Button>

      <DialogContent
        showCloseButton={!isSuccess}
        className="max-w-[640px] w-[calc(100%-2rem)] sm:w-full p-0 gap-0 rounded-3xl overflow-hidden border border-gray-2 shadow-3xl max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle className="sr-only">Apply to become a Handsy vendor</DialogTitle>

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
                <Store className="size-5" />
              </span>
              <p className="relative mt-4 text-heading capitalize text-secondary-foreground">Apply to Sell on Handsy</p>
              <p className="relative mt-2 max-w-md text-gray-1-foreground leading-[170%]">
                Tell us about your craft and business — our vendor team will review your
                application and respond within 2–3 business days.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-7.5 lg:px-10 lg:py-8.75">
              <div className="grid sm:grid-cols-2 gap-6">
                <Label htmlFor="fullName" className="text-gray-1-foreground text-base w-full">
                  Full Name<span className="text-primary-foreground">*</span>
                  <Input type="text" name="fullName" id="fullName" required placeholder="Your name" className={fieldClass} />
                </Label>
                <Label htmlFor="brandName" className="text-gray-1-foreground text-base w-full">
                  Brand / Studio Name<span className="text-primary-foreground">*</span>
                  <Input type="text" name="brandName" id="brandName" required placeholder="Your brand or studio" className={fieldClass} />
                </Label>
                <Label htmlFor="email" className="text-gray-1-foreground text-base w-full">
                  Email<span className="text-primary-foreground">*</span>
                  <Input type="email" name="email" id="email" required placeholder="you@example.com" className={fieldClass} />
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
                  Product / Category<span className="text-primary-foreground">*</span>
                  <Select name="category" required>
                    <SelectTrigger id="category" className={selectTriggerClass}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="py-[14px] bg-background">
                      {categories.map((label) => (
                        <SelectItem key={label} value={label} className="cursor-pointer">
                          {label}
                        </SelectItem>
                      ))}
                      <SelectItem value="Multiple / Not sure yet" className="cursor-pointer">
                        Multiple / Not sure yet
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Label>
                <Label htmlFor="experience" className="text-gray-1-foreground text-base w-full sm:col-span-2">
                  Selling Experience<span className="text-primary-foreground">*</span>
                  <Select name="experience" required>
                    <SelectTrigger id="experience" className={selectTriggerClass}>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent className="py-[14px] bg-background">
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level} className="cursor-pointer">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Label>
                <Label htmlFor="message" className="text-gray-1-foreground text-base w-full sm:col-span-2">
                  Tell Us About Your Craft
                  <Textarea
                    name="message"
                    id="message"
                    placeholder="Products you make, materials, production capacity..."
                    className="mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground min-h-[110px]"
                  />
                </Label>
              </div>

              {!isSuccess && error && (
                <p className="mt-5 text-sm text-red-500">{error.message}</p>
              )}

              <div className="mt-7.5 flex items-center gap-4">
                <Button type="submit" disabled={isSubmitting} className="min-w-[180px]">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
                <p className="flex items-center gap-1.5 text-xs text-gray-3-foreground">
                  <Globe2 className="size-3.5" /> Trusted by artisans in 30+ countries
                </p>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VendorEnquiryModal;
