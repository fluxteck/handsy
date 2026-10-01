"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Headset, Palette, TrendingDown } from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    title: "Tiered Volume Pricing",
    description: "Pricing that improves with your order size, quoted for the exact quantity you need.",
  },
  {
    icon: Palette,
    title: "Customisation & Branding",
    description: "Engravings, finishes, and branded packaging adapted to your brand or occasion.",
  },
  {
    icon: BadgeCheck,
    title: "Artisan-Made Quality",
    description: "Handcrafted by verified artisans and quality-checked against agreed specs before dispatch.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description: "One point of contact from quote to delivery, with replies within 1–2 business days.",
  },
];

const BulkGiftingBenefits = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Benefits of ordering in bulk">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          Why Order in Bulk <span className="h-px w-8 bg-gray-2" aria-hidden />
        </p>
        <h5 className="mt-3">Everything you need for gifting at scale</h5>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
            className="group/card h-full rounded-2xl border border-gray-2 bg-background p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-3xl"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-home-bg-1 text-secondary-foreground transition-colors duration-500 group-hover/card:bg-primary group-hover/card:text-white">
              <Icon className="size-5" />
            </span>
            <p className="mt-5 text-lg font-medium text-secondary-foreground">{title}</p>
            <p className="mt-2 text-gray-1-foreground leading-[170%]">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BulkGiftingBenefits;
