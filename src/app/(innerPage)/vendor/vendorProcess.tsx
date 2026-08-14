"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Apply to Sell",
    description: "Submit your vendor application with details about your craft and products.",
  },
  {
    number: "02",
    title: "Verification & Approval",
    description: "Our team reviews your application and samples, typically within 2–3 business days.",
  },
  {
    number: "03",
    title: "Set Up Your Storefront",
    description: "Build your branded shop, upload listings, and set your pricing and policies.",
  },
  {
    number: "04",
    title: "List & Launch",
    description: "Publish your first products and go live on the Handsy marketplace.",
  },
  {
    number: "05",
    title: "Sell & Fulfill Orders",
    description: "Receive orders, manage inventory, and ship to customers nationwide and abroad.",
  },
  {
    number: "06",
    title: "Get Paid",
    description: "Receive secure, scheduled payouts directly to your bank account.",
  },
];

const VendorProcess = () => {
  return (
    <section id="how-it-works" className="container lg:py-25 py-15" aria-label="How selling on Handsy works">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          How It Works <span className="h-px w-8 bg-gray-2" aria-hidden />
        </p>
        <h5 className="mt-3">From application to your first sale</h5>
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
    </section>
  );
};

export default VendorProcess;
