"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { Call, Email, Location } from "@/lib/icon";

const B2bQuoteForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="quote" className="container lg:py-25 py-15" aria-label="Request a wholesale quote">
      <div className="max-w-2xl mx-auto text-center">
        <p className="flex items-center justify-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          Get Started <span className="h-px w-8 bg-gray-2" aria-hidden />
        </p>
        <h5 className="mt-3">Request a bulk quote</h5>
        <p className="mt-4 text-gray-1-foreground leading-[170%]">
          Share a few details about your business and order requirements — our B2B team will
          respond with pricing and next steps within 1–2 business days.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-[auto_28%] md:grid-cols-[auto_35%] items-start lg:gap-15 gap-10">
        {submitted ? (
          <div className="rounded-2xl border border-gray-2 bg-home-bg-1 p-10 text-center">
            <p className="text-xl font-medium text-secondary-foreground">Thank you for reaching out</p>
            <p className="mt-3 text-gray-1-foreground leading-[170%]">
              Your inquiry has been received. A member of our B2B team will contact you shortly
              with a tailored quote.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <b className="mb-10 text-secondary-foreground text-xl font-medium block">Business Inquiry</b>
            <div className="flex md:flex-row flex-col gap-7.5 mb-7.5">
              <Label htmlFor="company" className="text-gray-1-foreground text-base w-full">
                Company Name<span className="text-primary-foreground">*</span>
                <Input type="text" name="company" id="company" required className="mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground" />
              </Label>
              <Label htmlFor="contactName" className="text-gray-1-foreground text-base w-full">
                Contact Person<span className="text-primary-foreground">*</span>
                <Input type="text" name="contactName" id="contactName" required className="mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground" />
              </Label>
            </div>
            <div className="flex md:flex-row flex-col gap-7.5 mb-7.5">
              <Label htmlFor="email" className="text-gray-1-foreground text-base w-full">
                Business Email<span className="text-primary-foreground">*</span>
                <Input type="email" name="email" id="email" required className="mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground" />
              </Label>
              <Label htmlFor="phone" className="text-gray-1-foreground text-base w-full">
                Phone Number
                <Input type="tel" name="phone" id="phone" className="mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground" />
              </Label>
            </div>
            <div className="flex md:flex-row flex-col gap-7.5 mb-7.5">
              <Label htmlFor="buyerType" className="text-gray-1-foreground text-base w-full">
                Business Type
                <Select name="buyerType">
                  <SelectTrigger id="buyerType" className="h-12.5 py-2.5 border-[1.5px] border-[#999796] text-base text-gray-1-foreground mt-2.5 w-full">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="py-[14px] bg-background">
                    <SelectItem value="wholesaler" className="cursor-pointer">Wholesaler / Bulk Buyer</SelectItem>
                    <SelectItem value="retailer" className="cursor-pointer">Retailer / Reseller</SelectItem>
                    <SelectItem value="designer" className="cursor-pointer">Interior Designer / Decorator</SelectItem>
                    <SelectItem value="hospitality" className="cursor-pointer">Hotel / Restaurant / Hospitality</SelectItem>
                    <SelectItem value="corporate" className="cursor-pointer">Corporate Buyer</SelectItem>
                    <SelectItem value="importer" className="cursor-pointer">International Importer / Distributor</SelectItem>
                  </SelectContent>
                </Select>
              </Label>
              <Label htmlFor="quantity" className="text-gray-1-foreground text-base w-full">
                Estimated Order Quantity
                <Input type="text" name="quantity" id="quantity" placeholder="e.g. 200 units" className="mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground" />
              </Label>
            </div>
            <Label htmlFor="message" className="text-gray-1-foreground text-base w-full">
              Tell us about your requirements
              <Textarea name="message" id="message" placeholder="Products of interest, customization needs, target market, timeline..." className="mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground min-h-[140px]" />
            </Label>
            <Button className="mt-10 lg:px-12.5" type="submit">
              Submit Inquiry
            </Button>
          </form>
        )}

        <div className="bg-home-bg-1 lg:p-10 p-7 flex flex-col gap-7.5 rounded-lg">
          <div className="flex gap-5">
            <div className="shrink-0 lg:w-15 lg:h-15 w-12 h-12 flex justify-center items-center border border-muted text-gray-1-foreground rounded-full">
              <Location className="lg:size-[34px] size-7" />
            </div>
            <div>
              <p className="text-secondary-foreground text-lg font-medium leading-[150%] relative after:absolute after:left-0 after:bottom-0 after:w-14 after:h-px after:bg-primary">Workshop & Export Office</p>
              <p className="text-gray-1-foreground leading-[150%] mt-3">Jodhpur, Rajasthan, India</p>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="shrink-0 lg:w-15 lg:h-15 w-12 h-12 flex justify-center items-center border border-muted text-gray-1-foreground rounded-full">
              <Email className="lg:size-[34px] size-7" />
            </div>
            <div>
              <p className="text-secondary-foreground text-lg font-medium leading-[150%] relative after:absolute after:left-0 after:bottom-0 after:w-14 after:h-px after:bg-primary">B2B Sales Team</p>
              <Link href={"mailto:b2b@handsymarket.com"} className="text-gray-1-foreground leading-[150%] mt-3 inline-block hover:text-secondary-foreground transition-all duration-500">b2b@handsymarket.com</Link>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="shrink-0 lg:w-15 lg:h-15 w-12 h-12 flex justify-center items-center border border-muted text-gray-1-foreground rounded-full">
              <Call className="lg:size-[34px] size-7" />
            </div>
            <div>
              <p className="text-secondary-foreground text-lg font-medium leading-[150%] relative after:absolute after:left-0 after:bottom-0 after:w-14 after:h-px after:bg-primary">Call Our Team</p>
              <Link href={"tel:+912912345678"} className="text-gray-1-foreground leading-[150%] mt-3 inline-block hover:text-secondary-foreground transition-all duration-500">+91 291 234 5678</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2bQuoteForm;
