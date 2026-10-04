"use client";

import { motion } from "framer-motion";
import { FileText, Globe2, Handshake, Ruler, ShieldCheck } from "lucide-react";

const reasons = [
  { icon: Handshake, label: "Trusted Indian Makers" },
  { icon: Globe2, label: "Worldwide Project Delivery" },
  { icon: FileText, label: "Transparent Specifications" },
  { icon: ShieldCheck, label: "Quality Checked" },
  { icon: Ruler, label: "Made to Your Specification" },
];

const PartnerWhyUs = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Why source with Handsy Market">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="flex items-center justify-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          <span className="h-px w-8 bg-gray-2" aria-hidden /> Why Choose Us <span className="h-px w-8 bg-gray-2" aria-hidden />
        </h3>
        <h2 className="mt-3 text-heading text-secondary-foreground font-normal">
          Why Source with <span className="font-display italic">Handsy Market</span>
        </h2>
      </div>

      {/* Flex-wrap rather than a fixed grid so the odd fifth tile centres on
          narrower rows instead of sitting alone at the left edge. */}
      <ul className="mt-10 flex flex-wrap justify-center gap-4 lg:mt-12 lg:gap-5">
        {reasons.map(({ icon: Icon, label }, index) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
            className="group flex w-[calc(50%-0.5rem)] flex-col items-center gap-4 rounded-2xl border border-gray-2 bg-background px-4 py-7 text-center transition-all duration-500 hover:border-primary/30 hover:shadow-3xl md:w-[calc(33.333%-0.667rem)] lg:w-[calc(20%-1rem)]"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-home-bg-1 text-secondary-foreground transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
              <Icon className="size-5" />
            </span>
            <span className="text-base font-medium leading-snug text-secondary-foreground lg:text-lg">{label}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default PartnerWhyUs;
