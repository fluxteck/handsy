"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const reachPoints = [
  "Sell to shoppers across the country with fast domestic fulfillment options",
  "Reach international buyers in 30+ countries with export-ready logistics support",
  "Multi-currency display so global shoppers see familiar local pricing",
  "Guided customs documentation and freight coordination for cross-border orders",
];

const VendorReach = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="National and international selling opportunities">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Sell Anywhere <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Grow from local shelves to global shipments</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Whether you&apos;re fulfilling orders in your own city or shipping across borders, Handsy
            gives you the reach and logistics support to sell wherever your customers are.
          </p>

          <ul className="mt-7.5 flex flex-col gap-4">
            {reachPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary-foreground" />
                <span className="text-gray-1-foreground leading-[170%]">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
        >
          <Image
            src="/images/about/about-two-img-1.webp"
            alt="Handcrafted products packaged for domestic and international shipping"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default VendorReach;
