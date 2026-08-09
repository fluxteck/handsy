"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const reasons = [
  "Direct-from-artisan sourcing with no unnecessary middlemen",
  "Consistent quality control across every production batch",
  "Flexible minimum order quantities for growing businesses",
  "Competitive, tiered pricing that scales with volume",
  "Established export logistics network across 30+ countries",
  "A dedicated account manager for every business partner",
];

const B2bWhyUs = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Why buy from us">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl order-2 lg:order-1"
        >
          <Image
            src="/images/about/img-3.webp"
            alt="Artisan finishing wooden home decor for a bulk order"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-1 lg:order-2"
        >
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Why Handsy Market <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Why businesses buy from us</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            We've spent years building relationships with skilled woodworking artisans so our
            partners don't have to. That means fewer sourcing risks, predictable lead times, and
            products your customers will trust.
          </p>

          <ul className="mt-7.5 flex flex-col gap-4">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary-foreground" />
                <span className="text-gray-1-foreground leading-[170%]">{reason}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default B2bWhyUs;
