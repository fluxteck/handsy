"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const points = [
  "Solid wood and natural materials, sourced responsibly",
  "Traditional joinery and finishing techniques, refined over generations",
  "Small-batch production that protects quality and detail",
  "Every order checked by hand before it leaves the workshop",
];

const AboutCraftsmanship = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Our craftsmanship">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl order-2 lg:order-1"
        >
          <Image
            src="/images/about/img-3.webp"
            alt="Artisan finishing a handcrafted wooden home decor piece"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-1 lg:order-2"
        >
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Our Craft <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">From raw timber to finished heirloom</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Behind every Handsy Market piece is a craftsperson who has spent years mastering
            their trade — turning, carving, joining, and finishing solid wood into furniture and
            décor meant to be used, not just displayed. We work directly with independent
            workshops, not factories, so the character of real handwork stays in every grain and
            joint.
          </p>

          <ul className="mt-7.5 flex flex-col gap-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary-foreground" />
                <span className="text-gray-1-foreground leading-[170%]">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutCraftsmanship;
