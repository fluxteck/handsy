"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Boxes, Clock3, ShieldCheck } from "lucide-react";
import { Call, Email, Location } from "@/lib/icon";
import B2bEnquiryModal from "./b2bEnquiryModal";

const trustPoints = [
  { icon: Clock3, label: "Response within 1–2 business days" },
  { icon: ShieldCheck, label: "No obligation, tailored pricing" },
  { icon: Boxes, label: "MOQs from 50 units" },
];

const B2bQuoteForm = () => {
  return (
    <section id="quote" className="container lg:py-25 py-15" aria-label="Request a wholesale quote">
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
          <h5 className="mt-3">Request a bulk quote</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Share a few details about your business and order requirements — our B2B team will
            respond with tiered pricing and next steps.
          </p>

          <div className="mt-7.5 flex justify-center">
            <B2bEnquiryModal className="lg:px-10" />
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
            <Link href="mailto:b2b@handsymarket.com" className="flex items-center gap-2 text-gray-1-foreground hover:text-secondary-foreground transition-all duration-500">
              <Email className="size-4" /> b2b@handsymarket.com
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

export default B2bQuoteForm;
