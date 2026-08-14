"use client";

import { motion } from "framer-motion";
import { Store, Wand2, Truck, Globe2, Ruler, Percent } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const vendorFaqData = [
  {
    id: "one",
    icon: Store,
    title: "Who can apply to sell on Handsy?",
    ans: "Handsy is built for independent artisans, small studios, and makers producing handcrafted or artisan-made goods. We review every application to keep the marketplace curated and quality-focused.",
  },
  {
    id: "two",
    icon: Wand2,
    title: "Are there any fees to list my products?",
    ans: "There are no fees to apply or list your first products. We charge a transparent commission only when an item sells, so you never pay before you earn.",
  },
  {
    id: "three",
    icon: Truck,
    title: "How do I ship orders once I start selling?",
    ans: "You fulfill orders directly using your preferred courier, or connect a supported shipping partner from your vendor dashboard. Guidance is provided for both domestic and international shipments.",
  },
  {
    id: "four",
    icon: Globe2,
    title: "Can I sell to international buyers?",
    ans: "Yes. Once approved, your storefront is visible to shoppers across 30+ countries, with multi-currency pricing and export documentation support for cross-border orders.",
  },
  {
    id: "five",
    icon: Ruler,
    title: "Can I also sell in bulk or wholesale quantities?",
    ans: "Yes. Vendors can enable tiered wholesale pricing and appear to retailers, hospitality buyers, and corporate clients sourcing through Handsy for Business.",
  },
  {
    id: "six",
    icon: Percent,
    title: "How and when do I get paid?",
    ans: "Payouts are processed on a scheduled basis directly to your bank account, with a full transaction history available in your vendor dashboard.",
  },
];

const VendorFaq = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="Vendor frequently asked questions">
      <div className="container max-w-4xl">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            FAQ <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Vendor questions, answered</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Everything artisans and makers ask us before applying to sell on Handsy.
          </p>
        </div>

        <div className="mt-10">
          <Accordion type="single" defaultValue="one" collapsible className="flex flex-col gap-4">
            {vendorFaqData.map(({ ans, id, title, icon: Icon }, index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
              >
                <AccordionItem
                  value={id}
                  className="group border-b-0 rounded-2xl border border-gray-2 bg-background overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-3xl data-[state=open]:border-primary/40 data-[state=open]:shadow-3xl"
                >
                  <AccordionTrigger className="px-5 lg:px-7 py-5 lg:py-6 hover:no-underline gap-4">
                    <span className="flex items-center gap-4 text-left">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-bg-1 text-secondary-foreground transition-colors duration-500 group-hover:bg-primary group-hover:text-white group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                        <Icon className="size-4.5" />
                      </span>
                      <span className="text-secondary-foreground text-lg lg:text-xl font-medium leading-[141%]">
                        {title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-1-foreground text-base lg:text-lg leading-[170%] px-5 lg:px-7 pl-[4.75rem] lg:pl-[5.25rem]">
                    {ans}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default VendorFaq;
