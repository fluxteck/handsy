"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3, Palette, ShieldCheck } from "lucide-react";
import { Call, Email, Location } from "@/lib/icon";
import B2bEnquiryModal from "../b2b/b2bEnquiryModal";
import { ENQUIRY_SUBJECT } from "./constants";

const trustPoints = [
  { icon: Clock3, label: "Response within 1–2 business days" },
  { icon: ShieldCheck, label: "No obligation, tailored pricing" },
  { icon: Palette, label: "Personalisation on request" },
];

const BulkGiftingEnquiry = ({ categories }: { categories: string[] }) => {
  return (
    <section id="enquiry" className="container lg:py-25 py-15 scroll-mt-24" aria-label="Request a bulk or gifting quote">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-home-bg-3 px-6 py-14 text-center lg:px-16 lg:py-18"
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-2xl">
          <p className="flex items-center justify-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Let&apos;s Create Something Together <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Start your bulk or gifting order</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Tell us about your occasion, quantity, and ideas — our team will come back with product
            suggestions, personalisation options, and tiered pricing.
          </p>

          <div className="mt-7.5 flex justify-center">
            <B2bEnquiryModal
              categories={categories}
              subject={ENQUIRY_SUBJECT}
              companyRequired={false}
              className="lg:px-10"
            />
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-gray-1-foreground">
                <Icon className="size-4 text-secondary-foreground" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-gray-2 pt-7.5">
            <Link href="mailto:info@handsymarket.com" className="flex items-center gap-2 text-gray-1-foreground transition-all duration-500 hover:text-secondary-foreground">
              <Email className="size-4" /> info@handsymarket.com
            </Link>
            <Link href="tel:+919205028025" className="flex items-center gap-2 text-gray-1-foreground transition-all duration-500 hover:text-secondary-foreground">
              <Call className="size-4" /> +91 9205028025
            </Link>
            <span className="flex items-center gap-2 text-gray-1-foreground">
              <Location className="size-4" /> India | Serving Customers Worldwide
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default BulkGiftingEnquiry;
