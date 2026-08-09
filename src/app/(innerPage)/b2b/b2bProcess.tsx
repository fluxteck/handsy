"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Submit Your Inquiry",
    description: "Tell us your product interest, order volume, and target market via our quote form.",
  },
  {
    number: "02",
    title: "Consultation & Quote",
    description: "Our B2B team reviews your requirements and shares tiered pricing within 1–2 business days.",
  },
  {
    number: "03",
    title: "Sample & Approval",
    description: "Request samples or spec sheets to confirm quality, finish, and dimensions before production.",
  },
  {
    number: "04",
    title: "Production & Quality Check",
    description: "Your order is produced in our partner workshops and inspected against agreed specifications.",
  },
  {
    number: "05",
    title: "Shipping & Logistics",
    description: "We coordinate export packaging, documentation, and freight to your warehouse or store.",
  },
  {
    number: "06",
    title: "Ongoing Partnership",
    description: "A dedicated account manager supports reorders, catalog updates, and seasonal planning.",
  },
];

const B2bProcess = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="How B2B ordering works">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          Our Process <span className="h-px w-8 bg-gray-2" aria-hidden />
        </p>
        <h5 className="mt-3">How B2B ordering works</h5>
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

export default B2bProcess;
