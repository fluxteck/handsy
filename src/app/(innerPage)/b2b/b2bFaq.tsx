"use client";

import { motion } from "framer-motion";
import { Boxes, Globe2, Percent, Ruler, Truck, Wand2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const b2bFaqData = [
  {
    id: "one",
    icon: Boxes,
    title: "What is the minimum order quantity (MOQ) for wholesale?",
    ans: "MOQs typically start at 50 units per SKU, though this varies by product category and customization level. Our team will confirm exact MOQs when reviewing your quote request.",
  },
  {
    id: "two",
    icon: Wand2,
    title: "Can you produce custom or private-label designs?",
    ans: "Yes. We work with your specifications, sketches, or reference products to develop custom pieces, including size, wood species, finish, and branded packaging for private label.",
  },
  {
    id: "three",
    icon: Truck,
    title: "What are your typical production and lead times?",
    ans: "Standard catalog items usually ship within 3–4 weeks of order confirmation. Custom orders range from 5–8 weeks depending on complexity and quantity, and are confirmed upfront in your quote.",
  },
  {
    id: "four",
    icon: Globe2,
    title: "Do you ship internationally?",
    ans: "Yes, we regularly export to over 30 countries. We handle export documentation, freight coordination, and can ship via sea or air depending on your timeline and budget.",
  },
  {
    id: "five",
    icon: Ruler,
    title: "Can we request product samples before placing a bulk order?",
    ans: "Absolutely. Samples can be arranged for a fee, which is typically credited back against your first bulk order once confirmed.",
  },
  {
    id: "six",
    icon: Percent,
    title: "What payment terms do you offer B2B partners?",
    ans: "We generally require a deposit to confirm production, with the balance due before shipment. Established partners may qualify for extended terms — this is discussed during onboarding.",
  },
];

const B2bFaq = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="B2B frequently asked questions">
      <div className="container max-w-4xl">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            FAQ <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Business inquiries, answered</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Everything wholesalers, retailers, and distributors ask us before placing a bulk order.
          </p>
        </div>

        <div className="mt-10">
          <Accordion type="single" defaultValue="one" collapsible className="flex flex-col gap-4">
            {b2bFaqData.map(({ ans, id, title, icon: Icon }, index) => (
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

export default B2bFaq;
