"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import PartnerSlider from "@/components/sections/partnerSlider";
import type { partnerType } from "@/db/partnerData";

const stats = [
  { end: 500, suffix: "+", label: "Trusted partners & collaborating brands" },
  { end: 30, suffix: "+", label: "Countries delivered to" },
  { end: 1200, suffix: "+", label: "Handcrafted SKUs in production" },
  { end: 98, suffix: "%", label: "On-time project delivery" },
];

const InteriorSolutionsPositioning = ({ partners }: { partners: partnerType[] }) => {
  return (
    <section className="bg-primary text-white" aria-label="Our positioning">
      <div className="container py-15 lg:py-25">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center text-xl leading-[150%] sm:text-2xl lg:text-3xl"
        >
          Handsy Market is a one-stop provider of handcrafted interior and home decor solutions.
          We bring together trusted partners, collaborating brands, and our{" "}
          <span className="font-display italic">state-of-the-art manufacturing capabilities</span>{" "}
          to deliver high-quality interior solutions at competitive B2B pricing.
        </motion.p>

        <dl className="mt-12 lg:mt-16 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map(({ end, suffix, label }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
              className="text-center"
            >
              <dt className="sr-only">{label}</dt>
              <dd className="text-3xl lg:text-4xl font-medium">
                <CountUp end={end} suffix={suffix} duration={2.2} enableScrollSpy scrollSpyOnce />
              </dd>
              <p className="mt-2 text-sm text-white/60">{label}</p>
            </motion.div>
          ))}
        </dl>

        <div className="mt-12 lg:mt-16 border-t border-white/10 pt-10 lg:pt-12">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            Trusted Partners &amp; Collaborating Brands
          </p>
        </div>
      </div>

      <div className="[&_.next-el]:bg-white/10 [&_.prev-el]:bg-white/10 [&_.next-el]:text-white [&_.prev-el]:text-white [&_img]:brightness-0 [&_img]:invert [&_img]:opacity-70">
        <PartnerSlider partners={partners} className="pt-8 pb-2 lg:pt-8 lg:pb-2" />
      </div>
    </section>
  );
};

export default InteriorSolutionsPositioning;
