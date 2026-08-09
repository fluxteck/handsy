"use client";

import { motion } from "framer-motion";
import { Warehouse, Store, PenTool, Hotel, Building2, Ship } from "lucide-react";

const audiences = [
  {
    icon: Warehouse,
    title: "Wholesalers & Bulk Buyers",
    description: "Volume pricing and priority production slots for large recurring orders.",
  },
  {
    icon: Store,
    title: "Retailers & Resellers",
    description: "Curated, ready-to-sell collections with reliable restock timelines.",
  },
  {
    icon: PenTool,
    title: "Interior Designers & Decorators",
    description: "Bespoke finishes, dimensions, and materials tailored to your project brief.",
  },
  {
    icon: Hotel,
    title: "Hotels, Restaurants & Hospitality",
    description: "Durable, contract-grade furniture and décor for high-traffic spaces.",
  },
  {
    icon: Building2,
    title: "Corporate Buyers",
    description: "Consistent, on-brand furnishing for offices, gifting, and multi-site rollouts.",
  },
  {
    icon: Ship,
    title: "International Importers & Distributors",
    description: "Export-ready packaging, documentation, and freight support worldwide.",
  },
];

const B2bAudiences = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Who we serve">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          Who We Serve <span className="h-px w-8 bg-gray-2" aria-hidden />
        </p>
        <h5 className="mt-3">Built for every kind of business partner</h5>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {audiences.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
            className="group rounded-2xl border border-gray-2 bg-background p-6 transition-all duration-500 hover:shadow-3xl hover:border-primary/30"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-home-bg-1 text-secondary-foreground transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
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

export default B2bAudiences;
