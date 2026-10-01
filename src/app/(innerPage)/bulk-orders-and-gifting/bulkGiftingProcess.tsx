"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Share Your Requirements",
    description: "Tell us the occasion, quantity, products, and personalisation you have in mind.",
  },
  {
    number: "02",
    title: "Consultation & Quote",
    description: "Our team reviews your brief and replies with tiered pricing within 1–2 business days.",
  },
  {
    number: "03",
    title: "Sample & Approval",
    description: "Review a sample or spec sheet to confirm finish, size, and branding before production.",
  },
  {
    number: "04",
    title: "Crafting & Quality Check",
    description: "Artisans handcraft your order, and every batch is checked against the agreed specs.",
  },
  {
    number: "05",
    title: "Packing & Delivery",
    description: "Your order is packed and shipped to your door — anywhere in India or abroad.",
  },
];

const BulkGiftingProcess = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="How bulk ordering works">
      <div className="container">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            How It Works <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">From idea to delivery in five steps</h5>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              className="relative border-l border-gray-2 pl-4"
            >
              <span className="font-display text-3xl italic text-gray-2">{step.number}</span>
              <p className="mt-3 text-lg font-medium text-secondary-foreground">{step.title}</p>
              <p className="mt-2 text-gray-1-foreground leading-[170%]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BulkGiftingProcess;
