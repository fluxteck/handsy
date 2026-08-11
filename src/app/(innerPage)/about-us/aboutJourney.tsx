"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Sourcing",
    description: "We select responsibly harvested wood and partner with vetted artisan workshops across our vendor network.",
  },
  {
    number: "02",
    title: "Handcrafting",
    description: "Each piece is shaped, joined, and finished by hand, keeping traditional techniques alive in every detail.",
  },
  {
    number: "03",
    title: "Quality Check",
    description: "Every item is inspected against our quality standards for finish, durability, and craftsmanship before packing.",
  },
  {
    number: "04",
    title: "Packing & Logistics",
    description: "Pieces are carefully packaged for safe transit, whether heading across town or across the ocean.",
  },
  {
    number: "05",
    title: "Delivery",
    description: "We deliver to individual homes and manage bulk shipments for retailers and business partners alike.",
  },
  {
    number: "06",
    title: "Ongoing Support",
    description: "Our team stays available after delivery for care guidance, reorders, and wholesale account support.",
  },
];

const AboutJourney = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="How your order reaches you">
      <div className="container">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Our Process <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">From workshop to your door</h5>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              className="relative pl-4 border-l border-gray-2"
            >
              <span className="text-3xl font-display italic text-gray-2">{step.number}</span>
              <p className="mt-3 text-lg font-medium text-secondary-foreground">{step.title}</p>
              <p className="mt-2 text-gray-1-foreground leading-[170%]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutJourney;
