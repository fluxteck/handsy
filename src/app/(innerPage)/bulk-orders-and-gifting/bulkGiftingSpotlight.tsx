"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@/lib/icon";

const spotlights = [
  {
    eyebrow: "Corporate Gifting",
    title: "Gifts that carry your brand",
    description:
      "Thoughtful, handcrafted pieces for clients, partners, and teams — branded with your logo and planned around your timeline.",
    points: ["Client & partner gifts", "Employee rewards & milestones", "Conference & event giveaways"],
    image: "/images/about/img-1.webp",
    alt: "Handcrafted wooden sideboard suited to corporate gifting",
    cta: "Plan corporate gifts",
  },
  {
    eyebrow: "Weddings & Events",
    title: "Keepsakes your guests will treasure",
    description:
      "Wedding favours, return gifts, and celebration keepsakes — with names or a message engraved on selected pieces.",
    points: ["Wedding favours & return gifts", "Anniversaries & milestone celebrations", "Festive & family gatherings"],
    image: "/images/home-1/gallery/img-2.webp",
    alt: "Handcrafted wooden dining set for celebrations",
    cta: "Plan event gifts",
  },
];

const BulkGiftingSpotlight = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Corporate, wedding, and event gifting">
      <div className="grid gap-6 lg:grid-cols-2">
        {spotlights.map(({ eyebrow, title, description, points, image, alt, cta }, index) => (
          <motion.article
            key={eyebrow}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            className="group/card flex flex-col overflow-hidden rounded-3xl bg-home-bg-3"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-7 lg:p-10">
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
                {eyebrow} <span className="h-px w-8 bg-gray-2" aria-hidden />
              </p>
              <p className="mt-3 text-2xl text-secondary-foreground lg:text-3xl">{title}</p>
              <p className="mt-3 text-gray-1-foreground leading-[170%]">{description}</p>
              <ul className="mt-5 flex flex-col gap-2">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-gray-1-foreground">
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="#enquiry"
                className="group/link mt-7 inline-flex w-fit items-center gap-2 font-medium text-secondary-foreground multiline-hover"
              >
                {cta}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default BulkGiftingSpotlight;
