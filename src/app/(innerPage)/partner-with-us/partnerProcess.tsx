"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Project Brief & Consultation",
    description: "Share your segment — design, build, or hospitality — along with scope, specifications, and timeline with our B2B team.",
  },
  {
    number: "02",
    title: "Concept & Sampling",
    description: "We propose materials, finishes, and dimensions, with physical or digital samples available for approval.",
  },
  {
    number: "03",
    title: "Custom Quote & Pricing",
    description: "Receive transparent, tiered B2B pricing based on project scale, customization, and specification.",
  },
  {
    number: "04",
    title: "Manufacturing & Quality Check",
    description: "Your order moves into production across our partner workshops, with quality checks at every stage.",
  },
  {
    number: "05",
    title: "Logistics & Delivery",
    description: "We coordinate packaging, freight, and delivery scheduling aligned to your project or handover timeline.",
  },
  {
    number: "06",
    title: "Ongoing Collaboration",
    description: "A dedicated account manager supports reorders, future phases, and portfolio-wide rollouts.",
  },
];

const InteriorSolutionsProcess = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="How our B2B collaboration works">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          Our Process <span className="h-px w-8 bg-gray-2" aria-hidden />
        </p>
        <h2 className="mt-3 text-heading capitalize text-secondary-foreground font-normal">
          How our collaboration works
        </h2>
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

export default InteriorSolutionsProcess;
