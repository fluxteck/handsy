"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const options = [
  { title: "Engraving & branding", description: "Logos, names, or messages on selected pieces." },
  { title: "Finishes & sizes", description: "Wood finish and dimensions adapted to your brief." },
  { title: "Branded packaging", description: "Packaging tailored to your brand or occasion." },
  { title: "Sample before you commit", description: "Approve a sample before full production begins." },
];

const BulkGiftingCustomisation = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Customisation and personalisation">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group/image relative aspect-[4/3] w-full overflow-hidden rounded-3xl"
        >
          <Image
            src="/images/home-1/gallery/img-4.webp"
            alt="Close-up of hand-finished wooden joinery"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Customisation <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">
            Make every gift <span className="font-display italic">unmistakably yours</span>
          </h5>
          <p className="mt-4 max-w-lg text-gray-1-foreground leading-[170%]">
            Tell us what you have in mind. Our team works with our artisans to adapt pieces to your
            brand, theme, or celebration — and confirms every detail in your quote.
          </p>

          <ul className="mt-7.5 grid gap-5 sm:grid-cols-2">
            {options.map(({ title, description }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <div>
                  <p className="font-medium text-secondary-foreground">{title}</p>
                  <p className="mt-1 text-sm text-gray-1-foreground leading-[170%]">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default BulkGiftingCustomisation;
