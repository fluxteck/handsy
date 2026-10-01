"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import B2bEnquiryModal from "../b2b/b2bEnquiryModal";
import { ENQUIRY_SUBJECT } from "./constants";

const stats = [
  { value: "500+", label: "Business partners" },
  { value: "30+", label: "Countries served" },
  { value: "350+", label: "Verified artisans" },
];

const BulkGiftingHero = ({ categories }: { categories: string[] }) => {
  return (
    <section className="pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5" aria-label="Bulk orders and gifting">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-home-bg-4 px-6 py-12 lg:px-12 lg:py-16">
          <div
            className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
            aria-hidden
          />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="order-2 lg:order-1"
            >
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
                Bulk Orders &amp; Gifting <span className="h-px w-8 bg-gray-2" aria-hidden />
              </p>
              <h1 className="mt-3 text-heading capitalize text-secondary-foreground font-normal">
                Handcrafted gifts, <span className="font-display italic">made for every occasion</span>
              </h1>
              <p className="mt-4 max-w-lg text-gray-1-foreground leading-[170%]">
                From corporate gifting and wedding favours to festive gifts — source artisan-made
                wooden pieces in bulk, personalised for your brand or celebration and delivered
                across India and worldwide.
              </p>
              <div className="mt-7.5 flex flex-wrap items-center gap-4">
                <B2bEnquiryModal categories={categories} subject={ENQUIRY_SUBJECT} companyRequired={false} />
                <Button asChild variant="outline">
                  <Link href="#occasions">Explore Gifting Ideas</Link>
                </Button>
              </div>

              <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-2xl font-medium text-secondary-foreground">{value}</dd>
                    <p className="mt-1 text-sm text-gray-3-foreground">{label}</p>
                  </div>
                ))}
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="relative order-1 lg:order-2"
            >
              <div className="group/image relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/home-1/gallery/img-3.webp"
                  alt="Handcrafted wooden décor styled for gifting"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
                />
              </div>

              <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-gray-2 bg-background px-5 py-4 shadow-3xl">
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <span className="absolute inset-0 rounded-full bg-primary/40 animate-spring-one" aria-hidden />
                  <Gift className="relative size-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold leading-none text-secondary-foreground">Engraving &amp; branding</p>
                  <p className="mt-1 text-xs text-gray-1-foreground">Personalised for your occasion</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BulkGiftingHero;
