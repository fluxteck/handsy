"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Boxes, Clock3, ShieldCheck } from "lucide-react";
import { Call, Email, Location } from "@/lib/icon";
import VendorEnquiryModal from "./vendorEnquiryModal";

const trustPoints = [
  { icon: Clock3, label: "Response within 2–3 business days" },
  { icon: ShieldCheck, label: "No fees to apply" },
  { icon: Boxes, label: "Full control over your shop" },
];

const VendorOnboardingForm = ({ categories = [] }: { categories?: string[] }) => {
  return (
    <section id="apply" className="container lg:py-25 py-15" aria-label="Apply to become a vendor">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-home-bg-3 px-6 py-14 lg:px-16 lg:py-18 text-center"
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
          aria-hidden
        />

        <div className="relative max-w-2xl mx-auto">
          <p className="flex items-center justify-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Get Started <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Apply to become a vendor</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Share a few details about your craft and business — our vendor team will review your
            application and reach out with next steps.
          </p>

          <div className="mt-7.5 flex justify-center">
            <VendorEnquiryModal categories={categories} className="lg:px-10" />
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
            <Link href="mailto:vendors@handsymarket.com" className="flex items-center gap-2 text-gray-1-foreground hover:text-secondary-foreground transition-all duration-500">
              <Email className="size-4" /> vendors@handsymarket.com
            </Link>
            <Link href="tel:+912912345678" className="flex items-center gap-2 text-gray-1-foreground hover:text-secondary-foreground transition-all duration-500">
              <Call className="size-4" /> +91 291 234 5678
            </Link>
            <span className="flex items-center gap-2 text-gray-1-foreground">
              <Location className="size-4" /> Jodhpur, Rajasthan, India
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VendorOnboardingForm;
