"use client";

import { motion } from "framer-motion";
import { Factory, Globe2, Handshake, Percent, ShieldCheck, Wand2 } from "lucide-react";

const capabilities = [
  {
    icon: Factory,
    title: "State-of-the-Art Manufacturing",
    description: "Our partner workshops combine traditional woodcraft with modern production capacity, so every order meets consistent, exacting quality at scale.",
  },
  {
    icon: Wand2,
    title: "Full Design Customization",
    description: "Sizing, joinery, wood species, finishes, and upholstery adapted to your project specifications, mood boards, and brand guidelines.",
  },
  {
    icon: ShieldCheck,
    title: "Rigorous Quality Assurance",
    description: "Every batch is inspected against agreed specifications before it leaves our workshops, so what you approve is what arrives on site.",
  },
  {
    icon: Percent,
    title: "Competitive B2B Pricing",
    description: "Transparent, tiered pricing that improves with project scale — with no unnecessary middlemen between our workshops and your project.",
  },
  {
    icon: Handshake,
    title: "Trusted Partner Network",
    description: "Access our curated network of verified artisan workshops and collaborating brands for private-label and multi-category sourcing.",
  },
  {
    icon: Globe2,
    title: "Global Project Logistics",
    description: "Export documentation, freight coordination, and on-time delivery support for projects across 30+ countries.",
  },
];

const InteriorSolutionsCapabilities = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="Product capabilities, quality, and pricing">
      <div className="container">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            What We Offer <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h2 className="mt-3 text-heading capitalize text-secondary-foreground font-normal">
            Capabilities built around your project
          </h2>
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

export default InteriorSolutionsCapabilities;
