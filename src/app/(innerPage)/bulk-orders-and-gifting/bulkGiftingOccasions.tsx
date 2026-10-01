"use client";

import { motion } from "framer-motion";
import { Briefcase, Building2, Gem, Hammer, Landmark, Sparkles } from "lucide-react";

const occasions = [
  {
    icon: Briefcase,
    title: "Corporate Gifting",
    description: "Client gifts, employee rewards, and conference giveaways that reflect your brand.",
  },
  {
    icon: Gem,
    title: "Weddings & Events",
    description: "Favours, return gifts, and keepsakes your guests will actually keep.",
  },
  {
    icon: Sparkles,
    title: "Festive & Occasion Gifting",
    description: "Diwali, Christmas, New Year, and every milestone worth celebrating.",
  },
  {
    icon: Hammer,
    title: "Custom Wooden Gifts",
    description: "Engraved and branded pieces made to your brief, in the quantity you need.",
  },
  {
    icon: Building2,
    title: "Hotels, Retail & Hospitality",
    description: "Bulk supply of handcrafted décor for properties, stores, and guest spaces.",
  },
  {
    icon: Landmark,
    title: "Organisations & Institutions",
    description: "Gifting for teams, associations, schools, and non-profits of every size.",
  },
];

const BulkGiftingOccasions = () => {
  return (
    <section id="occasions" className="bg-home-bg-1 lg:py-25 py-15 scroll-mt-24" aria-label="Gifting occasions and use cases">
      <div className="container">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Gifting For Every Occasion <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Who we craft for</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Whatever the size of your order, every piece is handcrafted with the same care.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              className="group/card flex h-full gap-5 rounded-2xl bg-background p-7 shadow-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform duration-500 group-hover/card:scale-105">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-lg font-medium text-secondary-foreground">{title}</p>
                <p className="mt-2 text-gray-1-foreground leading-[170%]">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BulkGiftingOccasions;
