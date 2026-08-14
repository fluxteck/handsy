"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const reasons = [
  "A curated marketplace audience actively seeking quality handmade goods",
  "Transparent, competitive commission rates — no hidden fees",
  "Secure, on-time payouts you can rely on",
  "Marketing exposure through featured collections and seasonal campaigns",
  "Buyer verification and fraud protection on every order",
  "Room to grow from a single studio to a national and global brand",
];

const VendorWhySell = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Why sell on Handsy">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl order-2 lg:order-1"
        >
          <Image
            src="/images/about/img-1.webp"
            alt="Artisan crafting handmade goods for their Handsy vendor shop"
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
            Why Handsy Market <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Why artisans choose to sell on Handsy</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            We built Handsy for makers, not mass production. Every seller is part of a marketplace
            that values craftsmanship, so your work reaches shoppers who are genuinely looking for it.
          </p>

          <ul className="mt-7.5 flex flex-col gap-4">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary-foreground" />
                <span className="text-gray-1-foreground leading-[170%]">{reason}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default VendorWhySell;
