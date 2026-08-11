"use client";

import { motion } from "framer-motion";
import { Wand2, Leaf, Globe2, Boxes, ShieldCheck, Handshake } from "lucide-react";

const values = [
  {
    icon: Wand2,
    title: "Authentic Craftsmanship",
    description: "Every item is shaped, carved, or finished by hand by artisans who take pride in their trade — never a mass-produced imitation.",
  },
  {
    icon: Leaf,
    title: "Responsible Sourcing",
    description: "We favor sustainably harvested wood and natural materials, and partner with vendors who share our respect for the craft and the environment.",
  },
  {
    icon: Globe2,
    title: "National & International Reach",
    description: "From local delivery to export shipments across 30+ countries, we make it simple to bring handcrafted pieces home wherever you are.",
  },
  {
    icon: Boxes,
    title: "Retail & Wholesale, Both Welcome",
    description: "Buying one accent piece or stocking a showroom — our catalog and pricing scale from single orders to bulk wholesale.",
  },
  {
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    description: "Every product is checked against our quality standards before it ships, backed by transparent policies and responsive support.",
  },
  {
    icon: Handshake,
    title: "A Growing Vendor Community",
    description: "We partner with independent workshops and small manufacturers, helping skilled artisans reach a global marketplace.",
  },
];

const AboutValues = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="What Handsy Market stands for">
      <div className="container">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Our Values <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">What Handsy Market stands for</h5>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, description }, index) => (
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

export default AboutValues;
