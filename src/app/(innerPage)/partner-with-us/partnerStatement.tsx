"use client";

import { motion } from "framer-motion";
import { Layers, Ruler, ShieldCheck, Truck } from "lucide-react";

const promises = [
  { icon: Layers, label: "Built for Projects of Every Size" },
  { icon: Truck, label: "Delivered to Your Site, Anywhere" },
  { icon: ShieldCheck, label: "Quality Checked Before Dispatch" },
  { icon: Ruler, label: "Made to Your Specification" },
];

const PartnerStatement = () => {
  return (
    <section className="bg-primary text-white" aria-label="What Handsy Market delivers">
      <div className="container py-15 lg:py-25">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center text-xl leading-[150%] sm:text-2xl lg:text-3xl"
        >
          From a single statement lamp to a full hotel fit-out, Handsy Market is a one stop online
          store for{" "}
          <span className="font-display italic">handcrafted décor, lighting and furniture</span>.
        </motion.p>

        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {promises.map(({ icon: Icon, label }, index) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
              className="flex items-center gap-4 bg-primary px-6 py-6 lg:flex-col lg:items-start lg:px-7 lg:py-8"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white">
                <Icon className="size-5" />
              </span>
              <span className="text-base font-medium leading-snug lg:text-lg">{label}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PartnerStatement;
