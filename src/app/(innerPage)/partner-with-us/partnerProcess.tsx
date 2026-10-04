"use client";

import { motion } from "framer-motion";
import PartnerJoinModal from "./partnerJoinModal";

const steps = [
  {
    number: "01",
    title: "Apply",
    description: "Tell us about your firm and share a portfolio or website. It takes about two minutes.",
  },
  {
    number: "02",
    title: "Get Verified",
    description: "Our team reviews your details and confirms your membership.",
  },
  {
    number: "03",
    title: "Start Sourcing with Member Benefits",
    description: "Enjoy trade pricing, rewards and dedicated support on every project.",
  },
];

const PartnerProcess = () => {
  return (
    <section id="join" className="container pb-15 lg:pb-25 scroll-mt-24" aria-label="How to partner with us">
      <div className="relative overflow-hidden rounded-3xl bg-home-bg-3 px-6 py-12 lg:px-12 lg:py-16">
        <div
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
          aria-hidden
        />

        <div className="relative max-w-2xl">
          <h3 className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Our Process <span className="h-px w-8 bg-gray-2" aria-hidden />
          </h3>
          <h2 className="mt-3 text-heading text-secondary-foreground font-normal">
            Partner <span className="font-display italic">with us</span>
          </h2>
        </div>

        <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {steps.map((step, index) => (
            <motion.li
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              className="relative border-l border-gray-2 pl-5 md:border-l-0 md:border-t md:pl-0 md:pt-6"
            >
              <span
                className="absolute -left-[5px] top-1 size-2.5 rounded-full bg-primary md:-top-[5px] md:left-0"
                aria-hidden
              />
              <span className="font-display text-3xl italic text-gray-3-foreground" aria-hidden>{step.number}</span>
              <p className="mt-3 text-lg font-medium text-secondary-foreground">{step.title}</p>
              <p className="mt-2 text-gray-1-foreground leading-[170%]">{step.description}</p>
            </motion.li>
          ))}
        </ol>

        <div className="relative mt-10 lg:mt-12">
          <PartnerJoinModal />
        </div>
      </div>
    </section>
  );
};

export default PartnerProcess;
