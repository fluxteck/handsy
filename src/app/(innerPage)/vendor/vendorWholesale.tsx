"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Boxes, Percent, Building2, Wand2 } from "lucide-react";

const wholesaleOpportunities = [
  {
    icon: Boxes,
    title: "Bulk Order Management",
    description: "Handle large-volume orders from retailers and distributors with dedicated tools.",
  },
  {
    icon: Percent,
    title: "Wholesale Pricing Tiers",
    description: "Set flexible, tiered pricing for buyers ordering in bulk quantities.",
  },
  {
    icon: Building2,
    title: "B2B Buyer Network",
    description: "Get discovered by retailers, hospitality buyers, and corporate clients sourcing through Handsy for Business.",
  },
  {
    icon: Wand2,
    title: "Custom & Private Label",
    description: "Offer custom specifications and private-label production for wholesale partners.",
  },
];

const VendorWholesale = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Bulk and wholesale selling opportunities">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Bulk & Wholesale <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Reach bulk and wholesale buyers too</h5>
        </div>
        <Link href="/b2b" className="text-secondary-foreground font-medium multiline-hover">
          Explore Handsy for Business
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {wholesaleOpportunities.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
            className="rounded-2xl bg-background p-7 shadow-3xl"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-white">
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

export default VendorWholesale;
