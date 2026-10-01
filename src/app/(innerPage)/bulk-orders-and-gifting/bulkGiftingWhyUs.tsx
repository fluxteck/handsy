"use client";

import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";

const reasons = [
  "Every piece handcrafted by verified Indian artisans — never mass-produced",
  "Each batch quality-checked against agreed specifications before it ships",
  "Transparent, tiered pricing that improves with your order volume",
  "Personalisation, engraving, and branded packaging on request",
  "Export documentation and freight handled for international orders",
  "A single point of contact from first quote to final delivery",
];

// Figures already published elsewhere on the site (B2B, About, and Vendor pages).
const stats = [
  { value: "500+", label: "Business partners" },
  { value: "30+", label: "Countries served" },
  { value: "350+", label: "Verified artisans" },
  { value: "1,200+", label: "Artisan-made SKUs" },
];

const BulkGiftingWhyUs = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Why choose Handsy Market">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div>
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Why Handsy Market <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Gifting you can put your name to</h5>

          <ul className="mt-7.5 flex flex-col gap-4">
            {reasons.map((reason, index) => (
              <motion.li
                key={reason}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
                className="flex items-start gap-3 text-gray-1-foreground leading-[170%]"
              >
                <CircleCheck className="mt-1 size-5 shrink-0 text-primary" />
                {reason}
              </motion.li>
            ))}
          </ul>
        </div>

        <dl className="grid grid-cols-2 gap-5">
          {stats.map(({ value, label }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
              className="rounded-2xl bg-home-bg-4 px-6 py-8 text-center"
            >
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-4xl italic text-secondary-foreground lg:text-5xl">{value}</dd>
              <p className="mt-2 text-sm text-gray-1-foreground">{label}</p>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default BulkGiftingWhyUs;
