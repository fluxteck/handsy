"use client";

import { motion } from "framer-motion";
import { BadgePercent, Gift, Headset } from "lucide-react";

const perks = [
  { icon: BadgePercent, title: "Exclusive Trade Pricing" },
  { icon: Gift, title: "Rewards, Offers & Gifts" },
  { icon: Headset, title: "Dedicated Support" },
];

const PartnerPerks = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="Member perks and offers">
      <div className="container">
        <div className="max-w-2xl">
          <h3 className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            What We Offer <span className="h-px w-8 bg-gray-2" aria-hidden />
          </h3>
          <h2 className="mt-3 text-heading text-secondary-foreground font-normal">
            Member Perks &amp; <span className="font-display italic">Offers</span>
          </h2>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Join free and get rewards and support built around your projects.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {perks.map(({ icon: Icon, title }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-2xl bg-background p-7 shadow-3xl lg:p-8"
            >
              <div
                className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-gradient-radial from-primary/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-white">
                  <Icon className="size-5" />
                </span>
                <span className="font-display text-3xl italic text-gray-2" aria-hidden>
                  0{index + 1}
                </span>
              </div>
              <h3 className="relative mt-8 text-xl font-medium text-secondary-foreground lg:text-2xl">{title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerPerks;
