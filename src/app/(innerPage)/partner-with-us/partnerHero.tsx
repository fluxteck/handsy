"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Globe2, Hammer, PencilRuler } from "lucide-react";
import B2bEnquiryModal from "../b2b/b2bEnquiryModal";
import PartnerJoinModal from "./partnerJoinModal";

const audiences = ["Interior Designers", "Architects", "Hospitality", "Builders"];

const highlights = [
  { icon: Hammer, label: "Indian Craftsmanship" },
  { icon: PencilRuler, label: "Custom Requirement" },
  { icon: Globe2, label: "Worldwide Delivery" },
];

/** The default button restyled as the outline variant, for the modal trigger
 *  (which takes classes rather than a variant). */
export const outlineCtaClass =
  "bg-transparent text-secondary-foreground border-primary shadow-none hover:bg-primary hover:text-white";

const PartnerHero = ({ categories = [] }: { categories?: string[] }) => {
  return (
    <section className="pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5" aria-label="Handsy Market Trade Programme">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-home-bg-2 px-6 py-10 lg:px-12 lg:py-14">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-gradient-radial from-primary/[0.06] to-transparent blur-2xl"
            aria-hidden
          />

          <h1 className="relative flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-gray-2 pb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-secondary-foreground lg:pb-8 lg:text-sm">
            {audiences.map((audience, index) => (
              <span key={audience} className="flex items-center gap-x-3">
                {index > 0 && <span className="text-gray-3-foreground" aria-hidden>·</span>}
                {audience}
              </span>
            ))}
          </h1>

          <div className="relative mt-8 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:order-1 order-2"
            >
              <h3 className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
                Handsy Market Trade Programme <span className="h-px w-8 bg-gray-2" aria-hidden />
              </h3>
              <h2 className="mt-3 text-heading text-secondary-foreground font-normal lg:text-[44px] lg:leading-[1.15]">
                Handcrafted Interiors, <span className="font-display italic">Sourced for Every Project</span>
              </h2>
              <p className="mt-4 max-w-lg text-gray-1-foreground leading-[170%]">
                Handsy Market brings skilled makers and design-led brands from across India into
                one place. As a trade member, you get exclusive pricing, samples for client
                approvals and one point of contact, from first brief to final delivery, in India
                and worldwide.
              </p>
              <div className="mt-7.5 flex flex-wrap items-center gap-4">
                <PartnerJoinModal />
                <B2bEnquiryModal
                  categories={categories}
                  label="Request for Bulk"
                  subject="Trade Programme bulk request"
                  className={outlineCtaClass}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="relative lg:order-2 order-1"
            >
              <div className="group/image relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/about/img-1.webp"
                  alt="Handcrafted wooden sideboard and pendant lamp in a bright living room"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
                />
                <ul className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-2 rounded-2xl border border-white/50 bg-background/80 p-3 backdrop-blur-md lg:inset-x-4 lg:bottom-4 lg:p-4">
                  {highlights.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex flex-col items-center gap-2 text-center">
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
                        <Icon className="size-4" />
                      </span>
                      <span className="text-xs font-medium leading-tight text-secondary-foreground sm:text-sm">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerHero;
