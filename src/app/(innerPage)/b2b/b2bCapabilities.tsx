"use client";

import { motion } from "framer-motion";
import { Boxes, Wand2, Factory, Globe2, Percent, ShieldCheck, Ruler } from "lucide-react";

const capabilities = [
  {
    icon: Boxes,
    title: "Bulk & Wholesale Purchasing",
    description: "Order by the container or the pallet with volume-based pricing tiers and flexible MOQs starting at 50 units.",
  },
  {
    icon: Wand2,
    title: "Custom Orders",
    description: "Bring your own designs or adapt ours — custom sizing, joinery, and wood species to fit your catalog.",
  },
  {
    icon: Factory,
    title: "Vendor & Manufacturer Sourcing",
    description: "Direct access to our network of verified artisan workshops for private label and OEM production.",
  },
  {
    icon: Globe2,
    title: "International & Domestic Supply",
    description: "Export documentation, customs support, and domestic distribution handled end to end.",
  },
  {
    icon: Percent,
    title: "Custom Pricing for Large Quantities",
    description: "Transparent, tiered quotes that improve as order volume and partnership length grow.",
  },
  {
    icon: Ruler,
    title: "Product Customization",
    description: "Finishes, upholstery, engravings, and packaging adapted to your brand and market.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Sourcing & Quality",
    description: "Every batch is quality-checked against agreed specs before it leaves our workshops.",
  },
];

const B2bCapabilities = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="Our B2B capabilities">
      <div className="container">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            What We Offer <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">B2B capabilities built around your business</h5>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, description }, index) => (
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
      </div>
    </section>
  );
};

export default B2bCapabilities;
